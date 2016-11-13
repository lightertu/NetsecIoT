package org.netsec.iottestbed.nonembedded;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapResponse;
import org.eclipse.californium.core.CoapHandler;
import org.eclipse.californium.core.CoapObserveRelation;
import org.eclipse.californium.core.coap.MediaTypeRegistry;

public class Client {

    public static void main(String[] args) {

        CoapClient client = new CoapClient("coap://californium.eclipse.org:5683/obs");

        // synchronous
        String content1 = client.get().getResponseText();
        // CoapResponse putResponse = client.put("ON", MediaTypeRegistry.TEXT_PLAIN);
        System.out.println("RESPONSE 1: " + content1);
        CoapResponse resp2 = client.post("payload", MediaTypeRegistry.TEXT_PLAIN);
        System.out.println("RESPONSE 2 CODE: " + resp2.getCode());

        // asynchronous

        /*
        System.out.println("ASYNCHRONOUS (press enter to continue)");

        client.get(new CoapHandler() {
            public void onLoad(CoapResponse response) {
                String content = response.getResponseText();
                System.out.println("RESPONSE 3: " + content);
            }

            public void onError() {
                System.err.println("FAILED");
            }
        });

        // wait for user
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        try {
            br.readLine();
        } catch (IOException e)
        { }

        */
        // observe

        /*
        System.out.println("OBSERVE (press enter to exit)");

        CoapObserveRelation relation = client.observe(
                new CoapHandler() {
                    public void onLoad(CoapResponse response) {
                        String content = response.getResponseText();
                        System.out.println("NOTIFICATION: " + content);
                    }

                    public void onError() {
                        System.err.println("OBSERVING FAILED (press enter to exit)");
                    }
                });

        // wait for user
        try { br.readLine(); } catch (IOException e) { }
        */

        /*
        System.out.println("CANCELLATION");

        relation.proactiveCancel();
        */
    }
}

