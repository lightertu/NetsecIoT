# Setup native 6LoWPAN router using Raspbian and RADVD

## Objectives

In the following we assume that you already gone through initial setup of your Pi and enabled WPAN in the Linux Kernel. If unsure checkout our previous [guides](https://github.com/RIOT-Makers/wpan-raspbian/wiki/home) _before_ proceeding here.

* install router advertisement daemon `radvd`
* configure (and test) Raspbian as 6LoWPAN router

## Install requirements

In order to install latest version of `radvd` we first have to install some dependencies. Though they are likely already installed or available via the _apt repositories_ in raspbian, these version are quite old. So we have to install newer versions manually - its pretty easy, so no worries here!

### flex

Download, build and install a recent version of `flex` as follows (as before, everything goes into `opt`). _Note_: The version of `flex` in Raspbian is _2.5.36_ and is not supported by `radvd` - at least the latter does not compile.

```
sudo apt install bison
```

* first get latest flex release:
```
cd /opt/src
wget https://sourceforge.net/projects/flex/files/flex-2.6.0.tar.bz2
tar xjf flex-2.6.0.tar.bz2
cd flex-2.6.0
./configure
```
* if `configure` succeeds without errors and all dependencies are matched, build and install:
```
make
sudo make install
sudo apt remove bison
```

* that's it, step 1 done!

### radvd

Now we can install the router advertisement daemon for IPv6. At time of writing this there were some issues with `radvd` using LoWPAN devices running a recent Linux. So we have to use a patched fork of the original repository for now.

* same, same but different we start by getting the source code and run initial configuration:
```
cd /opt/src
git clone https://github.com/linux-wpan/radvd.git -b 6lowpan
cd radvd
./autogen.sh
./configure --prefix=/usr/local --sysconfdir=/etc --mandir=/usr/share/man
```
* if `configure` succeeds without errors and all dependencies are matched, build and install:
```
make
sudo make install
```
* that's it -- step 2  done!

## Configure 6LR

* create or edit the file `/etc/radvd.conf` with the following content
```
interface lowpan0
{
    AdvSendAdvert on;
    UnicastOnly on;
    AdvCurHopLimit 255;
    AdvSourceLLAddress on;

    prefix fd00:1:2:3::/64
    {
        AdvOnLink off;
        AdvAutonomous on;
        AdvRouterAddr on;
    };

    abro fe80::a:b:c:d
    {
        AdvVersionLow 10;
        AdvVersionHigh 2;
        AdvValidLifeTime 2;
    };
};
```

* replace the [ULA]() prefix (`fd00:1:2:3::/64`) with your own random prefix within range `fd00::/8`. If your are bad at generating random IPv6 prefixes:
  * checkout [this website](http://unique-local-ipv6.com)
  * or use [this shell script](http://www.hznet.de/tools/generate-rfc4193-addr)
* also replace the IP address in the ABRO section with the link local address of the lowpan interface.
* _Note_: the _openlabs_ and _microship_ transceivers both generate a new, random LLADDR on every boot. To fix the address have a look at our other [guide](https://github.com/RIOT-Makers/wpan-raspbian/wiki/Spice-up-Raspbian-for-the-IoT#systemd-lowpan) and the [README.md](https://github.com/RIOT-Makers/wpan-raspbian/blob/master/README.md).
* _Note_: set `AdvOnLink off` otherwise the prefix will not be used for stateless address auto configuration, see [RFC 6775, section 5.4](https://tools.ietf.org/html/rfc6775#section-5.4)
* configure IPv6 address on Pi with prefix `fd00::1:2:3` and interface EUI64 `a:b:c:d`, replace these values accordingly:
```
sudo ip addr add fd00:1:2:3:a:b:c:d/64 dev lowpan0
                 <-prefix->:<-EUI->
```
* finally you have to enable forwarding for IPv6 interfaces, otherwise Linux will not send _Neighbor Advertisements_ with the router flag set. Hence, RIOT will drop the Pi from its router list and communication via non-link-local address will cease to function. **TL;DR**: enable forwarding on Pi, or it wont work! See [RFC 4861, 7.2.4](https://tools.ietf.org/html/rfc4861)
```
sudo sh -c "echo 1 > /proc/sys/net/ipv6/conf/all/forwarding"
```
* to set this permanently, i.e., after reboot, modify `/etc/sysctl.conf` and set:
```
net.ipv6.conf.all.forwarding=1
```

## Testing

* check your configfile syntax with
```
radvd -c
```

* if okay, start `radvd` in debug mode, run:
```
sudo radvd -d 5 -m stderr -n
```

## Other stuff

* to manually send _neighbor solicitation_ (NS) or _router solicitation_ (RS) messages install `ndisc6`
```
sudo apt install ndisc6
# send RS via iface lowpan0
sudo rdisc6 lowpan0 
```