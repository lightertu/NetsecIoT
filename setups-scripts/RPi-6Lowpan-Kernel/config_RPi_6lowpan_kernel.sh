#!bin/bash
# First download the cross compiler binaries for your target machine from:
# http://releases.linaro.org/14.11/components/toolchain/binaries/arm-linux-gnueabihf/
# export PATH=$PATH:/home/<directory contains your uuncompressed download>/gcc-linaro-4.9-2014.11-x86_64_arm-linux-gnueabihf/bin
export PATH=$PATH:/home/SDKs/gcc-linaro-4.9-2014.11-x86_64_arm-linux-gnueabihf/bin
# Second download the latest Raspberry Pi Kernel sources from their Git and the
# latest firmwares
git clone --depth 1 https://github.com/raspberrypi/linux.git linux-rpi
cd linux-rpi
git checkout rpi-4.1.y
cd ..

git clone --depth 1 https://github.com/raspberrypi/firmware.git firmware
cd firmware
git checkout next
cd ..

# Configuring the new kernel
cd linux-rpi 

# for RPi 1
# make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- bcm2835_defconfig

# for RPi 2
export KERNEL=kernel7
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- bcm2709_defconfig

# This enables SPI on the Raspberry Pi and tells the kernel that our AT86RF233 
# SPI transceiver may be plugged over SPI (Pins 15-26) to it. 
rpi1_dts=arch/arm/boot/dts/bcm2835-rpi-b.dts
rpi2_dts=arch/arm/boot/dts/bcm2709-rpi-2-b.dts
echo "&spi0 {
    status="okay";
    spidev@0{
        status = "disabled";
    };
    spidev@1{
        status = "disabled";
    };
    at86rf233@0 {
        compatible = "atmel,at86rf233";
        reg = <0>;
        interrupts = <23 4>;
        interrupt-parent = <&gpio>;
        reset-gpio = <&gpio 24 1>;
        sleep-gpio = <&gpio 25 1>;
        spi-max-frequency = <3000000>;
        xtal-trim = /bits/ 8 <0x0F>;
    };
};" >> rpi2_dts # choose your version here

# configure our kernel for providing 802.15.4, 6LoWPAN and the 
# transceiver device drivers.
sudo apt-get install libncurses5-dev
make ARCH=arm CROSS_COMPILE=arm-linux-gnueabihf- menuconfig
