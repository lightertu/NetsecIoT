/*
 * Copyright (c) Rui Tu
 *
 */

#include <stdio.h>
#include "msg.h"

#include "net/gcoap.h"
#include "kernel_types.h"
#include "shell.h"

#define MAIN_QUEUE_SIZE (4)
static msg_t _main_msg_queue[MAIN_QUEUE_SIZE];

extern int gcoap_cli_cmd(int argc, char **argv);
extern void gcoap_cli_init(void);

static const shell_command_t shell_commands[] = {
    { "coap", "CoAP Application", gcoap_cli_cmd },
    { NULL, NULL, NULL }
};

int main(void) {
    /* for the thread running the shell */
    msg_init_queue(_main_msg_queue, MAIN_QUEUE_SIZE);
    gcoap_cli_init();
    puts("RIOT Node start");

    /* start shell */
    puts("All up, running the shell now");
    char line_buf[SHELL_DEFAULT_BUFSIZE];
    shell_run(shell_commands, line_buf, SHELL_DEFAULT_BUFSIZE);

    /* should never be reached */
    return 0;
}
