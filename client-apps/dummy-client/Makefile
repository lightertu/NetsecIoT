LIBRARIES = -lcoap-1
INCLUDE = -I /usr/local/include/coap/
CXXFLAGS = -O2 -D_GNU_SOURCE -DWITH_POSIX
UTIL_BASE = ../utilities
SOURCE= client.c $(UTIL_BASE)/coap_list.c

all: client
			
client:$(SOURCW)
		sudo ldconfig -f /etc/ld.so.conf
		gcc $(SOURCE) $(INCLUDE) $(LIBRARIES) $(CXXFLAGS) -g -o  client

clean:
	rm -f client a.out
