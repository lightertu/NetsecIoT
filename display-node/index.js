let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let morgan = require('morgan');
let bodyParser = require('body-parser');
let router = express.Router();
let path = require('path');
let coapServer = require('./coap-server.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/dist'));
app.use(express.static(__dirname + '/public'));


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/index.html'));
});

app.listen(port, function() {
    console.log('web server is running on ' + port);
});

// the default CoAP port is 5683
coapServer.server.listen(coapServer.port, function() {
    console.log("coap server is running start, listening on port: " + coapServer.port);
});
