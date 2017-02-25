package org.netsec.iottestbed.nonembedded;

import java.io.IOException;
import java.net.*;

import org.eclipse.californium.core.*;
import org.eclipse.californium.core.network.CoapEndpoint;
import org.eclipse.californium.core.network.EndpointManager;
import org.eclipse.californium.core.network.config.NetworkConfig;
import org.eclipse.californium.core.server.resources.CoapExchange;

import org.eclipse.californium.proxy.DirectProxyCoapResolver;
import org.eclipse.californium.proxy.ProxyHttpServer;
import org.eclipse.californium.proxy.resources.ForwardingResource;
import org.eclipse.californium.proxy.resources.ProxyCoapClientResource;
import org.eclipse.californium.proxy.resources.ProxyHttpClientResource;

import static org.eclipse.californium.core.network.config.NetworkConfig.Keys.COAP_PORT;

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
    private static final int PORT = 6666;
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

        ProxyHttpServer httpServer = new ProxyHttpServer(8080);
        httpServer.setProxyCoapResolver(new DirectProxyCoapResolver(coap2coap));
        System.out.println("CoAP resource \"target\" available over HTTP at: http://localhost:8080/proxy/coap://ipv6address:PORT/path");
    }

    private void start() {
        _proxyServer.start();
        scanDevices();
    }

    private void scanDevices() {
        DeviceScanner scanner = new DeviceScanner("0:0:0:0:0:0:0:1", 5683);
        scanner.scan();
    }

    public static void main(String[] args) throws Exception {
        CoapProxy borderRouter = new CoapProxy();
        borderRouter.start();
    }
}
