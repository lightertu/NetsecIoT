let express = require('express') ;
let coapServer = require('../../coap-server');
let coap = require('coap');
let router = express.Router();
let deviceMap = coapServer.deviceMap;

// routes
router.get('/devices', function(req, res){
    let deviceList = coapServer.getDeviceList();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify( deviceList ), null, 3);
});

let findDeviceByAddress = function (ipAddress, callback) {
    if (!deviceMap.get(ipAddress)) {
        return callback(new Error(
                'No device found ' + ipAddress
            )
        );
    }
    return callback(null, deviceMap.get(ipAddress));
};

router.get('/devices/:ipAddress', function(req, res, next){
    let deviceIPAddress = req.params.ipAddress;
    findDeviceByAddress(deviceIPAddress, function(error, device) {
        if (error) {
            return next(error);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(deviceMap.get(deviceIPAddress)));
    })
});

router.get('/devices/:ipAddress/sensor/:name', function(httpRequest, httpResponse, next){
    let deviceIPAddress = httpRequest.params.ipAddress,
        sensorName = httpRequest.params.name;

    deviceMap.get(deviceIPAddress, function(err, value){
        if (!err) {
            if (value == undefined) {
                httpResponse.setHeader('Content-Type', 'text/plain');
                httpResponse.send(deviceIPAddress + " is offline");
            } else {
                let coapRequest = coap.request(
                    {
                        hostname: deviceIPAddress,
                        pathname: "sensor/" + sensorName,
                        port: 5683,
                        method: 'GET'
                    }
                );

                coapRequest.on('response', function (coapResponse) {
                    let coapPayload = coapResponse.payload.toString('ascii');
                    httpResponse.setHeader('Content-Type', 'application/json');
                    httpResponse.send(coapPayload);
                });

                coapRequest.end();
            }
        } else {
            httpResponse.send(err);
        }
    });
});

router.put('/devices/:ipAddress/actuator/:name', function(httpRequest, httpResponse, next){
    let deviceIPAddress = httpRequest.params.ipAddress,
        actuatorName = httpRequest.params.name;

    deviceMap.get(deviceIPAddress, function(err, value){
        if (!err) {
            if (value == undefined) {
                httpResponse.setHeader('Content-Type', 'text/plain');
                httpResponse.send(deviceIPAddress + " is offline");
            } else {
                let coapRequest = coap.request(
                    {
                        hostname: deviceIPAddress,
                        pathname: "actuator/" + actuatorName,
                        port: 5683,
                        method: 'PUT'
                    }
                );

                coapRequest.write(httpRequest.payload.toString('ascii'));
                coapRequest.on('response', function (coapResponse) {
                    let coapPayload = coapResponse.payload.toString('ascii');
                    httpResponse.setHeader('Content-Type', 'application/json');
                    httpResponse.send(coapPayload);
                });
                coapRequest.end();
            }
        } else {
            httpResponse.send(err);
        }
    });
});

module.exports = router;
