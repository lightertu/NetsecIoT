# Gateway Node

Gateway node provides two main funcitons
* A **Scanner** which gathers information of availible CoAP devices that implements **NetsecIoT Testbed Protocol** in the network and provides `/devices` API for outsiders to gain knowledge of the testbed.
* A **CoAP Proxy** which allows http clients to talk to CoAP node using `http://gatwaynodeIp:5863/proxy/coap://[IoTdeviceIPAddress]:5863/sensor/temperature`

## How to run Gatway Node
For now you have two run two programs seperately but I will create a script soon so they can be run together using
one command. 
* [Coap Scanner](https://github.com/lightertu/NetsecIoT/tree/master/gateway-node/coap-scanner)
* [Coap Proxy](https://github.com/lightertu/NetsecIoT/tree/master/gateway-node/coap-proxy)
