#!/bin/bash

sudo cp arch/arm/boot/dts/*.dtb /media/<myusername>/boot/
sudo cp arch/arm/boot/dts/overlays/*.dtb* /media/<myusername>/boot/overlays
sudo scripts/mkknlimg arch/arm/boot/zImage /media/<myusername>/boot/kernel.img

sudo cp -R .mods/lib/* /media/<myusername>/<SDCardpatitionname>/lib

cd ..
cd firmware
sudo rm -rf /media/<myusername>/<SDCardpatitionname>/opt/vc
sudo cp -R hardfp/opt/* /media/<myusername>/<SDCardpatitionname>/opt

echo "device_tree=bcm2835-rpi-b.dtb
device_tree_address=0x100" >> /media/<myusername>/boot/config.txt
