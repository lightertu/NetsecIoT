#!bin/bash
# installing required packages
# sudo apt-get update
sudo apt-get install git pkg-config autoconf libudev-dev libusb-1.0-0-dev libtool unzip valgrind
sudo apt-get update

# build hidapi
TMP=$(mktemp) &&
    rm -r $TMP &&
    mkdir -p $TMP &&
    cd $TMP &&
    git clone http://github.com/signal11/hidapi.git &&
    cd hidapi &&
    ./bootstrap &&
    ./configure &&
    make &&
    sudo make install &&
    sudo ln -s /usr/local/lib/libhidapi-hidraw.so.0 \
        /usr/lib/libhidapi-hidraw.so.0

# build openOCD
TMP=$(mktemp) &&
    rm -r $TMP &&
    mkdir -p $TMP &&
    cd $TMP &&
    git clone https://github.com/watr-li/OpenOCD.git openocd &&
    cd openocd &&
    ./bootstrap &&
    ./configure --enable-maintainer-mode \
                --enable-cmsis-dap \
                --enable-hidapi-libusb &&
    make &&
    sudo make install

 installing the toolchain
sudo apt-get remove binutils-arm-none-eabi gcc-arm-none-eabi
sudo apt-get update
sudo apt-get install gcc-arm-none-eabi

