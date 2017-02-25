package org.netsec.iottestbed.nonembedded.resources.about;

import org.eclipse.californium.core.server.resources.CoapExchange;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

public class Name extends NetsecResource {
    public Name() {
        super("name", "text");
    }

    @Override
    public void handleGET(CoapExchange exchange) {
        String name = "Raspberry Pi";
        exchange.respond(name);
    }
}
