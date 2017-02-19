package org.netsec.iottestbed.nonembedded.resources.sensors;

import org.eclipse.californium.core.CoapResource;

/**
 * Created by rui on 2/18/17.
 */
public class Sensor extends CoapResource{
    public Sensor() {
        super("sensor", false);
        add(new Temperature());
    }
}
