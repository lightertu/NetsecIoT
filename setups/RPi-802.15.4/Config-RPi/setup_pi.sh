#!/bin/bash

# additional tools
sudo apt-get install libnl-3-dev libnl-genl-3-dev wireshark

# Build and install the WPAN tools
sudo apt-get install dh-autoreconf
git clone https://github.com/linux-wpan/wpan-tools
cd wpan-tools
./autogen.sh
./configure CFLAGS='-g -O0' --prefix=/usr --sysconfdir=/etc --libdir=/usr/lib
make
sudo make install

sudo apt install virtualenv python-all-dev python-pip python3-pip

sudo mkdir -p /opt/src
sudo chown pi /opt/src
cd /opt/src
git clone https://github.com/riot-makers/wpan-raspbian
cd wpan-raspbian

sudo cp -r usr/local/sbin/* /usr/local/sbin/.
sudo chmod +x /usr/local/sbin/*

sudo cp etc/default/lowpan /etc/default/.
sudo cp etc/systemd/system/lowpan.service /etc/systemd/system/.

sudo systemctl enable lowpan.service

