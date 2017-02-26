/*******************************************************************************
 * Copyright (c) 2016 Rui Tu
 *
 ******************************************************************************/
package org.netsec.iottestbed.nonembedded;

import org.eclipse.californium.core.CoapServer;
import org.eclipse.californium.core.network.CoapEndpoint;
import org.eclipse.californium.core.network.EndpointManager;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;
import org.netsec.iottestbed.nonembedded.resources.about.About;
import org.netsec.iottestbed.nonembedded.resources.about.Name;
import org.netsec.iottestbed.nonembedded.resources.about.Services;
import org.netsec.iottestbed.nonembedded.resources.actuators.Actuator;
import org.netsec.iottestbed.nonembedded.resources.actuators.Led;
import org.netsec.iottestbed.nonembedded.resources.actuators.Thermostats;
import org.netsec.iottestbed.nonembedded.resources.sensors.Sensor;
import org.netsec.iottestbed.nonembedded.resources.sensors.Temperature;

import java.net.*;
import java.util.concurrent.Executors;

class Server extends CoapServer {
    private static final int COAP_PORT = 5683;
    private String _serviceString = "";

    private Server() {
        addResources();
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

    private void add(NetsecResource resource) {
        super.add(resource);
        for (String path: resource.getSubPaths()) {
            _serviceString += path + ",";
        }
    }

    public void start() {
        super.start();
    }

    private void addResources() {
        Actuator actuator = new Actuator();
        actuator.add(new Led());
        actuator.add(new Thermostats());
        add(actuator);

        NetsecResource sensor = new Sensor();
        sensor.add(new Temperature());
        add(sensor);

        // add about resource at last, otherwise it won't expose services added before
        NetsecResource about = new About();
        about.add(new Services(_serviceString));
        about.add(new org.netsec.iottestbed.nonembedded.resources.about.Description());
        about.add(new Name());
        add(about);
    }

    public static void main(String[] args) throws Exception {
        Server server = new Server();
        server.setExecutor(Executors.newScheduledThreadPool(4));
        server.start();
    }
}
