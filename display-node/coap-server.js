var coap           = require('coap');
var HashMap        = require('hashmap');
var coapDevicesMap = new HashMap();
var server         = coap.createServer({ type: 'udp6' });
var coapDevicesMap = new HashMap();

module.exports = {
    server: server,

    coapDevicesMap: coapDevicesMap,

    coapServicesStringParser: function (serviceString) {
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
    }
}

server.on('request', function(req, res) {
    if (req.url === "/devices/nodes") {
        var deviceAddress = req.rsinfo.address;
        if (!coapDevicesMap.has(deviceAddress)) {
            console.log("Found new node: " + deviceAddress);
            var servicesArray = coapServicesStringParser(req.payload.toString('ascii'));
            coapDevicesMap.set(deviceAddress, servicesArray);
            console.log(servicesArray);
        }

    } else {
        console.log("Doesn't have endpoint: " + req.url);
    }
});

server.listen(function() {
    console.log("coap server is running start");
});
