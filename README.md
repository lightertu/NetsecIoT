Someone forgot to log out of their github account on this mlh laptop.

# 6Lowpan-testbed
An IoT testbed using RIOT OS featuring 6lowpan (805.15.4) protcol.

## Hardware
* 2 x Raspberry Pi 2 + Openlab 805.15.4 Radio Module
  - 6Lowpan Border Router
  - Local logic client
  
* 10 x Atmel SAM R21 Xplained Pro Evaluation Kit
  - Power constrained IoT nodes
  
## Software
* RIOT OS
* libcoap

## How to setup the testbed
* [Setup RIOT-OS development environment on Ubuntu for SAMR21-XPO Board](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/AtmelSAMR21-RIOT-Ubuntu)
* Setup a 6Lowpan and Openlab 802.15.4 radio enabled RPi
  - [Compile a new Kernal](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/RPi-802.15.4/6Lowpan-Kernel)
  - [Raspberry pi for 6Lowpan and libcoap](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/RPi-802.15.4/Config-RPi)
  - [Turn RPi a 6Lowpan Border Router](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/RPi-802.15.4/RPi-6LBR)
