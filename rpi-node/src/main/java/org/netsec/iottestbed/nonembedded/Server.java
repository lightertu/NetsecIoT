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
import org.netsec.iottestbed.nonembedded.resources.actuators.Actuator;
import org.netsec.iottestbed.nonembedded.resources.sensors.Sensor;

class AdvertingRunnable implements Runnable {
    private CoapClient _advertisingClient = new CoapClient();
    private URI _broadcastURI;

    AdvertingRunnable(){
        // String uriString = "coap://[ff02::1]:6666/devices";
        String uriString = "coap://localhost:6666/devices";
        try {
            _broadcastURI = new URI(uriString);
        } catch (URISyntaxException e) {
            System.err.println("Invalid URI: " + e.getMessage());
            System.exit(-1);
        }

        _advertisingClient = new CoapClient(_broadcastURI);
    }

    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            //System.out.println("Advertising............................");
            String exampleAdvertisingString = "/sensor/temperature,1|/actuator/led,4";
            _advertisingClient.put(exampleAdvertisingString, 0);
        }
    }
}

class Server extends CoapServer {
    private static final int COAP_PORT = NetworkConfig.getStandard().getInt(NetworkConfig.Keys.COAP_PORT);
    private Server() {
        addEndpoints();
    }
    private void advertise() {
        (new Thread(new AdvertingRunnable())).start();
    }
    private void addEndpoints() {
        // IPv4 and IPv6 addresses and localhost
        for (InetAddress addr : EndpointManager.getEndpointManager().getNetworkInterfaces()) {
            if (addr instanceof Inet6Address || addr instanceof Inet4Address || addr.isLoopbackAddress()) {
                InetSocketAddress bindToAddress = new InetSocketAddress(addr, COAP_PORT);
                addEndpoint(new CoapEndpoint(bindToAddress));
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Server server = new Server();
        server.setExecutor(Executors.newScheduledThreadPool(4));
        server.add(new Sensor());
        server.add(new Actuator());
        server.start();
        server.advertise();
    }
}
