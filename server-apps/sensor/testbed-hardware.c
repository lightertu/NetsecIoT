#include <string.h>
#include <random.h>
#include <led.h>
#include <xtimer.h>
#include "./include/testbed-hardware.h"


uint32_t read_temperature(void) {
    random_init(xtimer_now());
    uint32_t curtmp;
    curtmp = random_uint32_range(20, 30);

    return curtmp;
}

void led_switch(int on) {
    if (on) {
        LED0_ON;
    } else {
        LED0_OFF;
    }
}
