/**
 * Created by turui on 2/7/2017.
 */
import {
    REFRESH_DEVICE_LIST,
    RECEIVED_DEVICE_LIST,
    FETCH_DEVICE_LIST_ERROR
} from '../actions/actions';

const initialState = {
    deviceList: []
};

let iotControllerApp = (state = initialState, action) => {
    switch (action.type) {
        case REFRESH_DEVICE_LIST:
            return { deviceList: action.payload};
        case RECEIVED_DEVICE_LIST:
            return state;
        case FETCH_DEVICE_LIST_ERROR:
            return state;
        default:
            return state;
    }
};

export { iotControllerApp };