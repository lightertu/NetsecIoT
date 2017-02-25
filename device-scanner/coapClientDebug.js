/**
 * Created by rui on 2/21/17.
 */

let mongoose         = require('mongoose');
let deviceDatabase   = mongoose.connect('mongodb://localhost/iot').connection;
let coapParser       = require('./coapParser');
let Device           = require('../models/device');

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
                newDevice.save( function(error, device){
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

setInterval(function() {
    let coap = require('coap');
    let nameRequest = coap.request({
        hostname: "ff02::1%lowpan0",
        pathname: "about/name",
        multicast: true,
        multicastTimeout: 2000,
    });

    nameRequest.on('response', function(nameResponse) {
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

                // save device here
                saveDevice(ipAddress, name, description, services);
            });
            servicesRequest.end();
        });
        descriptionRequest.end();
    });
    nameRequest.end();
}, 1000);
