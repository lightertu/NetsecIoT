#!bin/bash
cd linux-rpi
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm zImage -j8
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm modules -j8
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm dtbs -j8
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm INSTALL_MOD_PATH=.mods modules_install
