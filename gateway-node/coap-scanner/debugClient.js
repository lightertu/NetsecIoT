let coap = require('coap');

let servicesRequest = coap.request({
    hostname: "ff02::1%lowpan0",
    pathname: "about/name",
    multicast: true,
    multicastTimeout: 2000,
});

servicesRequest.on('response', function (servicesResponse) {
    servicesResponse.on('error', function (error) {
        console.log(error);
    });

    let services = servicesResponse.payload.toString();
        console.log(services);
});

servicesRequest.end();
