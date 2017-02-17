/**
 * Created by rui on 2/17/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let actuatorSchema = new Schema ({
    name: String,
    path: String,
    dataFormat: String,
    status: String
});

module.exports = mongoose.model('Actuator', actuatorSchema);