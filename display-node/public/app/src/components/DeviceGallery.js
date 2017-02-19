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
            fetchDeviceStatus: (device) => {
                for (let i = 0; i < device.sensorList.length; i++) {
                    let sensor = device.sensorList[i];
                    actions.fetchSensorStatus(device.ipAddress, i, sensor.path)(dispatch);
                }
                for (let i = 0; i < device.actuatorList.length; i++) {
                    let actuator = device.actuatorList[i];
                    actions.fetchActuatorStatus(device.ipAddress, i, actuator.path)(dispatch);
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
                fetchDeviceStatus = { this.props.fetchDeviceStatus }
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