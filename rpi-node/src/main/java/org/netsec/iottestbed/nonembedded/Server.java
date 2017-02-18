/*******************************************************************************
 * Copyright (c) 2016 Rui Tu
 *
 ******************************************************************************/
package org.netsec.iottestbed.nonembedded;

import java.util.concurrent.Executors;
import org.eclipse.californium.core.CoapServer;
import org.eclipse.californium.core.coap.Request;
import org.eclipse.californium.core.coap.Response;

import org.netsec.iottestbed.nonembedded.resources.FibonacciResource;
import org.netsec.iottestbed.nonembedded.resources.HelloWorldResource;
import org.netsec.iottestbed.nonembedded.resources.ImageResource;
import org.netsec.iottestbed.nonembedded.resources.LargeResource;
import org.netsec.iottestbed.nonembedded.resources.MirrorResource;
import org.netsec.iottestbed.nonembedded.resources.StorageResource;

/**
 * This is an example server that contains a few resources for demonstration.
 */
public class Server {

    public static void main(String[] args) throws Exception {
        CoapServer server = new CoapServer();
        server.setExecutor(Executors.newScheduledThreadPool(4));

        server.add(new HelloWorldResource("hello"));
        server.add(new FibonacciResource("fibonacci"));
        server.add(new StorageResource("storage"));
        server.add(new ImageResource("image"));
        server.add(new MirrorResource("mirror"));
        server.add(new LargeResource("large"));

        server.start();
    }

    /*
     *  Sends a GET request to itself
     */
    public static void selfTest() {
        try {
            Request request = Request.newGet();
            request.setURI("localhost:5683/hello");
            request.send();
            Response response = request.waitForResponse(1000);
            System.out.println("received "+response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}