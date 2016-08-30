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

