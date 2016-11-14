package org.netsec.iottestbed.nonembedded;

import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapResponse;
import org.eclipse.californium.core.coap.MediaTypeRegistry;


class TemperatureReader {
    private CoapResponse _getResponse;
    private CoapClient temperatureClient;
    private String _uri;

    TemperatureReader(String uri) {
        _uri = uri;
        temperatureClient = new CoapClient(uri);
    }
    String getTemperature() {
        _getResponse = temperatureClient.get();
        if (_getResponse.getCode().codeClass == 4) {
            System.out.println("Temperature Request to " + _uri + " returnd code " + _getResponse.getCode());
        }
        return _getResponse.getResponseText();
    }

    public String lastResponse() {
        return _getResponse.getResponseText();
    }
}



class LEDcontroller {
    private CoapResponse _getResponse;
    private CoapClient _LEDclient;
    private String _uri;

    LEDcontroller(String uri) {
        _uri = uri;
        _LEDclient = new CoapClient(uri);
    }

    String on() {
        _getResponse = _LEDclient.put("ON", MediaTypeRegistry.TEXT_PLAIN);
        if (_getResponse.getCode().codeClass == 4) {
            System.out.println("LEDcontroller ON to " + _uri + " returnd code " + _getResponse.getCode());
        }
        return _getResponse.getResponseText();
    }

    String off() {
        _getResponse = _LEDclient.put("OFF", MediaTypeRegistry.TEXT_PLAIN);
        if (_getResponse.getCode().codeClass == 4) {
            System.out.println("LEDcontroller OFF to " + _uri + " returnd code " + _getResponse.getCode());
        }
        return _getResponse.getResponseText();
    }

    public String toggle() {
        _getResponse = _LEDclient.put("TOGGLE", MediaTypeRegistry.TEXT_PLAIN);
        if (_getResponse.getCode().codeClass == 4) {
            System.out.println("LEDcontroller TOGGLE to " + _uri + " returnd code " + _getResponse.getCode());
        }
        return _getResponse.getResponseText();
    }

    public String lastResponse() {
        return _getResponse.getResponseText();
    }
}

public class Client {

    public static void main(String[] args) throws InterruptedException {

        TemperatureReader temperatureClient = new TemperatureReader("coap://californium.eclipse.org:5683/obs");
        LEDcontroller ledClient = new LEDcontroller("coap://californium.eclipse.org:5683/obs");

        int ctr = 0;

        while (true) {
            String putResponse;
            if (ctr == 0) {
                putResponse = ledClient.on();
            } else {
                putResponse = ledClient.off();
            }

            ctr = ~ctr;
            System.out.println("LED status: " + putResponse);
            System.out.println("temperature: " + temperatureClient.getTemperature());

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

