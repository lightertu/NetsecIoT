package org.netsec.iottestbed.nonembedded;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapResponse;
import org.eclipse.californium.core.coap.MediaTypeRegistry;

class ActuatorController {
    private CoapClient _actuatorClient;
    private String _uri;
    private String _actuatorName;

    ActuatorController(String address, String actuatorName) {
        _uri = "coap://" + address + "/actuator/" + actuatorName;
        _actuatorClient = new CoapClient(_uri);
        _actuatorName = actuatorName;
    }

    String sendCommand(String com) throws InterruptedException {
        CoapResponse putResponse = null;
        while (putResponse == null) {
            putResponse = _actuatorClient.put(com, MediaTypeRegistry.TEXT_PLAIN);
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println("Resending Command " + com + " to " + _actuatorName);

        }

        if (putResponse.getCode().codeClass == 4) {
            System.out.println("LEDController ON to " + _uri + " return code " + putResponse.getCode());
            System.exit(1);
        }

        return putResponse.getResponseText();
    }
}
