#ifndef _TESTBED_CLIENTUTIL_H_
#define _TESTBED_CLIENTUTIL_H_

#ifndef WITH_POSIX
    #define WITH_POSIX
#endif

#include <stdio.h>
#include <arpa/inet.h>

#include "coap.h"
#include "../utilities/coap_list.h"
#include "../utilities/testbed_ipv6addr.h"

typedef unsigned char method_t;

coap_list_t * new_option_node(unsigned short key, unsigned int length, unsigned char *data);

int order_opts(void *a, void *b);

void cmdline_uri(coap_list_t ** ll, char *arg, coap_uri_t *uriArg);
#endif
