/*******************************************************************************
 * Copyright (c) 2016 Rui Tu
 *
 ******************************************************************************/
package org.netsec.iottestbed.nonembedded;

import java.net.*;
import java.util.concurrent.Executors;
import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapServer;

import org.eclipse.californium.core.network.CoapEndpoint;
import org.eclipse.californium.core.network.EndpointManager;
import org.eclipse.californium.core.network.config.NetworkConfig;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;
import org.netsec.iottestbed.nonembedded.resources.actuators.Actuator;
import org.netsec.iottestbed.nonembedded.resources.sensors.Sensor;


class AdvertisingRunnable implements Runnable {
    private CoapClient _advertisingClient = new CoapClient();
    private URI _broadcastURI;
    private String _adString;

    AdvertisingRunnable(String adString){
        String uriString = "coap://[ff02::1]:6666/devices";
        //String uriString = "coap://localhost:6666/devices";
        try {
            _broadcastURI = new URI(uriString);
        } catch (URISyntaxException e) {
            System.err.println("Invalid URI: " + e.getMessage());
            System.exit(-1);
        }

        _adString = adString;
        _advertisingClient = new CoapClient(_broadcastURI);
    }

    public void run() {
        while (true) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //System.out.println(_adString);
            _advertisingClient.put(_adString, 0);
        }
    }
}

class Server extends CoapServer {
    private static final int COAP_PORT = NetworkConfig.getStandard().getInt(NetworkConfig.Keys.COAP_PORT);
    private String _adString = "";

    private Server() {
        addEndpoints();
    }

    private void advertise() {
        (new Thread(new AdvertisingRunnable(_adString))).start();
    }

    private void addEndpoints() {
        // IPv4 and IPv6 addresses and localhost
        InetAddress multicastAddr = null;
        try {
            multicastAddr = InetAddress.getByName("FF05::FD");
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }

        InetSocketAddress multicastBindToAddress = new InetSocketAddress(multicastAddr, COAP_PORT);
        CoapEndpoint multicast = new CoapEndpoint(multicastBindToAddress);

        super.addEndpoint(multicast);
        for (InetAddress addr : EndpointManager.getEndpointManager().getNetworkInterfaces()) {
            if (addr instanceof Inet6Address || addr instanceof Inet4Address || addr.isLoopbackAddress()) {
                InetSocketAddress bindToAddress = new InetSocketAddress(addr, COAP_PORT);
                addEndpoint(new CoapEndpoint(bindToAddress));
            }
        }
    }

    private void add(NetsecResource resource) {
        super.add(resource);
        for (String path: resource.getSubPaths()) {
            _adString += path + ",";
        }
    }

    public void start() {
        super.start();
        advertise();
    }

    public static void main(String[] args) throws Exception {
        Server server = new Server();
        server.setExecutor(Executors.newScheduledThreadPool(4));
        server.add(new Sensor());
        server.add(new Actuator());
        server.start();
    }
}
