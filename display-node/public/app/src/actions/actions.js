/**
 * Created by turui on 2/7/2017.
 */
export const REFRESH_DEVICE_LIST = "REFRESH_DEVICE_LIST";
export const RECEIVED_DEVICE_LIST = "REFRESH_DEVICE_LIST";
export const FETCH_DEVICE_LIST_ERROR = "REFRESH_DEVICE_LIST";
import axios from 'axios';

let refreshDeviceList = function() {
    return function(dispatch){
        axios.get("http://localhost:8080/api/devices")
            .then((response) => {
                dispatch(receivedDeviceList(response.data));
            })
            .catch((error) => {
                dispatch(receivedDeviceListError(error));
            });
    };
};

let receivedDeviceList = function(payload) {
    return { type: REFRESH_DEVICE_LIST, payload: payload };
};

let receivedDeviceListError = function(error) {
    return { type: FETCH_DEVICE_LIST_ERROR, payload: error };
};

export { refreshDeviceList, receivedDeviceList, receivedDeviceListError };

