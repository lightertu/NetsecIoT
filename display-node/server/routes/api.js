let express = require('express') ;
let coapServer = require('../../coap-server');
let router = express.Router();
let deviceMap = coapServer.deviceMap;

// routes
router.get('/devices', function(req, res){
    let deviceList = coapServer.getDeviceList();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(deviceList), null, 3);
});

let findDeviceByAddress = function (ipAddress, callback) {
    if (!deviceMap.get(ipAddress)) {
        return callback(new Error(
                'No device found ' + ipAddress
            )
        );
    }
    return callback(null, deviceMap.get(ipAddress));
};

router.get('/devices/:ipAddress', function(req, res, next){
    let deviceIPAddress = req.params.ipAddress;
    findDeviceByAddress(deviceIPAddress, function(error, device) {
        if (error) {
            return next(error);
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(deviceMap.get(deviceIPAddress)));
    })
});

module.exports = router;
