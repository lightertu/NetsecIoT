package org.netsec.iottestbed.nonembedded.resources.sensors;

import org.eclipse.californium.core.CoapResource;

public class SensorResources extends CoapResource{
    public SensorResources() {
        super("sensor", false);
        add(new Temperature());
    }
}