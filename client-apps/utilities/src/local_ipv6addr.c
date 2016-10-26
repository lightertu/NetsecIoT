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

#include "../local_ipv6addr.h"

int main(int argc, char *argv[])
{
   struct ifaddrs *ifaddr, *ifa;
   int family, s, n, interface, islocal;
   char host[NI_MAXHOST];
   char * interface_name;

   if (getifaddrs(&ifaddr) == -1) {
       perror("getifaddrs");
       exit(EXIT_FAILURE);
   }

   /* Walk through linked list, maintaining head pointer so we
      can free list later */

   for (ifa = ifaddr, n = 0; ifa != NULL; ifa = ifa->ifa_next, n++) {
       if (ifa->ifa_addr == NULL)
           continue;

       family = ifa->ifa_addr->sa_family;

       /* Display interface name and family (including symbolic
          form of the latter for the common families) */
        
       /*
       printf("%-8s %s (%d)\n",
              ifa->ifa_name,
              (family == AF_PACKET) ? "AF_PACKET" :
              (family == AF_INET) ? "AF_INET" :
              (family == AF_INET6) ? "AF_INET6" : "???",
              family);
       */

       /* For an AF_INET* interface address, display the address */

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
               break;
       }


       if (family == AF_INET6 && (strcmp(ifa->ifa_name, interface_name) == 0) ) {
           s = getnameinfo(ifa->ifa_addr, sizeof(struct sockaddr_in6),
                   host, NI_MAXHOST,
                   NULL, 0, NI_NUMERICHOST);
           if (s != 0) {
               printf("getnameinfo() failed: %s\n", gai_strerror(s));
               exit(EXIT_FAILURE);
           }

           printf("\t\taddress: <%s>\n", host);

       } 
       /*
       else if (family == AF_PACKET && ifa->ifa_data != NULL) {
           struct rtnl_link_stats *stats = ifa->ifa_data;

           printf("\t\ttx_packets = %10u; rx_packets = %10u\n"
                  "\t\ttx_bytes   = %10u; rx_bytes   = %10u\n",
                  stats->tx_packets, stats->rx_packets,
                  stats->tx_bytes, stats->rx_bytes);
       }
       */
   }

   freeifaddrs(ifaddr);
   exit(EXIT_SUCCESS);
}
