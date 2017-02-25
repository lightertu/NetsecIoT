package org.netsec.iottestbed.nonembedded.resources.about;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;
import java.net.*;
import java.util.Enumeration;

public class IPAddress extends NetsecResource {
    private String _ipAddress = "";

    public IPAddress(String ifaceName) {
        super("ip", "string");
        NetworkInterface networkInterface = null;
        try {
            networkInterface = NetworkInterface.getByName(ifaceName);
            Enumeration<InetAddress> inetAddress = networkInterface.getInetAddresses();
            InetAddress currentAddress;
            while(inetAddress.hasMoreElements()) {
                currentAddress = inetAddress.nextElement();
                if(currentAddress instanceof Inet6Address && !currentAddress.isLoopbackAddress()) {
                    String addressString = currentAddress.toString();
                    _ipAddress = addressString.substring(1, addressString.indexOf('%')); // strip the first character off
                    System.out.println(_ipAddress);
                    break;
                }
            }
        } catch (SocketException e) {
            System.exit(1);
            e.printStackTrace();
        }
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        exchange.respond(_ipAddress);
    }
}
