let coap           = require('coap');
let port           = 6666;
let HashMap        = require('hashmap');
let server         = coap.createServer({ type: 'udp6' });
let coapDevicesMap = new HashMap();

function coapServicesStringParser(serviceString) {
    let raw_services = serviceString.split(",");

    let services = [];
    raw_services.pop();

    for (let i = 0; i < raw_services.length; i++) {
        let s = raw_services[i].split("|");
        let newService = {
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
};

server.on('request', function(req, res) {
    let deviceAddress = req.rsinfo.address;
    if (req.url == "/devices") {
        if (!coapDevicesMap.has(deviceAddress)) {
            console.log("Found new node: " + deviceAddress);
            let serviceString = req.payload.toString('ascii');
            let servicesArray = coapServicesStringParser(serviceString);
            coapDevicesMap.set(deviceAddress, servicesArray);
            console.log(servicesArray);
        }
    } 
});
