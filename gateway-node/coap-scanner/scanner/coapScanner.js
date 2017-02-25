/**
 * Created by rui on 2/21/17.
 */

let coapParser       = require('./serviceParser');
let NodeCache        = require('node-cache');
let deviceCache      = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const multicastAddress = "ff02::1%lowpan0";
const scanPeriod = 3000;

let saveDevice = function(ipAddress, name, description, services) {
    deviceCache.get(ipAddress, function(err, value){
        if( !err ){
            if(value == undefined){
                let newDevice = coapParser.createDevice(ipAddress, name, description, services);

                deviceCache.set( ipAddress, newDevice, function( err, success ) {
                    if (!err && success) {
                        console.log(success);
                    } else {
                        console.log(err);
                    }
                });

            }else{
                console.log( "device " + ipAddress + "is already in" );
            }
        } else {
            console.log("cache error")
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
    }, scanPeriod);
};

module.exports = {
    scan: scan,
    deviceCache: deviceCache
};
