package org.netsec.iottestbed.nonembedded.resources.about;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

/**
 * Created by rui on 2/24/17.
 */
public class Services extends NetsecResource {
    private String _serviceString = "";
    public Services(String serviceString) {
        super("services", "string");
        _serviceString = serviceString;
    }

    public void handleGET(CoapExchange exchange) {
        exchange.respond(_serviceString);
    }
}
