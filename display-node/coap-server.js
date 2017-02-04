var coap           = require('coap');
var port           = 6666;
var HashMap        = require('hashmap');
var coapDevicesMap = new HashMap();
var server         = coap.createServer({ type: 'udp6' });
var coapDevicesMap = new HashMap();

function coapServicesStringParser(serviceString) {
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

module.exports = {
    server: server,
    coapDevicesMap: coapDevicesMap,
    port: port
}

server.on('request', function(req, res) {
    var deviceAddress = req.rsinfo.address;
    if (req.url == "/devices") {
        if (!coapDevicesMap.has(deviceAddress)) {
            console.log("Found new node: " + deviceAddress);
            var serviceString = req.payload.toString('ascii');
            var servicesArray = coapServicesStringParser(serviceString);
            coapDevicesMap.set(deviceAddress, servicesArray);
            console.log(servicesArray);
        }
    } 
});
