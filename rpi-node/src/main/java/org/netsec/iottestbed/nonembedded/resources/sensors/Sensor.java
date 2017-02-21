package org.netsec.iottestbed.nonembedded.resources.sensors;

import org.netsec.iottestbed.nonembedded.resources.NetsecResource;


public class Sensor extends NetsecResource {
    public Sensor() {
        super("sensor");
        add(new Temperature());
    }
}