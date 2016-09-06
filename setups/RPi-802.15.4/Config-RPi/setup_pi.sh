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
