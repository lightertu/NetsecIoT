#!bin/bash
cd linux-rpi
export PATH=$PATH:~/SDKs/gcc-linaro-4.9-2014.11-x86_64_arm-linux-gnueabihf/bin
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm zImage -j8
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm modules -j8
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm dtbs -j8
make CROSS_COMPILE=arm-linux-gnueabihf- ARCH=arm INSTALL_MOD_PATH=.mods modules_install
