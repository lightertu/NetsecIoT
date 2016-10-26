#ifndef WITH_POSIX
    #define WITH_POSIX
#endif

#include <stdio.h>
#include <arpa/inet.h>

#include "coap.h"
#include "../utilities/coap_list.h"
#include "../utilities/testbed_ipv6addr.h"
#include "testbed_clientutil.h"

static str proxy = { 0, NULL };

coap_list_t * new_option_node(unsigned short key, unsigned int length, unsigned char *data) {
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


int order_opts(void *a, void *b) {
  coap_option *o1, *o2;

  if (!a || !b)
    return a < b ? -1 : 1;

  o1 = (coap_option *)(((coap_list_t *)a)->data);
  o2 = (coap_option *)(((coap_list_t *)b)->data);

  return (COAP_OPTION_KEY(*o1) < COAP_OPTION_KEY(*o2))
    ? -1
    : (COAP_OPTION_KEY(*o1) != COAP_OPTION_KEY(*o2));
}


void cmdline_uri(coap_list_t ** optlist, char *arg, coap_uri_t *uriArg) {
  unsigned char portbuf[2];
#define BUFSIZE 40
  unsigned char _buf[BUFSIZE];
  unsigned char *buf = _buf;
  size_t buflen;
  int res;
  coap_uri_t uri = *(uriArg);

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
      coap_split_uri((unsigned char *)arg, strlen(arg), &uri );

    if (uri.port != COAP_DEFAULT_PORT) {
      coap_insert(optlist,
                  new_option_node(COAP_OPTION_URI_PORT,
                  coap_encode_var_bytes(portbuf, uri.port),
                  portbuf));
    }

    if (uri.path.length) {
      buflen = BUFSIZE;
      res = coap_split_path(uri.path.s, uri.path.length, buf, &buflen);

      while (res--) {

        printf("res: %d, buf %s, buflen: %d\n", res, COAP_OPT_VALUE(buf), COAP_OPT_LENGTH(buf));

        coap_insert(optlist,
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
        coap_insert(optlist,
                    new_option_node(COAP_OPTION_URI_QUERY,
                    COAP_OPT_LENGTH(buf),
                    COAP_OPT_VALUE(buf)));

        buf += COAP_OPT_SIZE(buf);
      }
    }
  }
}

