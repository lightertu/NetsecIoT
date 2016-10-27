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

int resolve_address(const str *urihost, struct sockaddr *dst);

/* given a head of linkedlist, uri, string, and a uri object, it will populate the linked list with options and
 * uri object with uri information
 * */
void cmdline_uri(coap_list_t ** ll, char *arg, coap_uri_t *uri);

coap_pdu_t * coap_new_request(coap_context_t *ctx,
                 const method_t m,                      // GET POST PUT or DELETE 
                 coap_list_t **options,                 // A head of linkedlist of options
                 const str * token,                     // token
                 const coap_block_t* block,             // block
                 const int * flags,
                 const unsigned char msgtype,           // COAP_MESSAGE_NON or COAP_MESSAGE_CON and etc..
                 unsigned char *data,                   // payload
                 size_t length                          // payload length
                 );

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
