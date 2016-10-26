#ifndef _LOCAL_IPv6ADDR_
#define _LOCAL_IPv6ADDR_

#define LOWPAN 1 // 6lowpan interface
#define ETH 0    // ethernet 
#define LOCAL 1    // ethernet 
#define GLOBAL 0    // ethernet 

char * getaddr_if(int interface, int isLocalAddr);


#endif
