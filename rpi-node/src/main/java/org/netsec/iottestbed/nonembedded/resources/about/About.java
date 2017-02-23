package org.netsec.iottestbed.nonembedded.resources.about;
import org.netsec.iottestbed.nonembedded.resources.NetsecResource;

/**
 * Created by rui on 2/23/17.
 */


public class About extends NetsecResource {
    public About() {
        super("about");
        add(new Name());
        add(new Description());
    }
}
