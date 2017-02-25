/**
 * Created by rui on 2/21/17.
 */

let mongoose           = require('mongoose');
let deviceDatabase     = mongoose.connect('mongodb://localhost/iot').connection;
let coapParser         = require('./serviceParser');
let Device             = require('../models/device');

const multicastAddress = "ff02::1%lowpan0";
const scannPeriod = 3000;

deviceDatabase.on('error', console.error.bind(console, 'connection error:'));
deviceDatabase.once('open', function() {
    console.log("successfully connected to the database");
    Device.remove().exec();
});

let saveDevice = function(ipAddress, name, description, services) {
    Device.findOne({ ipAddress: ipAddress }, function(error, device){
        if (error) {
            throw error;
        } else {
            if (device == null) {
                let newDevice = coapParser.createDevice(ipAddress, name, description, services);
                newDevice.save(function(error, device){
                    if(error) {
                        return console.error(error);
                    } else {
                        if (device != null) {
                            console.log("saving device successful");
                        }
                    }
                });
            } else {
                console.log("device already existed: " + device.ipAddress);
            }
        }
    });
};

let scan = function() {
    setInterval(function () {
        let coap = require('coap');
        let nameRequest = coap.request({
            hostname: multicastAddress,
            pathname: "about/name",
            multicast: true,
            multicastTimeout: 2000,
        });

        nameRequest.on('response', function (nameResponse) {
            nameResponse.on('error', function (error) {
                console.log(error);
            });

            let name = nameResponse.payload.toString();
            let ipAddress = nameResponse.rsinfo.address;
            let descriptionRequest = coap.request({
                hostname: ipAddress,
                pathname: "about/description",
                multicast: true,
                multicastTimeout: 2000,
            });

            descriptionRequest.on('response', function (descriptionResponse) {
                descriptionResponse.on('error', function (error) {
                    console.log(error);
                });

                let description = descriptionResponse.payload.toString();
                let servicesRequest = coap.request({
                    hostname: ipAddress,
                    pathname: "about/services",
                    multicast: true,
                    multicastTimeout: 2000,
                });

                servicesRequest.on('response', function (servicesResponse) {
                    servicesResponse.on('error', function (error) {
                        console.log(error);
                    });

                    let services = servicesResponse.payload.toString();


                    if ((ipAddress != null && ipAddress.length != 0)     &&
                        (name != null && name.length != 0)               &&
                        (description != null && description.length != 0) &&
                        (services != null && services.length != 0)) {
                        console.log(name);
                        console.log(description);
                        console.log(services);

                        console.log("three ip addresses should match");
                        console.log(nameResponse.rsinfo.address);
                        console.log(descriptionResponse.rsinfo.address);
                        console.log(servicesResponse.rsinfo.address);
                        console.log();

                        // save device here
                        saveDevice(ipAddress, name, description, services);
                    }

                });
                servicesRequest.end();
            });
            descriptionRequest.end();
        });
        nameRequest.on('error', function(error) {
            console.log(error) ;
        });
        nameRequest.end();
    }, scannPeriod);
};

module.exports = {
    scan: scan
};
