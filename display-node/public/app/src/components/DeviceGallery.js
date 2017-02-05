import React from "react"
import DeviceThumbnail from "./DeviceThumbnail.js"
class DeviceGalleryHeader extends React.Component {
    constructor(){
        super();
    }

    render() {
        return (
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">Devices
                        <small> iot</small>
                    </h1>
                </div>
            </div>
        );
    }
}

export default class DeviceGallery extends React.Component {
    constructor(props, context) {
        super();
        let devicesinfo = this.getDevicesInfo();
        this.state = {
            devices: devicesinfo,
        };
    }

    getDevicesInfo() {
        return  (
            [
                {name: "samrx-21", description: "cool stuff", ipAddr: "fe::01"},
                {name: "raspberry pi", description: "cool stuff", ipAddr: "fe23:21::01"}
            ]
        );
    }

    render() {
        const { devices } = this.state;
        const devicesComponentList = devices.map(deviceObj =>{
            return ( <DeviceThumbnail key={ deviceObj.ipAddr } name={ deviceObj.name } description={ deviceObj.description} /> );
        });
        return (
            <div>
                <DeviceGalleryHeader />
                <div class="row" >
                    { devicesComponentList }
                </div>
            </div>
        );
    }
}