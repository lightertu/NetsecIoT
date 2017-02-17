/**
 * Created by rui on 2/4/17.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Sensor = require('./sensor');
let Actuator = require('./actuator');

let deviceSchema = new Schema({
    ipAddress: String,
    name: String,
    description: String,
    sensorList: [ Sensor ],
    actuatorList: [ Actuator ]
});

module.exports = mongoose.model('Device', deviceSchema);