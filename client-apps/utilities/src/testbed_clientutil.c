#ifndef WITH_POSIX
    #define WITH_POSIX
#endif

#ifndef _GNU_SOURCE
    #define _GNU_SOURCE     /* To get defns of NI_MAXSERV and NI_MAXHOST */
#endif

#include <stdio.h>
#include <arpa/inet.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netdb.h>
#include <ifaddrs.h>

#include "coap.h"
#include "../coap_list.h"
#include "../testbed_clientutil.h"

#define FLAGS_BLOCK 0x01

static str proxy = { 0, NULL };

static coap_list_t * new_option_node(unsigned short key, unsigned int length, unsigned char *data) {
  coap_list_t *node;

  node = coap_malloc(sizeof(coap_list_t) + sizeof(coap_option) + length);

  if (node) {
    coap_option *option;
    option = (coap_option *)(node->data);
    COAP_OPTION_KEY(*option) = key;
    COAP_OPTION_LENGTH(*option) = length;
    memcpy(COAP_OPTION_DATA(*option), data, length);
  } else {
    coap_log(LOG_DEBUG, "new_option_node: malloc\n");
  }

  return node;
}

static int order_opts(void *a, void *b) {
  coap_option *o1, *o2;

  if (!a || !b)
    return a < b ? -1 : 1;

  o1 = (coap_option *)(((coap_list_t *)a)->data);
  o2 = (coap_option *)(((coap_list_t *)b)->data);

  return (COAP_OPTION_KEY(*o1) < COAP_OPTION_KEY(*o2))
    ? -1
    : (COAP_OPTION_KEY(*o1) != COAP_OPTION_KEY(*o2));
}

void cmdline_uri(coap_list_t ** optlist, char *arg, coap_uri_t *uri) {
  unsigned char portbuf[2];
#define BUFSIZE 40
  unsigned char _buf[BUFSIZE];
  unsigned char *buf = _buf;
  size_t buflen;
  int res;

  if (proxy.length) {   /* create Proxy-Uri from argument */
    size_t len = strlen(arg);
    while (len > 270) {
      coap_insert(optlist,
                  new_option_node(COAP_OPTION_PROXY_URI,
                  270,
                  (unsigned char *)arg));

      len -= 270;
      arg += 270;
    }

    coap_insert(optlist,
                new_option_node(COAP_OPTION_PROXY_URI,
                len,
                (unsigned char *)arg));

  } else {      /* split arg into Uri-* options */
      coap_split_uri((unsigned char *)arg, strlen(arg), uri );

    if (uri->port != COAP_DEFAULT_PORT) {
      coap_insert(optlist,
                  new_option_node(COAP_OPTION_URI_PORT,
                  coap_encode_var_bytes(portbuf, uri->port),
                  portbuf));
    }

    if (uri->path.length) {
      buflen = BUFSIZE;
      res = coap_split_path(uri->path.s, uri->path.length, buf, &buflen);

      while (res--) {

        printf("res: %d, buf %s, buflen: %d\n", res, COAP_OPT_VALUE(buf), COAP_OPT_LENGTH(buf));

        coap_insert(optlist,
                    new_option_node(COAP_OPTION_URI_PATH,
                    COAP_OPT_LENGTH(buf),
                    COAP_OPT_VALUE(buf)));

        buf += COAP_OPT_SIZE(buf);
      }
    }

    if (uri->query.length) {
      buflen = BUFSIZE;
      buf = _buf;
      res = coap_split_query(uri->query.s, uri->query.length, buf, &buflen);

      while (res--) {
        coap_insert(optlist,
                    new_option_node(COAP_OPTION_URI_QUERY,
                    COAP_OPT_LENGTH(buf),
                    COAP_OPT_VALUE(buf)));

        buf += COAP_OPT_SIZE(buf);
      }
    }
  }
}


char * getipv6ifaddr(int interface, int islocal)
{
   struct ifaddrs *ifaddr, *ifa;
   int family, s, n;
   char host[NI_MAXHOST];
   char * interface_name;
   char * result;

   if (getifaddrs(&ifaddr) == -1) {
       perror("getifaddrs");
       exit(EXIT_FAILURE);
   }

   /* Walk through linked list, maintaining head pointer so we
      can free list later */

   /* get the interface */
   switch (interface) {
       case(LOWPAN):
           interface_name = "lowpan0";
           break;
       case(ETH):
           interface_name = "eth0";
           break;
       default:
           printf("Cannot regonize interface code %d", interface);
           exit(EXIT_FAILURE);
           freeifaddrs(ifaddr);
           break;
   }

   for (ifa = ifaddr, n = 0; ifa != NULL; ifa = ifa->ifa_next, n++) {
       if (ifa->ifa_addr == NULL)
           continue;

       family = ifa->ifa_addr->sa_family;

       if (family == AF_INET6 && (strcmp(ifa->ifa_name, interface_name) == 0) ) {
           s = getnameinfo(ifa->ifa_addr, sizeof(struct sockaddr_in6),
                   host, NI_MAXHOST,
                   NULL, 0, NI_NUMERICHOST);
           if (s != 0) {
               printf("getnameinfo() failed: %s\n", gai_strerror(s));
               exit(EXIT_FAILURE);
           }

           char* localaddr_mark = strchr(host, '%');

           if (localaddr_mark != NULL && islocal) {
               *(localaddr_mark + 0) = '\0';
               result = host;
               break;
           } 
           
           if (localaddr_mark == NULL && !islocal) {
               result = host;
               break;
           }
       } 
   }

   freeifaddrs(ifaddr);
   return result;
}


// here server is uri.host
int resolve_address(const str *urihost, struct sockaddr *dst) {
  struct addrinfo *res, *ainfo;
  struct addrinfo hints;
  static char addrstr[256];
  int error, len=-1;

  memset(addrstr, 0, sizeof(addrstr));
  if (urihost->length)
    memcpy(addrstr, urihost->s, urihost->length);
  else
    memcpy(addrstr, "localhost", 9);

  memset ((char *)&hints, 0, sizeof(hints));
  hints.ai_socktype = SOCK_DGRAM;
  hints.ai_family = AF_UNSPEC;

  error = getaddrinfo(addrstr, NULL, &hints, &res);

  if (error != 0) {
    fprintf(stderr, "getaddrinfo: %s\n", gai_strerror(error));
    return error;
  }

  for (ainfo = res; ainfo != NULL; ainfo = ainfo->ai_next) {
    switch (ainfo->ai_family) {
    case AF_INET6:
    case AF_INET:
      len = ainfo->ai_addrlen;
      memcpy(dst, ainfo->ai_addr, len);
      goto finish;
    default:
      ;
    }
  }


 finish:
  freeaddrinfo(res);
  return len;
}    

coap_pdu_t * coap_new_request(coap_context_t *ctx,
                 const method_t m,
                 coap_list_t **options,
                 const str * token,
                 const coap_block_t* block,
                 const int * flags,
                 const unsigned char msgtype,
                 unsigned char *data,
                 size_t length) {
  coap_pdu_t *pdu;
  coap_list_t *opt;

  if ( ! ( pdu = coap_new_pdu() ) )
    return NULL;

  pdu->hdr->type = msgtype;
  pdu->hdr->id = coap_new_message_id(ctx);
  pdu->hdr->code = m;

  pdu->hdr->token_length = token->length;
  if ( !coap_add_token(pdu, token->length, token->s)) {
    debug("cannot add token to request\n");
  }

  coap_show_pdu(pdu);

  if (options) {
    /* sort options for delta encoding */
    LL_SORT((*options), order_opts);

    LL_FOREACH((*options), opt) {
      coap_option *o = (coap_option *)(opt->data);
      coap_add_option(pdu,
                      COAP_OPTION_KEY(*o),
                      COAP_OPTION_LENGTH(*o),
                      COAP_OPTION_DATA(*o));
    }
  }

  if (length) {
    if (((*flags) & FLAGS_BLOCK) == 0)
      coap_add_data(pdu, length, data);
    else
      coap_add_block(pdu, length, data, block->num, block->szx);
  }

  return pdu;
}
