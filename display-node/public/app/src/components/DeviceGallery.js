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
        let deviceList = this.props.deviceList;
        const devicesThumbnailComponents = deviceList.map(deviceObj => {
            return ( <DeviceThumbnail
                key={ deviceObj.ipAddress }
                device= { deviceObj }
            /> )
        });

        return (
            <div class="container">
                <PageHeader name="Devices" description = { "Online: " +  this.props.deviceList.length}/>
                <div class="row">
                    { devicesThumbnailComponents }
                </div>
            </div>
        );
    }
}