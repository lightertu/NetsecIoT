/**
 * Created by turui on 2/7/2017.
 */
import {
    FETCH_DEVICE_LIST,
    FETCH_SENSOR_DATA,

    RECEIVED_DEVICE_LIST,
    RECEIVED_SENSOR_DATA,

    RECEIVED_DEVICE_LIST_ERROR,
    RECEIVED_SENSOR_DATA_ERROR,

} from '../actions/actions';

const initialState = {
    deviceList: []
};

let iotControllerApp = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVED_DEVICE_LIST:
            return { deviceList: action.payload };
        default:
            return state;
    }
};

export { iotControllerApp };