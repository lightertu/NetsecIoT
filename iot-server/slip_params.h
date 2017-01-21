/*
 * Copyright (c) Rui Tu
 *
 */

#ifndef SLIP_PARAMS_H
#define SLIP_PARAMS_H

#include "net/gnrc/slip.h"

#ifdef __cplusplus
extern "C" {
#endif

static gnrc_slip_params_t gnrc_slip_params[] = {
    {
        .uart = SLIP_UART,
        .baudrate = SLIP_BAUDRATE,
    },
};

#ifdef __cplusplus
}
#endif
#endif /* SLIP_PARAMS_H */
/** @} */
