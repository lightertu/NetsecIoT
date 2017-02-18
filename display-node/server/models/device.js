/**
 * Created by rui on 2/4/17.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let deviceSchema = new Schema({
    ipAddress: { type: String },
    name: { type: String, default: "samr21-xpro" },
    description: { type: String, default: "riot device" },

    sensorList: [
        {
            name: { type: String },
            path: { type: String },
            status: { type: String }
        }
    ],

    actuatorList: [
        {
            name: { type: String },
            path: { type: String },
            dataFormat: { type: String },
            status: { type: String }
        }
    ]
});

module.exports = mongoose.model('Device', deviceSchema);