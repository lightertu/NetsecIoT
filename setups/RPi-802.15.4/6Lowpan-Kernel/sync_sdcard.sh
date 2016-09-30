#!/bin/bash

sudo cp arch/arm/boot/dts/*.dtb /media/rui/boot/
sudo cp arch/arm/boot/dts/overlays/*.dtb* /media/rui/boot/overlays
sudo scripts/mkknlimg arch/arm/boot/zImage /media/rui/boot/kernel.img

sudo cp -R .mods/lib/* /media/rui/<SDCardpatitionname>/lib

cd ..
cd firmware
sudo rm -rf /media/rui/<SDCardpatitionname>/opt/vc
sudo cp -R hardfp/opt/* /media/rui/<SDCardpatitionname>/opt

echo "device_tree=bcm2709-rpi-2-b.dtb
device_tree_address=0x100" >> /media/rui/boot/config.txt
