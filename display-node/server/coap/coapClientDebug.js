/**
 * Created by rui on 2/21/17.
 */

setInterval(function() {
    let coap = require('coap');
    let nameRequest = coap.request({
        hostname: "ff02::1%lowpan0",
        pathname: "about/name",
        multicast: true,
        multicastTimeout: 2000,
    });
    nameRequest.on('response', function(nameResponse) {
        let name = nameResponse.payload.toString();
        let descriptionRequest = coap.request({
            hostname: nameResponse.rsinfo.address,
            pathname: "about/description",
            multicast: true,
            multicastTimeout: 2000,
        });

        descriptionRequest.on('response', function(descriptionResponse) {
            let description = descriptionResponse.payload.toString();

            let servicesRequest = coap.request({
                hostname: descriptionResponse.rsinfo.address,
                pathname: "about/services",
                multicast: true,
                multicastTimeout: 2000,
            });

            servicesRequest.on('response', function(servicesResponse) {
                let services = servicesResponse.payload.toString(); 


                // save this crap to database
        
                console.log(name);
                console.log(description);
                console.log(services);



                servicesResponse.on('error', function(error){
                   console.log(error);
                });
            });

            servicesRequest.end();
        });
        descriptionRequest.end();
        nameResponse.on('error', function(error){
           console.log(error);
        });
    });
    nameRequest.end();
}, 1000);
