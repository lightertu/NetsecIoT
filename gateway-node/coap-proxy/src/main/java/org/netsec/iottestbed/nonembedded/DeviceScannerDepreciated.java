package org.netsec.iottestbed.nonembedded;
import org.eclipse.californium.core.CoapClient;
import org.eclipse.californium.core.CoapHandler;
import org.eclipse.californium.core.CoapResponse;

import java.net.URI;
import java.net.URISyntaxException;

class DeviceScannerDepreciated {
    private String _multicastAddress;
    private int _port;

    public void scan()  {
        new Thread(new ScannerRunnable()).run();
    }

    DeviceScannerDepreciated(String multicastAddress, int port){
        _multicastAddress = multicastAddress;
        _port = port;
    }

    class ScannerRunnable implements Runnable {
        private final String COAP = "coap://";
        private final String MULTICAST_ADDR = String.format("coap://[%s]:%d", _multicastAddress, _port);
        private final String IP_PATH =  "/about/ip";
        private final String NAME_PATH = "/about/name";
        private final String DESCRIPTION_PATH = "/about/description";
        private final String SERVICES_PATH = "/about/services";

        // this code needs to be refactored
        public void run() {
            while (true) {
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                System.out.println("Advertising");

                // ASYNCHRONOUS
                final String nameUriString = MULTICAST_ADDR + NAME_PATH;
                try {
                    URI nameUri = new URI(nameUriString);
                    (new CoapClient(nameUri)).get(new CoapHandler() {
                        public void onLoad(CoapResponse coapResponse) {
                            final String name = coapResponse.getResponseText(),
                                         ipString = coapResponse.advanced().getSource().getHostAddress(),
                                         ip = ipString.substring(0, (ipString.indexOf('%') == -1) ?
                                                 ipString.length() : ipString.indexOf('%')),
                                         descriptionUri = COAP + ip + DESCRIPTION_PATH;

                            System.out.println(ip);
                            System.out.println(name);

                            (new CoapClient(descriptionUri)).get(new CoapHandler() {
                                public void onLoad(CoapResponse coapResponse) {
                                    final String description = coapResponse.getResponseText(),
                                            serviceUri = COAP + ip + SERVICES_PATH;

                                    System.out.println(description);

                                    (new CoapClient(serviceUri)).get(new CoapHandler() {
                                        public void onLoad(CoapResponse coapResponse) {
                                            final String service = coapResponse.getResponseText();
                                        /* here save the device information to the database*/
                                            System.out.println(service);
                                        }
                                        public void onError() { System.err.println("GETTING DESCRIPTION of " + ip + "failed"); }
                                    });
                                }
                                public void onError() { System.err.println("GETTING DESCRIPTION of " + ip + "failed"); }
                            });
                        }
                        public void onError() {
                            System.err.println("GETTING NAME failed"); }
                    });
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

