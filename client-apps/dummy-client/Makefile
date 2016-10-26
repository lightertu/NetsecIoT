LIBRARIES = -lcoap-1
INCLUDE = -I /usr/local/include/coap/
CXXFLAGS = -O2 -D_GNU_SOURCE -DWITH_POSIX -Wall -std=c11
UTIL_BASE = ../utilities/src
SOURCE= client.c $(UTIL_BASE)/coap_list.c $(UTIL_BASE)/testbed_ipv6addr.c testbed_clientutil.c

all: client
			
client:$(SOURCW)
		gcc $(SOURCE) $(INCLUDE) $(LIBRARIES) $(CXXFLAGS) -g -o  client

clean:
	rm -f client a.out
