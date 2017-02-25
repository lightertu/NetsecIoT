package org.netsec.iottestbed.nonembedded;
import java.io.IOException;
import org.eclipse.californium.core.*;
import org.eclipse.californium.proxy.DirectProxyCoapResolver;
import org.eclipse.californium.proxy.ProxyHttpServer;
import org.eclipse.californium.proxy.resources.ForwardingResource;
import org.eclipse.californium.proxy.resources.ProxyCoapClientResource;
import org.eclipse.californium.proxy.resources.ProxyHttpClientResource;


/**
 * Http2CoAP: Insert in browser:
 *     URI: http://localhost:8080/proxy/coap://localhost:PORT/target
 *
 * CoAP2CoAP: Insert in Copper:
 *     URI: coap://localhost:PORT/coap2coap
 *     Proxy: coap://localhost:PORT/targetA
 *
 * CoAP2Http: Insert in Copper:
 *     URI: coap://localhost:PORT/coap2http
 *     Proxy: http://lantersoft.ch/robots.txt
 */


public class CoapProxy {
    private static final int PORT = 5683;
    private static final String MULTICAST_ADDR = "ff02::1";
    private CoapServer _proxyServer;
    public CoapProxy() throws IOException {
        ForwardingResource coap2coap = new ProxyCoapClientResource("coap2coap");
        ForwardingResource coap2http = new ProxyHttpClientResource("coap2http");
        ForwardingResource http2coap = new ProxyHttpClientResource("http2coap");

        // Create CoAP Server on PORT with proxy resources form CoAP to CoAP and HTTP
        _proxyServer = new CoapServer(PORT);
        _proxyServer.add(coap2coap);
        _proxyServer.add(coap2http);
        _proxyServer.add(http2coap);

        ProxyHttpServer httpServer = new ProxyHttpServer(PORT);
        httpServer.setProxyCoapResolver(new DirectProxyCoapResolver(coap2coap));
        System.out.println("CoAP resource \"target\" available over HTTP at: http://localhost:8080/proxy/coap://ipv6address:PORT/path");
    }

    private void start() {
        _proxyServer.start();
    }

    public static void main(String[] args) throws Exception {
        CoapProxy borderRouter = new CoapProxy();
        borderRouter.start();
    }
}
