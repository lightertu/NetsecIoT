let express = require('express') ;
let coapServer = require('../../coap-server');
let router = express.Router();
let coapDevicesMap = coapServer.coapDevicesMap;

// routes
router.get('/devices', function(req, res){
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

router.get('devices/:ipAddress', function(req, res){
    let deviceIPAddress = req.params.ipAddress;
    res.send(JSON.stringify(coapDevicesMap.get(deviceIPAddress)));
});

module.exports = router;
