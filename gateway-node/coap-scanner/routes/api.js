/**
 * Created by rui on 2/25/17.
 */
let express = require('express') ;
let router = express.Router();
let deviceCache = require('../scanner/coapScanner').deviceCache;


/* routes */
router.get('/devices', function(req, res){
    deviceCache.mget(deviceCache.keys(), function(err, deviceList){
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
    deviceCache.get(deviceAddress, function(err, device){
        if( !err ){
            if(device == undefined){
                res.send("device not found");
                next();
            }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify( device ), null, 3);
            }
        }
    });
});

module.exports = router;
