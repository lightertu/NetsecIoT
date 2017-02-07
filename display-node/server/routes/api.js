let express = require('express') ;
let coapServer = require('../../coap-server');
let router = express.Router();
let coapDevicesMap = coapServer.coapDevicesMap;

// routes
router.get('/devices', function(req, res){
    let coapDeviceList = []
    coapDevicesMap.forEach(function(value, key){
        coapDeviceList.push(
            {
                ipAddress: key,
                paths: value.paths,
                name: value.name,
                description: value.description,
            }
        );
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(coapDeviceList), null, 3);
});

let findDeviceByAddress = function (ipAddress, callback) {
    if (!coapDevicesMap.get(ipAddress)) {
        return callback(new Error(
                'No device found ' + ipAddress
            )
        );
    }
    return callback(null, coapDevicesMap.get(ipAddress));
};

router.get('/devices/:ipAddress', function(req, res, next){
    let deviceIPAddress = req.params.ipAddress;
    findDeviceByAddress(deviceIPAddress, function(error, device) {
        if (error) {
            return next(error);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(coapDevicesMap.get(deviceIPAddress)));
    })
});

module.exports = router;
