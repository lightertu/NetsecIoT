package org.netsec.iottestbed.nonembedded.resources;
import org.eclipse.californium.core.CoapResource;

public class Devices extends CoapResource {

    public Devices(String name, boolean visible) {
        super(name, visible);
    }
}
