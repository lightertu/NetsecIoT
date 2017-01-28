var coap        = require('coap'),
    HashMap     = require('hashmap'),
    server      = coap.createServer({ type: 'udp6' });

var devicesMap = new HashMap();

server.on('request', function(req, res) {
    if (req.url === "/devices/nodes") {
        var deviceAddress = req.rsinfo.address;
        if (!devicesMap.has(deviceAddress)) {
            devicesMap.set(deviceAddress, {});
            coap.request('coap://[' + deviceAddress + ']' + "/.well-known/core")
                .on('response', function(response){
                    response.pipe(process.stdout);
                })
                .end();
        }
    } else {
        console.log("Doesn't have endpoint: " + req.url);
    }
})

// the default CoAP port is 5683
server.listen(function() {
    console.log("server start");
})
