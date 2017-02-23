/**
 * Created by rui on 2/21/17.
 */
let coap             = require('coap');

let req = coap.request({
    //hostname: "ff05:0:0:0:0:0:0:fd",
    hostname: "127.0.0.1",
    pathname: "sensor/temperature",
    multicast: true,
    multicastTimeout: 2000,
});

req.on('response', function(res) {
    res.pipe(process.stdout);
    res.on('end', function() {
        process.exit(0)
    })

    res.on('error', function(error){
       console.log(error);
    });
});

req.end();
