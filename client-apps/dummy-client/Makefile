LIBRARIES = -lcoap-1
INCLUDE = -I /usr/local/include/coap/
CXXFLAGS = -O2 -D_GNU_SOURCE -DWITH_POSIX
SOURCE= client_logichub.c

all: client
			
client:$(SOURCW)
		gcc $(SOURCE) $(INCLUDE) $(LIBRARIES) $(CXXFLAGS) -g -o  client

clean:
	rm -f client
