var React = require('react');
var DeviceThumbNail = require('./DeviceThumbNail.js');

var DeviceGallery = React.createClass({
    getDevicesinfo: function() {
        return ([
            {name: "samr21-xpro"},
            {name: "rpi"},
        ]);
    },


    createDevices: function() {
        return (
            this
            .getDevicesinfo()
            .map(function(deviceObj) {
                return (<DeviceThumbNail name = deviceObj.name />);
            }.bind(this))
        );
    }

    render: function() {
        var thumbnails = this.createDevices();
        return (
            <div>
                { thumbnails }
            </div>
        );
    }
});

module.export = DeviceGallery;
