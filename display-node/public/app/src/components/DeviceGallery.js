import React from "react"
import DeviceThumbnail from "./DeviceThumbnail.js"
import PageHeader from "./PageHeader.js"

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
                {name: "raspberry pi", description: "cool stuff", ipAddress: "fe23:21::01"},
                {name: "raspberry pi", description: "cool stuff", ipAddress: "fe24:21::01"},
                {name: "raspberry pi", description: "cool stuff", ipAddress: "fe25:21::01"},
                {name: "raspberry pi", description: "cool stuff", ipAddress: "fe26:21::01"},
                {name: "raspberry pi", description: "cool stuff", ipAddress: "fe27:21::01"},
                {name: "raspberry pi", description: "cool stuff", ipAddress: "fe28:21::01"}
            ]
        );
    }

    render() {
        const { devices } = this.state;
        const devicesComponentList = devices.map(deviceObj =>{
            return ( <DeviceThumbnail key={ deviceObj.ipAddress }
                                      name={ deviceObj.name }
                                      description={ deviceObj.description } /> );
        });
        return (
            <div class="container">
                <PageHeader name="Devices" description="iott"/>
                <div class="row">
                    { devicesComponentList }
                </div>
            </div>
        );
    }
}