import React from "react"
import { connect } from "react-redux"
import DeviceThumbnail from "./DeviceThumbnail.js"
import PageHeader from "./PageHeader.js"
import * as actions from "../actions/actions"

@connect(
    // mapStateToProps
    (store) => {
        return ({
            deviceList: store.get('deviceList').toJS(),
        });
    },
    // mapDispatchToProps
    (dispatch) => {
        return {
            fetchSensorData: (device) => {
                for (let i = 0; i < device.sensorList.length; i++) {
                    let sensor = device.sensorList[i];
                    actions.fetchSensorData(device.ipAddress, i, sensor.path)(dispatch);
                }
            }
        }
    }
)
export default class DeviceGallery extends React.Component {
    constructor() {
        super();
    }

    render() {
        let deviceList = this.props.deviceList;
        let deviceCount = deviceList.length;
        const devicesThumbnailComponents = deviceList.map(device => {
            return ( <DeviceThumbnail
                key={ device._id }
                device= { device }
                fetchSensorData = { this.props.fetchSensorData }
            /> )
        });

        return (
            <div class="container">
                <PageHeader name="Devices" description = { "Online: " +  deviceCount}/>
                <div class="row">
                    { devicesThumbnailComponents }
                </div>
            </div>
        );
    }
}