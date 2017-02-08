import React from "react"
import { connect } from "react-redux"
import DeviceThumbnail from "./DeviceThumbnail.js"
import PageHeader from "./PageHeader.js"

@connect((store) => {
    console.log(store);
    return ({
        deviceList: store.deviceList
    });
})
export default class DeviceGallery extends React.Component {
    constructor() {
        super();
    }

    render() {
        const devicesComponentList = this.props.deviceList.map(deviceObj =>{
            return ( <DeviceThumbnail
                        key={ deviceObj.ipAddress }
                        name={ deviceObj.name }
                        description={ deviceObj.description }
                        ipAddress={ deviceObj.ipAddress}
                    /> );
        });
        return (
            <div class="container">
                <PageHeader name="Devices" description = { "Online: " +  this.props.deviceList.length}/>
                <div class="row">
                    { devicesComponentList }
                </div>
            </div>
        );
    }
}