package org.netsec.iottestbed.nonembedded.resources.actuators;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

public class Led extends NetsecResource {
    private String _status;

    public Led() {
        super("led", "boolean");
        updateStatus();
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        exchange.respond(_status);
    }

    public void handlePUT(CoapExchange exchange) {
        String rawPayload = exchange.getRequestText();
        int payload = Integer.parseInt(rawPayload);

        if (payload == 1) {
            System.out.println("LED ON");
            _status = rawPayload;
        } else if (payload == 0) {
            System.out.println("LED OFF");
            _status = rawPayload;
        } else {
            System.out.println("Unknown command: " + exchange.getRequestText());
        }

        exchange.respond(_status);
    }

    private void updateStatus() {
        _status = "1";
    }
}
