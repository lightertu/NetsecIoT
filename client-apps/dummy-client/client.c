/* have to specify which system in am writing the code for */ 
#ifndef WITH_POSIX
    #define WITH_POSIX
#endif

#include <stdio.h>
#include <arpa/inet.h>

#include "coap.h"
#include "../utilities/coap_list.h"
#include "../utilities/testbed_ipv6addr.h"

#define FLAGS_BLOCK 0x01

typedef unsigned char method_t;
unsigned char msgtype = COAP_MESSAGE_CON;
static unsigned char _token_data[8];
str the_token = { 0, _token_data };
int flags = 0;
coap_block_t block = { .num = 0, .m = 0, .szx = 6 };
static str proxy = { 0, NULL };
static unsigned short proxy_port = COAP_DEFAULT_PORT;

coap_list_t *optlist = NULL;

/*
 * The response handler
 */ 
static void
message_handler(struct coap_context_t *ctx, const coap_endpoint_t *local_interface, 
                const coap_address_t *remote, coap_pdu_t *sent, coap_pdu_t *received, 
                const coap_tid_t id) {

    unsigned char* data;
    size_t         data_len;
    printf("received response code: %d\n", COAP_RESPONSE_CLASS(received->hdr->code));
    if (COAP_RESPONSE_CLASS(received->hdr->code) == 2) {
        if (coap_get_data(received, &data_len, &data)) {
            printf("Received: %s\n", data);
        }
    }
}


static coap_list_t * new_option_node(unsigned short key, unsigned int length, unsigned char *data) {
  coap_list_t *node;
  //printf("created new node\n");

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





static coap_pdu_t * coap_new_request(coap_context_t *ctx,
                     method_t m,
                     coap_list_t **options,
                     unsigned char *data,
                     size_t length) {
  coap_pdu_t *pdu;
  coap_list_t *opt;

  if ( ! ( pdu = coap_new_pdu() ) )
    return NULL;

  pdu->hdr->type = msgtype;
  pdu->hdr->id = coap_new_message_id(ctx);
  pdu->hdr->code = m;

  pdu->hdr->token_length = the_token.length;
  if ( !coap_add_token(pdu, the_token.length, the_token.s)) {
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
    if ((flags & FLAGS_BLOCK) == 0)
      coap_add_data(pdu, length, data);
    else
      coap_add_block(pdu, length, data, block.num, block.szx);
  }

  return pdu;
}


static void cmdline_uri(char *arg, coap_uri_t *request) {
  unsigned char portbuf[2];
#define BUFSIZE 40
  unsigned char _buf[BUFSIZE];
  unsigned char *buf = _buf;
  size_t buflen;
  int res;
  coap_uri_t uri = *(request);

  if (proxy.length) {   /* create Proxy-Uri from argument */
    size_t len = strlen(arg);
    while (len > 270) {
      coap_insert(&optlist,
                  new_option_node(COAP_OPTION_PROXY_URI,
                  270,
                  (unsigned char *)arg));

      len -= 270;
      arg += 270;
    }

    coap_insert(&optlist,
                new_option_node(COAP_OPTION_PROXY_URI,
                len,
                (unsigned char *)arg));

  } else {      /* split arg into Uri-* options */
      coap_split_uri((unsigned char *)arg, strlen(arg), &uri );

    if (uri.port != COAP_DEFAULT_PORT) {
      coap_insert(&optlist,
                  new_option_node(COAP_OPTION_URI_PORT,
                  coap_encode_var_bytes(portbuf, uri.port),
                  portbuf));
    }

    if (uri.path.length) {
      buflen = BUFSIZE;
      res = coap_split_path(uri.path.s, uri.path.length, buf, &buflen);

      while (res--) {

        //printf("res: %d, buf %s, buflen: %d\n", res, COAP_OPT_VALUE(buf), COAP_OPT_LENGTH(buf));

        coap_insert(&optlist,
                    new_option_node(COAP_OPTION_URI_PATH,
                    COAP_OPT_LENGTH(buf),
                    COAP_OPT_VALUE(buf)));

        buf += COAP_OPT_SIZE(buf);
      }
    }

    if (uri.query.length) {
      buflen = BUFSIZE;
      buf = _buf;
      res = coap_split_query(uri.query.s, uri.query.length, buf, &buflen);

      while (res--) {
        coap_insert(&optlist,
                    new_option_node(COAP_OPTION_URI_QUERY,
                    COAP_OPT_LENGTH(buf),
                    COAP_OPT_VALUE(buf)));

        buf += COAP_OPT_SIZE(buf);
      }
    }
  }
}


int main(int argc, char* argv[])
{
    coap_context_t*   ctx; /* coap packet */
    coap_address_t    dst_addr, src_addr;
    static coap_uri_t uri;
    fd_set            readfds; 
    coap_pdu_t*       pdu;
    char* server_uri = "coap://[fe80::5844:2342:656a:f846]/riot/board";
    char * src_lowpan_local = getipv6ifaddr(LOWPAN, LOCAL);
    /* Prepare coap socket*/
    coap_address_init(&src_addr);
    src_addr.addr.sin6.sin6_family      = AF_INET6;
    src_addr.addr.sin6.sin6_port        = htons(0);
    src_addr.addr.sin6.sin6_scope_id    = 5;
    inet_pton(AF_INET6, src_lowpan_local, &(src_addr.addr.sin6.sin6_addr) );
    ctx = coap_new_context(&src_addr);

    /* The destination endpoint */
    coap_address_init(&dst_addr);
    dst_addr.addr.sin6.sin6_family      = AF_INET6;
    dst_addr.addr.sin6.sin6_port        = htons(5683);
    inet_pton(AF_INET6, "fe80::5844:2342:656a:f846", &(dst_addr.addr.sin6.sin6_addr) );

    /* added option objects to an option list to be continued */
    pdu            = coap_new_pdu();    
    pdu->hdr->type = COAP_MESSAGE_CON;
    pdu->hdr->id   = coap_new_message_id(ctx);
    pdu->hdr->code = COAP_REQUEST_GET;
    //coap_add_option(pdu, COAP_OPTION_URI_PATH, uri.path.length, uri.path.s);

    /* at this point coap_list should be populated */
    cmdline_uri(server_uri, &uri);


    LL_SORT(optlist, order_opts);

    coap_list_t * opt;
    LL_FOREACH((optlist), opt) {
      coap_option *o = (coap_option *)(opt->data);
      coap_add_option(pdu,
                      COAP_OPTION_KEY(*o),
                      COAP_OPTION_LENGTH(*o),
                      COAP_OPTION_DATA(*o));
    }



    //const char * s1 = "riot";
    //const char * s2 = "board";
    //coap_add_option(pdu, COAP_OPTION_URI_PATH, strlen(s1), (unsigned char *) s1);
    //coap_add_option(pdu, COAP_OPTION_URI_PATH, strlen(s2), (unsigned char *) s2);
    /* Set the handler and send the pdu */
    coap_register_response_handler(ctx, message_handler);
    coap_send_confirmed(ctx, ctx->endpoint, &dst_addr, pdu);

    FD_ZERO(&readfds);
    FD_SET( ctx->sockfd, &readfds );
    int result = select( FD_SETSIZE, &readfds, 0, 0, NULL );

    if ( result < 0 ) /* socket error */
    {
        exit(EXIT_FAILURE);
    } 
    else if ( result > 0 && FD_ISSET( ctx->sockfd, &readfds )) /* socket read*/
    {    
            coap_read( ctx );       
    } 

    return 0;
}
