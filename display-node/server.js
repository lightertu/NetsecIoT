var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost:27017/iotnodes', function(err) {
    if (err) {
        console.log("Not connected to database: " + err);
    } else {
        console.log("Connected to mongodbs");
    }
});


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
    
});
app.listen(port, function() {
    console.log('server is running on ' + port);
});
