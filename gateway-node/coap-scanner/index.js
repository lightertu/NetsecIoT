/**
 * Created by rui on 2/25/17.
 */
let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let bodyParser = require('body-parser');
let CoapScanner = require('./scanner/coapScanner');

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));

app.listen(port, function() {
    console.log('web server is running on ' + port);
    CoapScanner.scan("ff02::1", "%lowpan0");
});
