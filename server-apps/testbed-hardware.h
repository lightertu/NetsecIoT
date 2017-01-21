/*
 * Copyright (C) 2016 Rui Tu <ruit@uoregon.edu>
 *
 */
#ifndef _TEST_BED_HARDWARE_H_
#define _TEST_BED_HARDWARE_H_
#include <string.h>
#include <random.h>
#include <led.h>

#define ON 1
#define OFF 0
#define TOGGLE 2

#define I2C_INTERFACE I2C_DEV(0)    /* I2C interface number */
#define SENSOR_ADDR   (0x48 | 0x07) /* I2C temperature address on sensor */
#define INTERVAL      (5000000U)    /* set interval to 5 seconds */

uint32_t read_temperature_dummy(void);
void led_switch(int);

/*  to use the read temperature function first write these code
    int init = i2c_init_master(I2C_INTERFACE, I2C_SPEED_NORMAL);
    if (init == -1) {
        puts("Error: Init: Given device not available\n");
        return 1;
    }
    else if (init == -2) {
        puts("Error: Init: Unsupported speed value\n");
        return 1;
    }
    else {
        printf("I2C interface %i successfully initialized as master!\n", I2C_INTERFACE);
*/
int read_temperature(void);

#endif
