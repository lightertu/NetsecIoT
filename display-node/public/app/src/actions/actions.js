/**
 * Created by turui on 2/7/2017.
 */
import axios from 'axios';
import { IOT_SERVER_URL } from "../index"

// TODO: Using function factors to reduce redundant code

/* fetching */
let fetchDeviceList = function() {
    return function(dispatch) {
        dispatch({ type: FETCH_DEVICE_LIST });
        axios.get(IOT_SERVER_URL + "/api/devices")
            .then((response) => {
                dispatch(receivedDeviceList(response.data));
            })
            .catch((error) => {
                dispatch(receivedDeviceListError(error));
            });
    };
};

let fetchSensorStatus = function(ipAddress, sensorIndex, sensorPath) {
    return function(dispatch) {
        dispatch({
            type: FETCH_SENSOR_STATUS,
            ipAddress: ipAddress,
            sensorIndex: sensorIndex,
            payload:  "fetching"
        });
        axios.get(IOT_SERVER_URL + "/api/devices/" + ipAddress + sensorPath)
            .then((response)=> {
                dispatch(receivedSensorStatus(ipAddress, sensorIndex, response.data));
            })
            .catch((error) => {
                dispatch(receivedSensorStatusError(ipAddress, error))
            });
    }
};


let fetchActuatorStatus = function(ipAddress, actuatorIndex, actuatorPath) {
    return function(dispatch) {
        dispatch({
            type: FETCH_ACTUATOR_STATUS,
            ipAddress: ipAddress,
            sensorIndex: actuatorIndex,
            payload:  "fetching"
        });
        axios.get(IOT_SERVER_URL + "/api/devices/" + ipAddress + actuatorPath)
            .then((response)=> {
                dispatch(receivedActuatorStatus(ipAddress, actuatorIndex, response.data));
            })
            .catch((error) => {
                dispatch(receivedActuatorStatusError(ipAddress, error))
            });
    }
};

let controlActuator = function(ipAddress, actuatorIndex, actuatorPath, payload) {
    return function(dispatch) {
        dispatch({
            type: CONTROL_ACTUATOR,
            ipAddress: ipAddress,
            sensorIndex: actuatorIndex,
            payload:  "controlling"
        });

        axios.put(IOT_SERVER_URL + "/api/devices/" + ipAddress + actuatorPath, { payload: payload } )
            .then((response)=> {
                dispatch(receivedActuatorStatus(ipAddress, actuatorIndex, response.data));
            })
            .catch((error) => {
                dispatch(receivedActuatorStatusError(ipAddress, actuatorIndex))
            });
    }
};

/* receive success */
let receivedDeviceList = function(payload) {
    return { type: RECEIVED_DEVICE_LIST, payload: payload };
};

let receivedSensorStatus = function(ipAddress, sensorIndex, payload) {
    return {
        type: RECEIVED_SENSOR_STATUS,
        ipAddress: ipAddress,
        sensorIndex: sensorIndex,
        payload: payload
    }
};

let receivedActuatorStatus = function(ipAddress, actuatorIndex, payload) {
    return {
        type: RECEIVED_ACTUATOR_STATUS,
        ipAddress: ipAddress,
        actuatorIndex: actuatorIndex,
        payload: payload
    }
};

/* receive failure */
let receivedDeviceListError = function(error) {
    return { type: RECEIVED_DEVICE_LIST_ERROR, payload: error };
};

let receivedSensorStatusError = function(ipAddress, sensorIndex) {
    return {
        type: RECEIVED_SENSOR_STATUS_ERROR,
        ipAddress: ipAddress,
        sensorIndex: sensorIndex,
        payload: "error"
    }
};

let receivedActuatorStatusError = function(ipAddress, actuatorIndex) {
    return {
        type: RECEIVED_ACTUATOR_STATUS_ERROR,
        ipAddress: ipAddress,
        actuatorIndex: actuatorIndex,
        payload: "error"
    }
};
export {
    fetchDeviceList,
    fetchSensorStatus,
    fetchActuatorStatus,

    controlActuator,

    receivedDeviceList,
    receivedSensorStatus,
    receivedActuatorStatus,

    receivedDeviceListError,
    receivedSensorStatusError,
    receivedActuatorStatusError
};

/* fetching */
export const FETCH_DEVICE_LIST = "FETCH_DEVICE_LIST";
export const FETCH_SENSOR_STATUS = "FETCH_SENSOR_STATUS";
export const FETCH_ACTUATOR_STATUS = "FETCH_ACTUATOR_STATUS";

/* controlling */
export const CONTROL_ACTUATOR = "CONTROL_ACTUATOR";

/* receive success */
export const RECEIVED_DEVICE_LIST = "RECEIVED_DEVICE_LIST";
export const RECEIVED_SENSOR_STATUS = "RECEIVED_SENSOR_STATUS";
export const RECEIVED_ACTUATOR_STATUS = "RECEIVED_ACTUATOR_STATUS";

/* receive failure */
export const RECEIVED_DEVICE_LIST_ERROR = "RECEIVED_DEVICE_LIST_ERROR";
export const RECEIVED_SENSOR_STATUS_ERROR = "RECEIVED_SENSOR_STATUS_ERROR";
export const RECEIVED_ACTUATOR_STATUS_ERROR = "RECEIVED_ACTUATOR_STATUS_ERROR";
