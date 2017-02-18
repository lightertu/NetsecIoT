let express = require('express') ;
let coapServer = require('../coap/coapServer');
let coap = require('coap');
let router = express.Router();
let Device = require('../models/device');
let DEV_MODE = 0;

/* routes */
router.get('/devices', function(req, res){
    //noinspection JSUnresolvedFunction
    Device.find({}, function(err, deviceList){
        if (err) {
            throw err;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify( deviceList ), null, 3);
        }
    });
});

router.get('/devices/:ipAddress', function(req, res, next){
    let deviceAddress = req.params.ipAddress;
    //noinspection JSUnresolvedFunction
    Device.findOne({ ipAddress: deviceAddress }, function(err, device) {
        if (err) {
            throw err;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(device));
        }
    });
});

// routes talking to iot devices
router.get('/devices/:ipAddress/sensor/:name', function(httpRequest, httpResponse, next){
    if (!DEV_MODE) {
        let deviceAddress = httpRequest.params.ipAddress,
            sensorName = httpRequest.params.name;

        //noinspection JSUnresolvedFunction
        Device.findOne({ipAddress: deviceAddress, 'sensorList.name': sensorName}, function (err, device) {
            if (err) {
                throw err;
            } else {
                if (device == null) {
                    httpResponse.send("device not found, or doesn't not have sensor: " + sensorName);
                } else {
                    let coapRequest = coap.request(
                        {
                            hostname: deviceAddress,
                            pathname: "sensor/" + sensorName,
                            port: 5683,
                            method: 'GET'
                        }
                    );

                    coapRequest.on('response', function (coapResponse) {
                        let coapPayload = coapResponse.payload.toString('ascii');
                        httpResponse.send(coapPayload);
                    });

                    coapRequest.on('error', function (error) {
                        console.log("coap get request error");
                        console.log(error);
                    });

                    coapRequest.end();
                    setTimeout(function () {
                        httpResponse.send("timeout");
                    }, 2000);

                }
            }
        });
    }
    else {
        httpResponse.send(Math.round(Math.random()*100).toString())
    }
});

router.put('/devices/:ipAddress/actuator/:name', function(httpRequest, httpResponse, next){
    if (!DEV_MODE) {
        let deviceAddress = httpRequest.params.ipAddress,
            actuatorName = httpRequest.params.name;

        //noinspection JSUnresolvedFunction
        Device.findOne({ipAddress: deviceAddress, 'actuatorList.name': actuatorName}, function (err, device) {
            if (err) {
                throw err;
            } else {
                if (device == null) {
                    httpResponse.send("device not found, or doesn't not have actuator: " + actuatorName);
                } else {
                    let coapRequest = coap.request(
                        {
                            hostname: deviceAddress,
                            pathname: "actuator/" + actuatorName,
                            port: 5683,
                            method: 'PUT'
                        }
                    );

                    coapRequest.write(httpRequest.body);
                    coapRequest.on('response', function (coapResponse) {
                        let coapPayload = coapResponse.payload.toString('ascii');
                        httpResponse.send(coapPayload);
                    });

                    coapRequest.on('error', function (error) {
                        console.log("coap put request error");
                        console.log(error);
                    });

                    coapRequest.end();
                    setTimeout(function () {
                        httpResponse.send("timeout");
                    }, 2000);
                }
            }
        });
    } else {
        httpResponse.send("ON");
    }
});

module.exports = router;
