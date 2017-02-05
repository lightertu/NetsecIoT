let express = require('express') ;
let coapServer = require('../../coap-server');
let router = express.Router();
let HashMap        = require('hashmap');

// routes
router.get('/devices', function(req, res){
    let coapDevicesMap = coapServer.coapDevicesMap;
    let coapDeviceList = { list: [] };

    coapDevicesMap.forEach(function(value, key){
        coapDeviceList.list.push(
            JSON.stringify({
                ipAddress: key,
                paths: value
            })
        );
    });

    res.send(JSON.stringify(coapDeviceList));
});

module.exports = router;
