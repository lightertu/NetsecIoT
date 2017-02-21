package org.netsec.iottestbed.nonembedded.resources;

import org.eclipse.californium.core.CoapResource;

import java.util.ArrayList;

public class NetsecResource extends CoapResource {
    private ArrayList<String> _childPaths = new ArrayList<String>();
    private String _dataFormat;

    public NetsecResource(String name) {
        super(name, false);
        _dataFormat = "";
    }
    public NetsecResource(String name, String dataFormat) {
        super(name, true);
        _dataFormat = dataFormat;
        _childPaths.add(getURI() + ":" + dataFormat);
    }

    public String getDataFormat() {
        return _dataFormat;
    }

    protected void addChild(NetsecResource childResource) {
        add(childResource);
        for (String path: childResource.getSubPaths()) {
            _childPaths.add("/" + getURI() + "/" + path);
        }
    }

    public ArrayList<String> getSubPaths() {
        return _childPaths;
    }
}
