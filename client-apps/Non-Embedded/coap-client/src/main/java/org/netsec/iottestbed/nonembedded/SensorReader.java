package org.netsec.iottestbed.nonembedded;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapResponse;

class SensorReader {
    private CoapClient _sensorClient;
    private String _uri;
    private String _sensorName;

    SensorReader(String address, String sensorName) {
        _uri = "coap://" + address + "/sensor" + sensorName;
        _sensorClient = new CoapClient(_uri);
        _sensorName = sensorName;
    }

    String read() {
        CoapResponse getResponse = null;

        while (getResponse == null) {
            getResponse = _sensorClient.get();
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            System.out.println("Resending GET request to " + _sensorName);
        }

        if (getResponse.getCode().codeClass == 4) {
            System.out.println("GET Request to " + _uri + " returned code " + getResponse.getCode());
            System.exit(1);
        }

        return getResponse.getResponseText();
    }
}
