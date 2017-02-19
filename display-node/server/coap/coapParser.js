/**
 * Created by rui on 2/17/17.
 */
let Device = require('../models/device');
let Sensor = require('../models/sensor');
let Actuator = require('../models/actuator');

let exampleAdvertisingString = "/sensor/temperature,1|/actuator/led,4|/sensor/fire,1";
// create a Device Object

let createDevice = function ( ipAddress, advertisingString ) {
    let endpoints = advertisingString.split('|');
    let newDevice = new Device({
        ipAddress: ipAddress,
        sensorList: [ ],
        actuatorList: [ ]
    });

    for (let i = 0; i < endpoints.length; i++) {
        let serviceType = endpoints[i].split('/')[1],
            serviceName = endpoints[i].split('/')[2].split(',')[0],
            servicePath = endpoints[i].split(',')[0];

        let sensorIndex = 0,
            actuatorIndex = 0;
        switch (serviceType){

            case("sensor"):
                let newSensor = new Sensor({
                    index: sensorIndex++,
                    name: serviceName,
                    path: servicePath,
                    status: "null"
                });

                newDevice.sensorList.push(newSensor);
                break;

            case("actuator"):
                let newActuator = new Actuator({
                    index: actuatorIndex++,
                    name: serviceName,
                    path: servicePath,
                    status: "null",
                    dataFormat: "boolean"
                });

                newDevice.actuatorList.push(newActuator);
                break;

            default:
                console.log("cannot recognize the service " + servicePath);
                break;
        }
    }

    return newDevice;
};

module.exports = {
    createDevice: createDevice
};
