/**
 * Created by rui on 2/17/17.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let actuatorSchema = new Schema ({
    name: { type: String },
    path: { type: String },
    dataFormat: { type: String },
    status: { type: String, default: "null" }
});

let Actuator = mongoose.model('Actuator', actuatorSchema);
module.exports = Actuator;
