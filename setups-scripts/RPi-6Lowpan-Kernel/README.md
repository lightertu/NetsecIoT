## To finished up the configuration process
* First we enable 802.15.4 and 6LoWPAN support in our kernel.  
We traverse the menu to:
```
Networking support
  --> Networking options
    --> IEEE Std 802.15.4 Low-Rate Wireless Personal Area Networks support
```
enable the item if not already enabled, and enter the sub-menu of this item.  
There we set all options either to be loaded as module **`<M>`** or as direct part of the kernel **`<*>`**.  
We **`< Exit >`** back to **`Networking options`** and set **`6LoWPAN Support`** if not already set.  
Then traverse back to root menu. 

* Now we enable the drivers for our 802.15.4 devices (e.g. our AT86RF233 SPI transceiver).  
We traverse to:
```
Device Drivers
  --> Network device support
    --> IEEE 802.15.4 drivers
```
enable it if not already enabled, and enter the sub-menu.  
There we set our driver(s) either to be loaded as module **`<M>`** or as direct part of the kernel **`<*>`**,
e.g. **`<M>   AT86RF230/231/233/212 transceiver driver`**.  
Then we traverse back to root menu.

* Finally we put in some default Boot options 
We traverse to:
```
Boot options
  --> () Default kernel command string
```
hit the enter key and type 
```
console=ttyAMA0,115200 kgdboc=ttyAMA0,115200 root=/dev/mmcblk0p2 rootfstype=ext4 rootwait
```
in the "popped-up" input field.  
Then we hit **`< Ok >`** and got back to the root menu.

There we hit **`< Save >`** and store the configuration in the proposed file (**`.config`**) followed by 
**`< Exit >`** to leave the kernel configuration menu.

### Use the new kernel
Now that we built a recent kernel we need to copy with the modules and the firmware to our SDCard.  
First the kernel:
```
sudo cp arch/arm/boot/dts/*.dtb /media/<myusername>/boot/
sudo cp arch/arm/boot/dts/overlays/*.dtb* /media/<myusername>/boot/overlays
sudo scripts/mkknlimg arch/arm/boot/zImage /media/<myusername>/boot/kernel.img
```
After this, we copy the modules:
```
sudo cp -r .mods/lib/* /media/<myusername>/<SDCardpatitionname>/lib
```
and the prebuilt firmware files for hard fp:
```
cd ..
cd firmware
sudo rm -rf /media/<myusername>/<SDCardpatitionname>/opt/vc
sudo cp -r hardfp/opt/* /media/<myusername>/<SDCardpatitionname>/opt
```

As last step we need to tell the bootloader which device configuration it should use, i.e. **`bcm2835-rpi-b.dtb`**.
We fire our favorite editor open the **`/media/<myusername>/boot/config.txt`** file and for the Raspberry 1 append
```
device_tree=bcm2835-rpi-b.dtb
device_tree_address=0x100
```
for the Raspberry 2, we append
    ```
    device_tree=bcm2709-rpi-2-b.dtb
    device_tree_address=0x100
    ```
    Finally we save the changes to the file.
    That's it :D our SDCard is prepared to run the new kernel. 
     
     So, we unmount the SDCard, plug it in the Raspberry Pi and let it boot.
     If everything went fine, we should see the usual boot process.
     If you see a colored screen permanently (in case you plugged a monitor to your Raspberry Pi) something went wrong.

## Install some needed packets on the Pi: 
```
sudo apt-get install libnl-3-dev libnl-genl-3-dev wireshark
```
