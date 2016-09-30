# Spice up Raspbian for the IoT

## Overview

Using the basic WPAN enabled Raspbian image we created using [the first guide](https://github.com/RIOT-Makers/wpan-raspbian/wiki/Create-a-generic-Raspbian-image-with-6LoWPAN-support), we now want to add some software and convenience functionality to use the Pi in IoT projects. That means to init a 6LoWPAN device on system startup and add support for common IoT protocols to Raspbian.

## Install useful tools and packages

* useful tools when using the terminal
```
sudo apt install vim screen htop cmake
```
* some Python add ons 
```
sudo apt install virtualenv python-all-dev python-pip python3-pip
```

## Systemd lowpan

Wouldn't it be nice to have your 6LoWPAN network interface up and running right on system boot? Unfortunately, wpan integration is not fully functionally so you cannot setup these devices using `/etc/network/interfaces` like for your other ethernet or wlan interfaces such as `eth0` or `wlan0`. However, with a little work around providing some helper scripts and a system service definition you can achieve the same. Proceed as follows:

* first clone this repository
```
sudo mkdir -p /opt/src
sudo chown pi /opt/src
cd /opt/src
git clone https://github.com/riot-makers/wpan-raspbian
cd wpan-raspbian
```
* next copy some helper (shell) scripts to a well-known location:
```
sudo cp -r usr/local/sbin/* /usr/local/sbin/.
sudo chmod +x /usr/local/sbin/*
```
* afterwards copy files for _systemd_ integration
```
sudo cp etc/default/lowpan /etc/default/.
sudo cp etc/systemd/system/lowpan.service /etc/systemd/system/.
```
* modify _channel_ and _pan id_ in `/etc/default/lowpan` as needed
* _optional_ you can also set the MAC/LLADDR of the lowpan interface, it changes with every boot on default
* and finally activate the low pan autostart in systemd
```
sudo systemctl enable lowpan.service
```
* you can check if everything works as expected by running
```
sudo systemctl start lowpan.service
ifconfig
# ^^^^ you should see a lowpan0 device, and wpan0
sudo systemctl stop lowpan.service
ifconfig
# ^^^^ lowpan0 device should be gone, only wpan0 
```

##Test to See if Everything Works fine
If you type `ifconfig` on RPi you will see what's below. 
```
eth0      Link encap:Ethernet  HWaddr b8:27:eb:27:4c:14
          inet6 addr: fe80::cdb8:9f89:b0de:bd3e/64 Scope:Link
          UP BROADCAST MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

lo        Link encap:Local Loopback
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:137 errors:0 dropped:0 overruns:0 frame:0
          TX packets:137 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:11576 (11.3 KiB)  TX bytes:11576 (11.3 KiB)

lowpan0   Link encap:UNSPEC  HWaddr 18-C0-FF-EE-1A-C0-FF-EE-00-00-00-00-00-00-00-00
***********************************************************************************
          inet6 addr: fdaa:bb:cc:dd::1/64 Scope:Global
          inet6 addr: fe80::1ac0:ffee:1ac0:ffee/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1280  Metric:1
          RX packets:24 errors:0 dropped:0 overruns:0 frame:0
          TX packets:31 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1
          RX bytes:1536 (1.5 KiB)  TX bytes:5393 (5.2 KiB)

wlan0     Link encap:Ethernet  HWaddr 5c:f3:70:03:72:9b
          inet addr:192.168.1.155  Bcast:192.168.1.255  Mask:255.255.255.0
          inet6 addr: fe80::5344:5c3b:b1a8:79c7/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:1346 errors:0 dropped:402 overruns:0 frame:0
          TX packets:401 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000
          RX bytes:236913 (231.3 KiB)  TX bytes:61764 (60.3 KiB)


wpan0     Link encap:UNSPEC  HWaddr 18-C0-FF-EE-1A-C0-FF-EE-00-00-00-00-00-00-00-00
***********************************************************************************
          UP BROADCAST RUNNING NOARP  MTU:123  Metric:1
          RX packets:24 errors:0 dropped:0 overruns:0 frame:0
          TX packets:58 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:300
          RX bytes:672 (672.0 B)  TX bytes:5565 (5.4 KiB)
```
Look for if you have the `lowpan0` and wpan0` interfaces running. If everything looks promising
you can go ahead to ping the RPi from our SAMR21

* First you find which channel is our 802.15.4 radio on by issuing
```
iwpan phy
```
you will see something like
```
........
wpan_phy phy0
supported channels:
        page 0: 11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26
        current_page: 0
        current_channel: 26,  2480 MHz
        *******************
        cca_mode: (1) Energy above threshold
        cca_ed_level: -77
        tx_power: 4
.......,
```
* Second, From running the `ifconfig` above we can get the global IPv6 address as well as the 
link scope IPv6 address of RPi

* Third, we start SAMR21's RIOT OS terminal by issuing `make term`
in the terminal you will type:
```bash

# according to my example
ifconfig 7 set channel 26 

# set the global IPv6 address of RPi
# "inet6 addr: fdaa:bb:cc:dd::1/64 Scope:Global" from ifconfig
ifconfig 7 add ffdaa:00bb:00cc:00dd:0000:1/64

# Set default route
# "inet6 addr: fe80::1ac0:ffee:1ac0:ffee/64 Scope:Link" from ifconfig
fibroute add :: via fe80::1ac0:ffee:1ac0:ffee/64
```
* Then you ping the RPi
```
# ping RPI's global address
ping6 3 fdaa:bb:cc:dd::12 3 2000
      | |                 | |
      | |                 | +------- Timeout in milliseconds
      | |                 +--------- Size in bytes
      | +----------------------------- Target address
      +------------------------------- Number of pings
```
If successful, Openlab Module is successfully set. 


* have a look at the [README](https://github.com/RIOT-Makers/wpan-raspbian/blob/master/README.md) for details

## COAP support

COAP is one of the major protocols for the Internet of Things, simply said it implements a HTTP-like protocol to query sensors that provide a RESTful interface. For further information on COAP see [here](http://coap.technology) and if you want to use COAP for development or testing you may want to install one of the following libraries and tools.

### C/C++: libcoap

* clone [libcoap](https://github.com/obgm/libcoap) from Github
```
$ cd /opt/src
$ git clone https://github.com/obgm/libcoap.git
```
* configure and build
```
$ cd /opt/src/libcoap
$ ./autogen.sh
$ ./configure --disable-documentation
$ make
$ sudo make install
```
* we disable documentation, because otherwise you'll have to install >2GB of dependencies
* _Note_: `libcoap` comes with a nice tool for testing named `coap-client`, so if you have a sensor node with a 802.15.4 transceiver that uses for instance [RIOT-OS](https://github.com/RIOT-OS/RIOT) with [microcoap](https://github.com/1248/microcoap) you can query that node. 
* to run `coap-client` you have to update the dynamic linker cache before:
```
sudo ldconfig -f /etc/ld.so.conf
coap-client -m GET coap://[ff02::1]/.well-known/core
```

### Python2: txThings

* install [txThings](https://github.com/siskin/txThings) using `pip2`:
```
sudo pip2 install txThings
```

### Python3: aiocoap

* install [aiocoap](https://github.com/chrysn/aiocoap) using `pip3`:
```
sudo pip3 install aiocoap
```
