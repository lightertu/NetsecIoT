package org.netsec.iottestbed.nonembedded.resources.actuators;

import org.eclipse.californium.core.CoapResource;

public class Actuator extends CoapResource{
    public Actuator() {
        super("actuator", false);
        add( new Led());
    }
}