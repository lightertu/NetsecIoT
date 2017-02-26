# NetsecIoT 6lowpan testbed
An IoT testbed using RIOT OS featuring 6lowpan (805.15.4) protcol.

## Components:
* Display Node
  - A http client including a web interface to control the IoT devices in the testbed
* Gateway Node
  - Coap Scanner
    - Periodcially Scans CoAP devices in the network and store the information of alive nodes in a cache
    - Provides `/api/devices` API to the outside world to get devices information
  - Coap Proxy
    - An access point to the testbed, it translates Http requests to CoAP request, so the outside world can
      can control the nodes in the testbed.
      
* RIOT IoT Node
  - Implements Netsec IoT Protocol
  - Implemented using RIOT OS, constrained device
  
* Non-Embedded IoT Node
  - Implements Netsec IoT Protocol
  - Runs non-embedded operating system, like Raspberry Pi

## Hardware
* Raspberry Pi 2 + Openlab 805.15.4 Radio Module
* 10 x Atmel SAM R21 Xplained Pro Evaluation Kit
  - Power constrained IoT nodes
  
## Software
* RIOT OS (RTOS that runs on embedded IoT devices)
* Node Coap (CoAP in Node.js)
* Californium (CoAP in Java)
* ReactJS (Client front-end framework)

## How to setup the testbed
* [Setup RIOT-OS development environment on Ubuntu for SAMR21-XPO Board](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/AtmelSAMR21-RIOT-Ubuntu)
* Setup a 6Lowpan and Openlab 802.15.4 radio enabled RPi
  - [Compile a new Kernal](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/RPi-802.15.4/6Lowpan-Kernel)
  - [Raspberry pi for 6Lowpan and libcoap](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/RPi-802.15.4/Config-RPi)
  - [Turn RPi a 6Lowpan Border Router](https://github.com/Lightertu/6Lowpan-testbed/tree/master/setups/RPi-802.15.4/RPi-6LBR)
