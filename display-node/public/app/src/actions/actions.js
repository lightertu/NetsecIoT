/**
 * Created by turui on 2/7/2017.
 */
import axios from 'axios';
import { IOT_SERVER_URL } from "../index"

let refreshDeviceList = function() {
    return function(dispatch){
        axios.get(IOT_SERVER_URL + "/api/devices")
            .then((response) => {
                dispatch(receivedDeviceList(response.data));
            })
            .catch((error) => {
                dispatch(receivedDeviceListError(error));
            });
    };
};

let fetchSensorData = function(deviceIndex, sensorIndex, sensorName, ipAddress) {
    return function(dispatch) {
        axios.get(IOT_SERVER_URL + "/api/devices/" + ipAddress + "/" + sensorName)
            .then((response)=>{
                dispatch(receivedSensorData(deviceIndex, sensorIndex, response.data));
            })
            .catch((error) => {
                dispatch(receivedSensorDataError(error))
            });
    }
};

let receivedSensorData = function(deviceIndex, sensorIndex, payload) {
    return {
        type: RECEIVED_SENSOR_DATA,
        deviceIndex: deviceIndex,
        sensorIndex: sensorIndex,
        payload: payload
    }
};

let receivedDeviceList = function(payload) {
    return { type: REFRESH_DEVICE_LIST, payload: payload };
};

let receivedDeviceListError = function(error) {
    return { type: FETCH_DEVICE_LIST_ERROR, payload: error };
};

let receivedSensorDataError = function(error) {
    return { type: FETCH_SENSOR_DATA_ERROR, payload: error };
};

export {
    refreshDeviceList,
    fetchSensorData,
    receivedDeviceList,
    receivedDeviceListError,
    receivedSensorData
};
export const REFRESH_DEVICE_LIST = "REFRESH_DEVICE_LIST";
export const RECEIVED_DEVICE_LIST = "RECEIVED_DEVICE_LIST";
export const FETCH_DEVICE_LIST_ERROR = "FETCH_DEVICE_LIST_ERROR";
export const FETCH_SENSOR_DATA_ERROR = "FETCH_DEVICE_LIST_ERROR";
export const RECEIVED_SENSOR_DATA = "RECEIVED_SENSOR_DATA";
