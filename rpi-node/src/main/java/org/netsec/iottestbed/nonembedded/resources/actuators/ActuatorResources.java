package org.netsec.iottestbed.nonembedded.resources.actuators;

import org.eclipse.californium.core.CoapResource;

public class ActuatorResources extends CoapResource{
    public ActuatorResources() {
        super("actuator", false);
        add( new Led());
    }
}
