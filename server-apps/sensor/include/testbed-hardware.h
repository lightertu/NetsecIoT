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

uint32_t read_temperature(void);
void led_switch(int);

#endif
