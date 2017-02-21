package org.netsec.iottestbed.nonembedded.resources.sensors;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

class Temperature extends NetsecResource {
    private String _status;

    Temperature() {
        super("temperature", "number");
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        updateStatus();
        exchange.respond(_status);
    }

    private void updateStatus() {
        _status = Double.toString(Math.round(Math.random() * 65 + 60));
    }
}