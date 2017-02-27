# NetsecIoT 6lowpan testbed
An IoT testbed using RIOT OS featuring 6lowpan (805.15.4) protcol.

## Components:
* **[Display Node](https://github.com/lightertu/NetsecIoT/tree/master/display-node)**
  - A http client including a web interface to control the IoT devices in the testbed
* **[Gateway Node](https://github.com/lightertu/NetsecIoT/tree/master/gateway-node)**
  - [Coap Scanner](https://github.com/lightertu/NetsecIoT/tree/master/gateway-node/coap-scanner)
    - Periodcially Scans CoAP devices in the network and store the information of alive nodes in a cache
    - Provides `/api/devices` API to the outside world to get devices information
  - [Coap Proxy](https://github.com/lightertu/NetsecIoT/tree/master/gateway-node/coap-proxy)
    - An access point to the testbed, it translates Http requests to CoAP request, so the outside world can
      can control the nodes in the testbed.
* **[RIOT IoT Node](https://github.com/lightertu/NetsecIoT/tree/master/riot-node)**
  - Implements Netsec IoT Protocol
  - Implemented using RIOT OS, constrained device  
* **[Non-Embedded IoT Node](https://github.com/lightertu/NetsecIoT/tree/master/rpi-node)**
  - Implements Netsec IoT Protocol
  - Runs non-embedded operating system, like Raspberry Pi

## Hardware
* Raspberry Pi 2 + Openlab 805.15.4 Radio Module
* 10 x Atmel SAM R21 Xplained Pro Evaluation Kit
  - Power constrained IoT nodes
  
## Software
* [RIOT OS](https://github.com/RIOT-OS/RIOT) (RTOS that runs on embedded IoT devices)
* [Node Coap](https://github.com/mcollina/node-coap) (CoAP in Node.js)
* [Californium](https://github.com/eclipse/californium) (CoAP in Java)
* [ReactJS](https://facebook.github.io/react/) (Client front-end framework)
