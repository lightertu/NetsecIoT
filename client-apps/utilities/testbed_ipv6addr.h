#ifndef _LOCAL_IPv6ADDR_
#define _LOCAL_IPv6ADDR_

#define LOWPAN 1 // 6lowpan interface
#define ETH 0    // ethernet 
#define LOCAL 1    // ethernet 
#define GLOBAL 0    // ethernet 

/* return a char * of the ipv6 address of a given interface
 * interface takes values from { ETH: eth0, LOWPAN: lowpan0 } (see marco definition)
 * isLocalAddr takes LOCAL or GLOBAL
 * example: char * lowpan0_local_addr = getaddr_if(LOWPAN, LOCAL);
 * */
char * getipv6ifaddr(int interface, int isLocalAddr);

#endif
