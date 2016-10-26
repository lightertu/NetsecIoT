#include "coap.h"
#include "../utilities/coap_list.h"
#include <stdio.h>

/*
 * The response handler
 */ 
static void
message_handler(struct coap_context_t *ctx, const coap_endpoint_t *local_interface, 
                const coap_address_t *remote, coap_pdu_t *sent, coap_pdu_t *received, 
                const coap_tid_t id) 
{
    unsigned char* data;
    size_t         data_len;
    printf("received response code: %d\n", COAP_RESPONSE_CLASS(received->hdr->code));
    if (COAP_RESPONSE_CLASS(received->hdr->code) == 2) 
    {
        if (coap_get_data(received, &data_len, &data))
        {
            printf("Received: %s\n", data);
        }
    }
}


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

static coap_list_t *optlist = NULL;


int main(int argc, char* argv[])
{
    coap_context_t*   ctx; /* coap packet */
    coap_address_t    dst_addr, src_addr;
    static coap_uri_t uri;
    fd_set            readfds; 
    coap_pdu_t*       request;
    const char*       server_uri = "coap://[fe80::5844:2342:656a:f846]/.well-known/core";
    unsigned char     get_method = 1;
    /* Prepare coap socket*/
    coap_address_init(&src_addr);
    src_addr.addr.sin6.sin6_family      = AF_INET6;
    src_addr.addr.sin6.sin6_port        = htons(0);
    src_addr.addr.sin6.sin6_scope_id    = 5;
    //inet_pton(AF_INET6, "fe80::1ac0:ffee:1ac0:ffee", &(src_addr.addr.sin6.sin6_addr) );
    inet_pton(AF_INET6, "::", &(src_addr.addr.sin6.sin6_addr) );
    ctx = coap_new_context(&src_addr);

    /* The destination endpoint */
    coap_address_init(&dst_addr);
    dst_addr.addr.sin6.sin6_family      = AF_INET6;
    dst_addr.addr.sin6.sin6_port        = htons(5683);
    inet_pton(AF_INET6, "fe80::5844:2342:656a:f846", &(dst_addr.addr.sin6.sin6_addr) );

    /* Prepare the request */
    coap_split_uri(server_uri, strlen(server_uri), &uri);
    printf("uri path is: %s\n", uri.path.s);
    printf("uri host is: %s\n", uri.host.s);
    printf("uri port is: %d\n", uri.port);

    unsigned char _buf[40];
    unsigned char * buf = _buf;
    size_t buflen;
    printf("uri path.length: %d\n", uri.path.length);
    int res = coap_split_path(uri.path.s, uri.path.length, buf, &buflen);

    while (res--) {
        coap_insert(&optlist, new_option_node(COAP_OPTION_URI_PATH, COAP_OPT_LENGTH(buf), COAP_OPT_VALUE(buf)));
        buf += COAP_OPT_SIZE(buf);
    }

    /* added option objects to an option list to be continued */
    request            = coap_new_pdu();    
    request->hdr->type = COAP_MESSAGE_CON;
    request->hdr->id   = coap_new_message_id(ctx);
    request->hdr->code = COAP_REQUEST_GET;
    //coap_add_option(request, COAP_OPTION_URI_PATH, uri.path.length, uri.path.s);

    unsigned char * s1 = "riot";
    unsigned char * s2 = "board";
    coap_add_option(request, COAP_OPTION_URI_PATH, strlen(s1), s1);
    coap_add_option(request, COAP_OPTION_URI_PATH, strlen(s2), s2);

    /* Set the handler and send the request */
    coap_register_response_handler(ctx, message_handler);
    coap_send_confirmed(ctx, ctx->endpoint, &dst_addr, request);

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
