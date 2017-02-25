/**
 * Created by rui on 2/25/17.
 */
let express = require('express') ;
let router = express.Router();
let Device = require('../models/device');

/* routes */
router.get('/devices', function(req, res){
    //noinspection JSUnresolvedFunction
    Device.find({}, function(err, deviceList){
        if (err) {
            throw err;
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify( deviceList ), null, 3);
        }
    });
});

router.get('/devices/:ipAddress', function(req, res, next){
    let deviceAddress = req.params.ipAddress;
    //noinspection JSUnresolvedFunction
    Device.findOne({ ipAddress: deviceAddress }, function(err, device) {
        if (err) {
            next();
            console.log(err);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(device));
        }
    });
});

module.exports = router;
