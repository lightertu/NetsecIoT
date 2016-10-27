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

int resolve_address(const str *urihost, struct sockaddr *dst);

void cmdline_uri(coap_list_t ** ll, char *arg, coap_uri_t *uriArg);

#define LOWPAN 1 // 6lowpan interface
#define ETH 0    // ethernet 
#define LOCAL 1    // ethernet 
#define GLOBAL 0    // ethernet 

/* return a char * of the ipv6 address of a given interface
 * interface takes values from { ETH: eth0, LOWPAN: lowpan0 } (see marco definition)
 * isLocalAddr takes LOCAL or GLOBAL
 * example: char * lowpan0_local_addr = getaddr_if(LOWPAN, LOCAL);
 * */
char * getipv6ifaddr(int interface, int isLocalAddr);

#endif
