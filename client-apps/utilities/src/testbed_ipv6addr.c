#define _GNU_SOURCE     /* To get defns of NI_MAXSERV and NI_MAXHOST */
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netdb.h>
#include <ifaddrs.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <linux/if_link.h>

#include "../testbed_ipv6addr.h"

char * getipv6ifaddr(int interface, int islocal)
{
   struct ifaddrs *ifaddr, *ifa;
   int family, s, n;
   char host[NI_MAXHOST];
   char * interface_name;
   char * result;

   if (getifaddrs(&ifaddr) == -1) {
       perror("getifaddrs");
       exit(EXIT_FAILURE);
   }

   /* Walk through linked list, maintaining head pointer so we
      can free list later */

   /* get the interface */
   switch (interface) {
       case(LOWPAN):
           interface_name = "lowpan0";
           break;
       case(ETH):
           interface_name = "eth0";
           break;
       default:
           printf("Cannot regonize interface code %d", interface);
           exit(EXIT_FAILURE);
           freeifaddrs(ifaddr);
           break;
   }

   for (ifa = ifaddr, n = 0; ifa != NULL; ifa = ifa->ifa_next, n++) {
       if (ifa->ifa_addr == NULL)
           continue;

       family = ifa->ifa_addr->sa_family;

       if (family == AF_INET6 && (strcmp(ifa->ifa_name, interface_name) == 0) ) {
           s = getnameinfo(ifa->ifa_addr, sizeof(struct sockaddr_in6),
                   host, NI_MAXHOST,
                   NULL, 0, NI_NUMERICHOST);
           if (s != 0) {
               printf("getnameinfo() failed: %s\n", gai_strerror(s));
               exit(EXIT_FAILURE);
           }

           char* localaddr_mark = strchr(host, '%');

           if (localaddr_mark != NULL && islocal) {
               printf("local\n");
               *(localaddr_mark + 0) = '\0';
               result = host;
               break;
           } 
           
           if (localaddr_mark == NULL && !islocal) {
               printf("global\n");
               result = host;
               break;
           }
       } 
   }

   freeifaddrs(ifaddr);
   return result;
}
