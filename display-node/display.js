var coap        = require('coap'),
    HashMap     = require('hashmap'),
    express     = require('express'),
    server      = coap.createServer({ type: 'udp6' });

var devicesMap = new HashMap();

var serviceStringParser = function (serviceString) {
    var raw_services = serviceString.split(",");
    var services = [];
    raw_services.pop();
    for (var i = 0; i < raw_services.length; i++) {
        var s = raw_services[i].split("|");
        var newService = {
            path: s[0],
            method: s[1]
        };
        services.push(newService);
    }

    return services;
};

server.on('request', function(req, res) {
    if (req.url === "/devices/nodes") {
        var deviceAddress = req.rsinfo.address;
        if (!devicesMap.has(deviceAddress)) {
            console.log("Found new node: " + deviceAddress);
            var servicesArray = serviceStringParser(req.payload.toString('ascii'));
            devicesMap.set(deviceAddress, servicesArray);
            console.log(servicesArray);
        }

    } else {
        console.log("Doesn't have endpoint: " + req.url);
    }
});

// the default CoAP port is 5683
server.listen(function() {
    console.log("server start");
});
