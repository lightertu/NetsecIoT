package org.netsec.iottestbed.nonembedded.resources.sensors;

import org.eclipse.californium.core.CoapResource;
import org.eclipse.californium.core.server.resources.CoapExchange;

class Temperature extends CoapResource {
    private String _status;
    Temperature() {
        super("temperature");
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        updateStatus();
        exchange.respond(_status);
    }


    private void updateStatus() {
        _status = Double.toString(Math.random() * 50 + 30);
    }
}