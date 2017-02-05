/**
 * Created by rui on 2/4/17.
 */
// dependencies
let mongoose = require('mongoose');
let deviceSchema = new mongoose.Schema({
    ipAddress: String,
    name: String,
    description: String,
    paths: [ { String, Number}  ]
});

module.exports = mongoose.model('Device', deviceSchema);
