/**
 * Created by rui on 2/21/17.
 */
let coap             = require('coap');

let req = coap.request('coap://[ff05::fd]/.well-known/core');

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
