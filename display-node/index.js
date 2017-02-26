// dependencies
let express = require('express');
let app = express();
let port = process.env.PORT || 8080;
let morgan = require('morgan');
let bodyParser = require('body-parser');
let path = require('path');

let mongoose         = require('mongoose');
let deviceDatabase   = mongoose.connect('mongodb://localhost/iot').connection;
let Device           = require('./server/models/device');

const DEV = 0;

deviceDatabase.on('error', console.error.bind(console, 'connection error:'));
deviceDatabase.once('open', function() {
    console.log("successfully connected to the database");
    Device.remove().exec();
});

// webpack hot loading
if (!DEV) {
    (function () {
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
}

// express
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

if (!DEV) {
    app.use(express.static(__dirname + '/public/dist'));
    app.use(express.static(__dirname + '/public'));
}

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/index.html'));
});

app.use('/api', require('./server/routes/api'));

// Start HTTP server
app.listen(port, function() {
    console.log('coap scanner is running on ' + port);
});
