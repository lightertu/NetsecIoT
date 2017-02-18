/**
 * Created by rui on 2/17/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let sensorSchema = new Schema ({
    name: { type: String },
    path: { type: String },
    status: { type: String, default: "null" }
});

let Sensor = mongoose.model('Sensor', sensorSchema);
module.exports = Sensor;
