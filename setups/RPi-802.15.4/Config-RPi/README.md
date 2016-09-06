## Install some needed packets on the Pi: 
```
sudo apt-get install libnl-3-dev libnl-genl-3-dev wireshark
```

## Build and install the WPAN tools
After logging in, we need the WPAN tools to setup and use one of our 802.15.14 devices.
First we need to install the `dh-autoreconf` package to be able to build the recent WPAN tools.
We type
```
sudo apt-get install dh-autoreconf
```

Then we clone the latest wpan-tools sources
```
git clone https://github.com/linux-wpan/wpan-tools
cd wpan-tools
```
build them
```
./autogen.sh
./configure CFLAGS='-g -O0' --prefix=/usr --sysconfdir=/etc --libdir=/usr/lib
make
```
and finally install them
```
sudo make install
```
## Configure your WPAN device
Please note: 
Before we can begin to setup our connected device with the previously built **`wpan-tools`**,
we need to put the connected interface, e.g. **`wpan0`**, down. (Be cautious, it might be that the at86 adapter will get assigned a different name, e.g. **`wpan1`** if another wireless interface is connected.)
To check if the device is up and active we enter **`ifconfig`** and should be presented with a list of running interfaces including our **`wpan0`**.  
Now usually the **`ifplugd`** daemon is active in Raspbian. Basically it activates connected interfaces automatically.  
So before we can set our **`wpan0`** interface down, we need to prevent that the **`ifplugd`** daemon reactivates the device back immediately.  
So we enter:
```
ps -ax | grep ifplugd 
```
look for the line with our WPAN device, and **`kill`** the corresponding daemon.  
For instance entering the above may present us with (or similar):
```
...
1706 ?    S   0:07 /usr/sbin/ifplugd -i wpan0 -q -f -u0 -d10 -w -I
...
```
then we **`kill`** this specific daemon instance be entering
```
sudo kill -KILL 1706
```
After this we can set our **`wpan0`** interface down, and it stays down.
Now we can start to configure our device.

For testing, follow some of the instructions at 
http://wpan.cakelab.org/#_how_to_8217_s
