/**
 * Created by turui on 2/7/2017.
 */
import axios from 'axios';
import { IOT_SERVER_URL } from "../index"

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

let fetchSensorData = function(ipAddress, sensorIndex, sensorPath) {
    return function(dispatch) {
        dispatch({
            type: FETCH_SENSOR_DATA,
            ipAddress: ipAddress,
            sensorIndex: sensorIndex,
            payload:  "fetching"
        });
        axios.get(IOT_SERVER_URL + "/api/devices/" + ipAddress + sensorPath)
            .then((response)=> {
                dispatch(receivedSensorData(ipAddress, sensorIndex, response.data));
            })
            .catch((error) => {
                dispatch(receivedSensorDataError(ipAddress, error))
            });
    }
};

/* receive success */
let receivedSensorData = function(ipAddress, sensorIndex, payload) {
    return {
        type: RECEIVED_SENSOR_DATA,
        ipAddress: ipAddress,
        sensorIndex: sensorIndex,
        payload: payload
    }
};

let receivedDeviceList = function(payload) {
    return { type: RECEIVED_DEVICE_LIST, payload: payload };
};


/* receive failure */
let receivedDeviceListError = function(error) {
    return { type: RECEIVED_DEVICE_LIST_ERROR, payload: error };
};

let receivedSensorDataError = function(ipAddress, sensorIndex) {
    return {
        type: RECEIVED_SENSOR_DATA,
        ipAddress: ipAddress,
        sensorIndex: sensorIndex,
        payload: "error"
    }
};

export {
    fetchDeviceList,
    fetchSensorData,

    receivedDeviceList,
    receivedSensorData,

    receivedDeviceListError,
    receivedSensorDataError,
};

/* fetching */
export const FETCH_DEVICE_LIST = "FETCH_DEVICE_LIST";
export const FETCH_SENSOR_DATA = "FETCH_SENSOR_DATA";

/* receive success */
export const RECEIVED_DEVICE_LIST = "RECEIVED_DEVICE_LIST";
export const RECEIVED_SENSOR_DATA = "RECEIVED_SENSOR_DATA";

/* receive failure */
export const RECEIVED_DEVICE_LIST_ERROR = "RECEIVED_DEVICE_LIST_ERROR";
export const RECEIVED_SENSOR_DATA_ERROR = "RECEIVED_SENSOR_DATA_ERROR";
