#!bin/bash
sudo apt install bison

cd /opt/src
wget https://sourceforge.net/projects/flex/files/flex-2.6.0.tar.bz2
tar xjf flex-2.6.0.tar.bz2
cd flex-2.6.0
./configure

make
sudo make install
sudo apt remove bison

cd /opt/src
git clone https://github.com/linux-wpan/radvd.git -b 6lowpan
cd radvd
./autogen.sh
./configure --prefix=/usr/local --sysconfdir=/etc --mandir=/usr/share/man

make
sudo make install
