/*
 * Copyright (C) 2016 Rui Tu <ruit@uoregon.edu>
 *
 */
#include <string.h>
#include <random.h>
#include <led.h>
#include <xtimer.h>
#include "periph_conf.h"
#include "periph/i2c.h"
#include "testbed-hardware.h"
#include <stdio.h>


uint32_t read_temperature_dummy(void) {
    random_init(20);
    uint32_t curtmp;
    curtmp = random_uint32_range(20, 30);

    return curtmp;
}

void led_switch(int status) {
    if (status == ON) {
        LED0_ON;
    } else if (status == OFF){
        LED0_OFF;
    } else if (status == TOGGLE) {
        LED0_TOGGLE;
    }
}


int read_temperature(void) {
    uint16_t temperature;
    char buffer[2] = { 0 };
    /* read temperature register on I2C bus */
    if (i2c_read_bytes(I2C_INTERFACE, SENSOR_ADDR, buffer, 2) < 0) {
	printf("Error: cannot read at address %i on I2C interface %i\n",
	       SENSOR_ADDR, I2C_INTERFACE);
	return -1;
    }
    
    uint16_t data = (buffer[0] << 8) | buffer[1];
    int8_t sign = 1;
    /* Check if negative and clear sign bit. */
    if (data & (1 << 15)) {
	sign *= -1;
	data &= ~(1 << 15);
    }
    /* Convert to temperature */
    data = (data >> 5);
    temperature = data * sign * 0.125;
    return (int)temperature;
}
