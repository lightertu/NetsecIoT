package org.netsec.iottestbed.nonembedded.resources.about;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

class Description extends NetsecResource {
    Description() {
        super("description", "text");
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        String description = "This is a non-embedded device";
        exchange.respond(description);
    }
}
