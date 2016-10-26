LIBRARIES = -lcoap-1
INCLUDE = -I /usr/local/include/coap/
CXXFLAGS = -O2 -D_GNU_SOURCE -DWITH_POSIX -Wall
UTIL_BASE = ../utilities/src
SOURCE= client.c $(UTIL_BASE)/coap_list.c $(UTIL_BASE)/testbed_ipv6addr.c

all: client
			
client:$(SOURCW)
		sudo ldconfig -f /etc/ld.so.conf
		gcc $(SOURCE) $(INCLUDE) $(LIBRARIES) $(CXXFLAGS) -g -o  client

clean:
	rm -f client a.out
