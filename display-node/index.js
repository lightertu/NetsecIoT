// dependencies
let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let morgan = require('morgan');
let bodyParser = require('body-parser');
let path = require('path');
let coapServer = require('./coap-server.js');
let mongoose = require('mongoose');

// webpack hot loading
(function() {
    // Step 1: Create & configure a webpack compiler
    let webpack = require('webpack');
    let webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
    let compiler = webpack(webpackConfig);

    // Step 2: Attach the dev middleware to the compiler & the server
    app.use(require("webpack-dev-middleware")(compiler, {
        noInfo: true, publicPath: webpackConfig.output.publicPath
    }));

    // Step 3: Attach the hot middleware to the compiler & the server
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));

})();

// MongoDB
// mongoose.connect('mongodb://localhost/iot');
// let db = mongoose.connection;

// express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public/dist'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/index.html'));
});

app.use('/api', require('./server/routes/api'));

// Start HTTP server
app.listen(port, function() {
    console.log('web server is running on ' + port);
});

// the default CoAP port is 6666
coapServer.server.listen(coapServer.port, function() {
    console.log("coap server is running start, listening on port: " + coapServer.port);
});
