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
            next();
            console.log(err);
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
                    httpResponse.send("device not found");
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
                        Device.update(
                            {
                                "ipAddress": deviceAddress,
                                "sensorList.name": sensorName,
                            },
                            {
                                $set: {
                                    "sensorList.$.status": coapPayload
                                }
                            },
                            function(error, count, status) {
                                if (error) {
                                    console.log(error);
                                }
                            }
                        );
                        httpResponse.send(coapPayload);
                    });

                    coapRequest.on('error', function (error) {
                        console.log(error);
                        httpResponse.send("timeout");
                        next();
                    });
                    coapRequest.end();
                }
            }
        });
    }
    else {
        httpResponse.send(Math.round(Math.random()*100).toString())
    }
});

router.get('/devices/:ipAddress/actuator/:name', function(httpRequest, httpResponse, next){
    let deviceAddress = httpRequest.params.ipAddress,
        actuatorName = httpRequest.params.name;

    //noinspection JSUnresolvedFunction
    Device.findOne({ipAddress: deviceAddress, 'actuatorList.name': actuatorName}, function (err, device) {
        if (err) {
            throw err;
        } else {
            if (device == null) {
                httpResponse.send("device not found");
            } else {
                let coapRequest = coap.request(
                    {
                        hostname: deviceAddress,
                        pathname: "actuator/" + actuatorName,
                        port: 5683,
                        method: 'GET'
                    }
                );

                coapRequest.on('response', function (coapResponse) {
                    let coapPayload = coapResponse.payload.toString('ascii');
                    Device.update(
                        {
                            "ipAddress": deviceAddress,
                            "actuatorList.name": actuatorName,
                        },
                        {
                            $set: {
                                "actuatorList.$.status": coapPayload
                            }
                        },
                        function(error, count, status) {
                            if (error) {
                                console.log(error);
                            }
                        }
                    );
                    httpResponse.send(coapPayload);
                });

                coapRequest.on('error', function (error) {
                    console.log(error);
                    httpResponse.send("timeout");
                    next();
                });
                coapRequest.end();
            }
        }
    });
});

router.put('/devices/:ipAddress/actuator/:name', function(httpRequest, httpResponse, next){
    let deviceAddress = httpRequest.params.ipAddress,
        actuatorName = httpRequest.params.name;

    //noinspection JSUnresolvedFunction
    Device.findOne({ipAddress: deviceAddress, 'actuatorList.name': actuatorName}, function (err, device) {
        if (err) {
            throw err;
        } else {
            if (device == null) {
                httpResponse.send("actuator not found" + actuatorName);
            } else {
                let coapRequest = coap.request(
                    {
                        hostname: deviceAddress,
                        pathname: "actuator/" + actuatorName,
                        port: 5683,
                        method: 'PUT'
                    }
                );

                // axios automatically converts string payload to json
                // therefore I added a payload property to the payload
                coapRequest.write(httpRequest.body.payload);
                coapRequest.on('response', function (coapResponse) {
                    let coapPayload = coapResponse.payload.toString('ascii');
                    Device.update(
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
                    httpResponse.send(coapPayload);
                });

                coapRequest.on('error', function (error) {
                    httpResponse.send("timeout");
                    next();
                });

                coapRequest.end();
            }
        }
    });
});

module.exports = router;
