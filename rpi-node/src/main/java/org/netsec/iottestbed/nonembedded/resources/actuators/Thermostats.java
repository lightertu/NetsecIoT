package org.netsec.iottestbed.nonembedded.resources.actuators;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

class Thermostats extends NetsecResource {
    private String _status;

    Thermostats() {
        super("thermostats", "number");
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        updateStatus();
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
