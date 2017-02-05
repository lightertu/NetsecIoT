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

// this will change the information of the device
router.put('devices/:ipAddress', function(req, res, next){

});

// this will send commands to iot devices
router.get('devices/:ipAddress/get', function(req, res, next){

});

router.put('devices/:ipAddress/put', function(req, res, next){

});

module.exports = router;
