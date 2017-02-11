let coap           = require('coap');
let port           = 6666;
let server         = coap.createServer({ type: 'udp6' });
let nodeCache      = require('node-cache');
let deviceMap      = new nodeCache( { stdTTL: 15, checkperiod: 15 } );

let coapServicesStringParser = function(serviceString) {
    let rawServices = serviceString.split(",");
    let services = [];
    rawServices.pop();
    for (let i = 0; i < rawServices.length; i++) {
        let s = rawServices[i].split("|");
        let newService = {
            path: s[0],
            method: s[1]
        };
        services.push(newService);
    }
    return services;
};

let getDeviceList = function() {
    let deviceList = [];
    deviceMap.keys( function( err, keys ){
        if( !err ){ deviceList = keys; }
        else { console.log(err); }
    });

    for (let i = 0; i < deviceList.length; i++ ) {
        let key = deviceList[i];
        deviceMap.get( key, function (err, value) {
            if( !err ){
                if(value == undefined){
                    console.log("key: " + key + " is not found");
                } else {
                    deviceList[i] = value;
                }
            }
        })
    }

    return deviceList;
};

server.on('request', function(req, res) {
    let deviceAddress = req.rsinfo.address;
    if (req.url == "/devices") {
        if (!deviceMap.has(deviceAddress)) {
            console.log("Found new node: " + deviceAddress);
            let serviceString = req.payload.toString('ascii');
            let servicesArray = coapServicesStringParser(serviceString);
            deviceMap.set(deviceAddress,
                {
                    paths: servicesArray,
                    name: "samr21-xpro",
                    description: "an awesome device"
                }, function(error, success) {
                    if (!error && success) {
                        console.log("added " + deviceAddress + " into cache");
                    } else {
                        console.log(error);
                    }
                }
            );
            console.log(servicesArray);
        }
    }
});

/* fake test data */
deviceMap.set(
    "fe80::bc11:96ff:fedb:2717",
    {
        ipAddress: "fe80::bc11:96ff:fedb:2717",
        paths: [
            {path: '/actuator/led', method: '4'},
            {path: '/cli/stats', method: '1'},
            {path: '/sensor/temperature', method: '1'}
        ],

        name: "samr21-xpro",
        description: "a whatever device"
    }
);

deviceMap.set(
    "fe10::cool:96ff:fedb:1231",
    {
        ipAddress: "fe10::cool:96ff:fedb:1231",
        paths: [
            {path: '/actuator/led', method: '4'},
            {path: '/cli/stats', method: '1'},
            {path: '/sensor/temperature', method: '1'}
        ],

        name: "Raspberry Pi",
        description: "The Raspberry Pi is a series of small single-board " +
                     "computers developed in the United Kingdom by the Raspberry Pi " +
                     "Foundation to promote the teaching of basic computer science in schools " +
                     "and in developing countries."
    }
);

setInterval(function(){
    console.log(deviceMap.keys());
}, 2000);

module.exports = {
    server: server,
    deviceMap: deviceMap,
    port: port,
    getDeviceList: getDeviceList
};
