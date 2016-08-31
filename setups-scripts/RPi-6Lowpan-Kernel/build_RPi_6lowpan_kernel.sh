#!bin/bash
export PATH=$PATH:~/SDKs/gcc-linaro-4.9-2014.11-x86_64_arm-linux-gnueabihf/bin/
cd linux-rpi
CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm make zImage modules dtbs -j8
CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm INSTALL_MOD_PATH=.mods make modules_install
