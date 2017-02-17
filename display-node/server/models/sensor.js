/**
 * Created by rui on 2/17/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let sensorSchema = new Schema ({
    name: String,
    path: String,
    status: String
});

module.exports = mongoose.model('Sensor', sensorSchema);