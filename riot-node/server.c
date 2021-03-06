/*
 * Copyright (c) Rui Tu
 *
 */

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "net/gcoap.h"
#include "od.h"
#include "fmt.h"

#include "./hardware/hardware.h"
#define UNUSED(x) (void)(x)

#define MAX_PAYLOAD_SIZE 120
#define URI_MAX_LEN 64

typedef struct {
    const char * path;
    const char * data_format;

} netsec_resource_t;

static void _resp_handler(unsigned req_state, coap_pkt_t* pdu);

/* resources */
static ssize_t _cli_stats_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _sensor_temperature_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _actuator_led_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _actuator_led_PUT_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _actuator_thermostat_PUT_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _actuator_thermostat_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _about_name_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _about_description_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);
static ssize_t _about_services_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len);

/* CoAP resources */
/* the pathnames have to be sorted alphabetically */
#define RESOURCE_COUNT 9
static const coap_resource_t _resources[RESOURCE_COUNT] = {
    { "/about/description", COAP_GET, _about_description_GET_handler },
    { "/about/name", COAP_GET, _about_name_GET_handler },
    { "/about/services", COAP_GET, _about_services_GET_handler },
    { "/actuator/led", COAP_PUT, _actuator_led_PUT_handler },
    { "/actuator/led", COAP_GET, _actuator_led_GET_handler },
    { "/actuator/thermostat", COAP_PUT, _actuator_thermostat_PUT_handler },
    { "/actuator/thermostat", COAP_GET, _actuator_thermostat_GET_handler },
    { "/cli/stats", COAP_GET, _cli_stats_GET_handler },
    { "/sensor/temperature", COAP_GET, _sensor_temperature_GET_handler },
};

static const netsec_resource_t _netsec_resources[] = {
    { "/sensor/temperature", "number"},
    { "/actuator/led", "boolean"},
    { "/actuator/thermostat", "number" },
    { NULL, NULL}, // Mark as the end of the endpoints
};


/* Counts requests sent by CLI. */
static uint16_t req_count = 0;

static char services_string[MAX_PAYLOAD_SIZE];
static gcoap_listener_t resource_listeners[RESOURCE_COUNT];

/*
 * Response callback.
 */
static void _resp_handler(unsigned req_state, coap_pkt_t* pdu)
{
    if (req_state == GCOAP_MEMO_TIMEOUT) {
        printf("gcoap: timeout for msg ID %02u\n", coap_get_id(pdu));
        return;
    }
    else if (req_state == GCOAP_MEMO_ERR) {
        printf("gcoap: error in response\n");
        return;
    }

    char *class_str = (coap_get_code_class(pdu) == COAP_CLASS_SUCCESS)
                            ? "Success" : "Error";
    printf("gcoap: response %s, code %1u.%02u", class_str,
                                                coap_get_code_class(pdu),
                                                coap_get_code_detail(pdu));
    if (pdu->payload_len) {
        if (pdu->content_type == COAP_FORMAT_TEXT
                || pdu->content_type == COAP_FORMAT_LINK
                || coap_get_code_class(pdu) == COAP_CLASS_CLIENT_FAILURE
                || coap_get_code_class(pdu) == COAP_CLASS_SERVER_FAILURE) {
            /* Expecting diagnostic payload in failure cases */
            printf(", %u bytes\n%.*s\n", pdu->payload_len, pdu->payload_len,
                                                          (char *)pdu->payload);
        }
        else {
            printf(", %u bytes\n", pdu->payload_len);
            od_hex_dump(pdu->payload, pdu->payload_len, OD_WIDTH_DEFAULT);
        }
    }
    else {
        printf(", empty payload\n");
    }
}

/*
 * Server callback for /cli/stats. Returns the count of packets sent by the
 * CLI.
 */
static ssize_t _cli_stats_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    size_t payload_len = fmt_u16_dec((char *)pdu->payload, req_count);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

/* callback for handling temperature data */
static ssize_t _sensor_temperature_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    size_t payload_len = fmt_u16_dec((char *)pdu->payload, read_temperature_dummy());
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

/* callback for handling led data */
static int LED_STATUS = 1;
static ssize_t _actuator_led_PUT_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    char ledstats_in[MAX_PAYLOAD_SIZE] = { 0 };

    memcpy(ledstats_in, pdu->payload, pdu->payload_len);
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);

    if (strcmp(ledstats_in, "1") == 0) {
        led_switch(ON);
        LED_STATUS = 1;
    } else if (strcmp(ledstats_in, "0") == 0) {
        led_switch(OFF);
        LED_STATUS = 0;
    } else {
        puts("unknown command");
    }
     
    size_t payload_len = fmt_u16_dec((char *)pdu->payload, LED_STATUS);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

static ssize_t _actuator_led_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    size_t payload_len = fmt_u16_dec((char *)pdu->payload, LED_STATUS);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}


/* callback for handling themostates data */
static int THEMOSTAT = 66;
static ssize_t _actuator_thermostat_PUT_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    char themostat_in[MAX_PAYLOAD_SIZE] = { 0 };
    memcpy(themostat_in, pdu->payload, pdu->payload_len);

    THEMOSTAT = atoi(themostat_in);
    printf("new themostat: %d\n", THEMOSTAT);

    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    size_t payload_len = fmt_u16_dec((char *)pdu->payload, THEMOSTAT);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

static ssize_t _actuator_thermostat_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    size_t payload_len = fmt_u16_dec((char *)pdu->payload, THEMOSTAT);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

static ssize_t _about_name_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    puts("get name fired");
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    const char *riot_name = RIOT_BOARD;
    size_t payload_len = strlen(riot_name);
    memcpy(pdu->payload, riot_name, payload_len);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

static ssize_t _about_description_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    puts("get description fired");
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    const char *description = "This is a embedded device";
    size_t payload_len = strlen(description);
    memcpy(pdu->payload, description, payload_len);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}

static ssize_t _about_services_GET_handler(coap_pkt_t* pdu, uint8_t *buf, size_t len) {
    puts("get service fired");
    gcoap_resp_init(pdu, buf, len, COAP_CODE_CONTENT);
    size_t payload_len = strlen(services_string);
    memcpy(pdu->payload, services_string, payload_len);
    return gcoap_finish(pdu, payload_len, COAP_FORMAT_TEXT);
}
/* ********************************* utility functions ********************************* */
static size_t _send(uint8_t *buf, size_t len, char *addr_str, char *port_str) {
    ipv6_addr_t addr;
    size_t bytes_sent;
    sock_udp_ep_t remote;

    remote.family = AF_INET6;
    remote.netif  = SOCK_ADDR_ANY_NETIF;

    /* parse destination address */
    if (ipv6_addr_from_str(&addr, addr_str) == NULL) {
        puts("gcoap_cli: unable to parse destination address");
        return 0;
    }
    memcpy(&remote.addr.ipv6[0], &addr.u8[0], sizeof(addr.u8));

    /* parse port */
    remote.port = (uint16_t)atoi(port_str);
    if (remote.port == 0) {
        puts("gcoap_cli: unable to parse destination port");
        return 0;
    }

    bytes_sent = gcoap_req_send2(buf, len, &remote, _resp_handler);
    if (bytes_sent > 0) {
        req_count++;
    }
    return bytes_sent;
}

int gcoap_cli_cmd(int argc, char **argv) {
    /* Ordered like the RFC method code numbers, but off by 1. GET is code 0. */
    char *method_codes[] = {"get", "post", "put"};
    uint8_t buf[GCOAP_PDU_BUF_SIZE];
    coap_pkt_t pdu;
    size_t len;

    if (argc == 1) {
        /* show help for main commands */
        goto end;
    }

    for (size_t i = 0; i < sizeof(method_codes) / sizeof(char*); i++) {
        if (strcmp(argv[1], method_codes[i]) == 0) {
            if (argc == 5 || argc == 6) {
                if (argc == 6) {
                    gcoap_req_init(&pdu, &buf[0], GCOAP_PDU_BUF_SIZE, i+1, argv[4]);
                    memcpy(pdu.payload, argv[5], strlen(argv[5]));
                    len = gcoap_finish(&pdu, strlen(argv[5]), COAP_FORMAT_TEXT);
                }
                else {
                    len = gcoap_request(&pdu, &buf[0], GCOAP_PDU_BUF_SIZE, i+1,
                                                                           argv[4]);
                }
                printf("gcoap_cli: sending msg ID %u, %u bytes\n", coap_get_id(&pdu),
                                                                   (unsigned) len);
                if (!_send(&buf[0], len, argv[2], argv[3])) {
                    puts("gcoap_cli: msg send failed");
                }
                return 0;
            }
            else {
                printf("usage: %s <get|post|put> <addr> <port> <path> [data]\n",
                                                                       argv[0]);
                return 1;
            }
        }
    }

    if (strcmp(argv[1], "info") == 0) {
        if (argc == 2) {
            uint8_t open_reqs;
            gcoap_op_state(&open_reqs);

            printf("CoAP server is listening on port %u\n", GCOAP_PORT);
            printf(" CLI requests sent: %u\n", req_count);
            printf("CoAP open requests: %u\n", open_reqs);
            return 0;
        }
    }

    end:
    printf("usage: %s <get|post|put|info>\n", argv[0]);
    return 1;
}
/* ************************************ custom utiliy functions**************************************** */

void add_resource_listeners(gcoap_listener_t* resource_listeners) {
    int i = 0;
    for (; i < RESOURCE_COUNT; i++) {
        gcoap_listener_t listener = {
            (coap_resource_t *)&_resources[i],
            sizeof(_resources) / sizeof(_resources[i]),
            NULL,
        };

        resource_listeners[i] = listener;
    }
}

void register_resource_listeners(gcoap_listener_t* resource_listeners) {
    int i = 0;
    for (; i < RESOURCE_COUNT; i++) {
        gcoap_register_listener(&resource_listeners[i]);
    }
}


/* stack for the advertising thread */
/* advertising string */
/* void *self_advertising_thread(void* args) { */
/*     int len; */
/*     char *uri = "ff02::1"; */
/*     char *path = "/devices"; */
/*     char *payload = (char *) args; */
/*     char *port = "6666"; */

/*     while (1) { */
/*         uint8_t buf[MAX_PAYLOAD_SIZE]; */
/*         coap_pkt_t pdu; */
/*         gcoap_req_init(&pdu, &buf[0], MAX_PAYLOAD_SIZE, COAP_POST, path); */
/*         memcpy(pdu.payload, payload, strlen(payload)); */
/*         len = gcoap_finish(&pdu, strlen(payload), COAP_FORMAT_TEXT); */
/*         if (!_send(&buf[0], len, uri, port)) { */
/*             puts("server: adversing message send failed"); */
/*             puts("re-advertise"); */
/*         } */ 

/*         xtimer_sleep(10); */
/*         puts("advertising"); */
/*     } */

/*     return NULL; */
/*  } */


int build_services_string(char * services_string, int bufsize) {
    int i = 0, slen = 0, cur_bufsize = bufsize;
    while (_netsec_resources[i].path != NULL) {
        if (slen >= bufsize) {
            printf("String is too long, maxsize is %d, actual size is %d\n", bufsize, slen);
            return 0;
        }

        cur_bufsize -= slen;
        slen += snprintf(services_string + slen, 
                         (size_t) cur_bufsize, "%s:%s,", 
                         _netsec_resources[i].path, 
                         _netsec_resources[i].data_format);
        i++;
    }

    return 1;
}



void gcoap_cli_init(void) {
    build_services_string(services_string, MAX_PAYLOAD_SIZE);
    add_resource_listeners(resource_listeners);
    register_resource_listeners(resource_listeners);

    /* if (build_services_string(services_string, MAX_PAYLOAD_SIZE)) { */
    /*     thread_create(self_advertising_thread_stack, */ 
    /*                   sizeof(self_advertising_thread_stack), */
    /*                   THREAD_PRIORITY_MAIN - 1, */ 
    /*                   THREAD_CREATE_STACKTEST, */ 
    /*                   self_advertising_thread, */ 
    /*                   services_string, */ 
    /*                   "self_advertising_thread" */
    /*     ); */
    /* } */
    
    printf("%s\n", services_string);
}
