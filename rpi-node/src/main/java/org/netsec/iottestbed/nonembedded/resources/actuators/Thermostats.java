package org.netsec.iottestbed.nonembedded.resources.actuators;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

public class Thermostats extends NetsecResource {
    private String _status;

    public Thermostats() {
        super("thermostats", "number");
        updateStatus();
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        exchange.respond(_status);
    }

    public void handlePUT(CoapExchange exchange) {
        _status = exchange.getRequestText();
        exchange.respond(_status);
        System.out.println(_status);
    }

    private void updateStatus() {
        _status = "44";
    }
}
