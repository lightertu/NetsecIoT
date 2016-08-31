#!bin/bash
cd linux-rpi
CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm make zImage modules dtbs -j8
CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm INSTALL_MOD_PATH=.mods make modules_install
