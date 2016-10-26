/* have to specify which system in am writing the code for */ 
#ifndef WITH_POSIX
    #define WITH_POSIX
#endif

#include <stdio.h>
#include <arpa/inet.h>

#include "coap.h"
#include "../utilities/coap_list.h"
#include "../utilities/testbed_ipv6addr.h"
#include "testbed_clientutil.h"

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

int main(int argc, char* argv[])
{
    coap_context_t*   ctx; /* coap packet */
    coap_address_t    dst_addr, src_addr;
    static coap_uri_t uri;
    fd_set            readfds; 
    coap_pdu_t*       pdu;
    char* server_uri = "coap://[fe80::5844:2342:656a:f846]/riot/board";
    char * src_lowpan_local = getipv6ifaddr(LOWPAN, LOCAL);
    coap_list_t *optlist = NULL;

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
    cmdline_uri(&optlist, server_uri, &uri);

    /* populate pdu with options */
    LL_SORT(optlist, order_opts);
    coap_list_t * opt;
    LL_FOREACH((optlist), opt) {
        printf("noshit\n");
      coap_option *o = (coap_option *)(opt->data);
      coap_add_option(pdu,
                      COAP_OPTION_KEY(*o),
                      COAP_OPTION_LENGTH(*o),
                      COAP_OPTION_DATA(*o));
    }

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
