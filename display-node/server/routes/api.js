let express = require('express') ;
let request = require('request');
let http = require('http');
let router = express.Router();
let DeviceCollection = require("../models/device");

const coapProxyUrl = "http://192.168.1.216:5683/proxy/";
const coapScannerUrl = "http://192.168.1.216:8080/";

let createDevice = function ( ipAddress, name, description, servicesString ) {
    let endpoints = servicesString.split(',');
    let newDevice = new DeviceCollection({
        name: name,
        description: description,
        ipAddress: ipAddress,
        sensorList: [],
        actuatorList: [],
    });

    for (let i = 0; i < endpoints.length - 1; i++) {
        let serviceType = endpoints[i].split('/')[1],
            serviceName = endpoints[i].split('/')[2].split(':')[0],
            servicePath = endpoints[i].split(':')[0],
            serviceDataFormat = endpoints[i].split(':')[1];

        let sensorIndex = 0,
            actuatorIndex = 0;

        switch (serviceType){

            case("sensor"):
                let newSensor = {
                    index: sensorIndex++,
                    name: serviceName,
                    path: servicePath,
                    status: "null",
                    dataFormat: serviceDataFormat
                };

                newDevice.sensorList.push(newSensor);
                break;

            case("actuator"):
                let newActuator = {
                    index: actuatorIndex++,
                    name: serviceName,
                    path: servicePath,
                    status: "null",
                    dataFormat: serviceDataFormat
                };

                newDevice.actuatorList.push(newActuator);
                break;

            default:
                console.log("cannot recognize the service " + servicePath);
                break;
        }
    }
    return newDevice;
};

let updateDeviceCollection = function( deviceList, httpResponse ) {
    for (let key in deviceList) {
        if (deviceList.hasOwnProperty(key)) {
            DeviceCollection.findOne({ "ipAddress": key }, function(err, device) {
                if (!err) {
                    if (!device) {
                        let newDevice = createDevice(deviceList[key].ipAddress,
                            deviceList[key].name,
                            deviceList[key].description,
                            deviceList[key].services
                        );

                        newDevice.save(function(error, device){
                            if(error) {
                                return console.error(error);
                            } else {
                                if (device != null) {
                                    console.log("saving device successful");
                                }
                            }
                        });
                   }
                }
            });
        }
    }
};

/* routes */
router.get('/devices', function(httpRequest, httpResponse){
    request({
        method: 'GET',
        uri: coapScannerUrl + "api/devices",
        timeout: 3000
    }, function(error, coapScannerResponse, body) {
        if (error) {
            next();
            return console.error('get devices failed');
        }

        updateDeviceCollection(JSON.parse(body), httpResponse);

        DeviceCollection.find({}, function(err, deviceList){
            if (err) {
                throw err;
            } else {
                httpResponse.setHeader('Content-Type', 'application/json');
                httpResponse.send(JSON.stringify( deviceList ), null, 3);
            }
        });
    });
});

router.get('/devices/:ipAddress', function(httpRequest, httpResponse, next){
    let deviceAddress = httpRequest.params.ipAddress;
    request({
        method: 'GET',
        uri: coapScannerUrl + "api/devices/" + deviceAddress,
    }, function(error, coapScannerResponse, body) {
        if (error) {
            httpResponse.send("Scanner timeout");
            return console.error('get devices failed');
        }

        httpResponse.setHeader('Content-Type', 'application/json');
        httpResponse.send(body);
    });
});


// routes talking to iot devices
router.get('/devices/:ipAddress/sensor/:name', function(httpRequest, httpResponse, next){
    let deviceAddress = httpRequest.params.ipAddress,
        sensorName = httpRequest.params.name;

    request({
        method: 'GET',
        uri: coapProxyUrl + "coap://[" + deviceAddress + "]" + "/sensor/" + sensorName,
    }, function(error, response, body) {
        if (error) {
            httpResponse.send("Proxy timeout");
            return console.error("get sensor" + deviceAddress + " failed");
        }

        DeviceCollection.update(
            {
                "ipAddress": deviceAddress,
                "sensorList.name": sensorName,
            },
            {
                $set: {
                    "sensorList.$.status": httpRequest.body.payload
                }
            },
            function(error, count, status) {
                if (error) {
                    console.log(error);
                }
            }
        );

        // TODO: save sensor information to database and respond to client
        httpResponse.send(body);
    });
});

router.get('/devices/:ipAddress/actuator/:name', function(httpRequest, httpResponse, next){
    let deviceAddress = httpRequest.params.ipAddress,
        actuatorName = httpRequest.params.name;

    request({
        method: 'GET',
        uri: coapProxyUrl + "coap://[" + deviceAddress + "]" + "/actuator/" + actuatorName,
    }, function(error, response, body) {
        if (error) {
            httpResponse.send("Proxy timeout");
            return console.error("get actuator" + deviceAddress + " failed");
        }

        // TODO: save actuator information to database and respond to client
        DeviceCollection.update(
            {
                "ipAddress": deviceAddress,
                "actuatorList.name": actuatorName,
            },
            {
                $set: {
                    "actuatorList.$.status": httpRequest.body.payload
                }
            },
            function(error, count, status) {
                if (error) {
                    console.log(error);
                }
            }
        );
        httpResponse.send(body);

    });
});

router.put('/devices/:ipAddress/actuator/:name', function(httpRequest, httpResponse, next){
    let deviceAddress = httpRequest.params.ipAddress,
        actuatorName = httpRequest.params.name;

    request({
        method: 'PUT',
        uri: coapProxyUrl + "coap://[" + deviceAddress + "]" + "/actuator/" + actuatorName,
        'content-type': 'text/plain',
        body: httpRequest.body.payload, // payload property is added from the client
    }, function(error, response, body) {
        if (error) {
            return console.error("put actuator" + deviceAddress + " failed");
        }

        DeviceCollection.update({
                "ipAddress": deviceAddress,
                "actuatorList.name": actuatorName,
            },
            {
                $set: {
                    "actuatorList.$.status": response.body.toString()
                }
            },
            function(error, count, status) {
                if (error) {
                    console.log(error);
                }
            });

        httpResponse.send(response.body);
    });
});

module.exports = router;