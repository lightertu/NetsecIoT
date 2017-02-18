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

import { fromJS } from 'immutable';

const initialState = fromJS({
        deviceList: []
    },
);

let updateSensorStatus = (state, action) => {
    let deviceIndex = state.get('deviceList')
        .findIndex(function(device) {
            return device.get('ipAddress') === action.ipAddress;
        });

    return state.setIn(['deviceList', deviceIndex, 'sensorList', action.sensorIndex, 'status'], action.payload);
};


let iotControllerApp = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SENSOR_DATA:
            return updateSensorStatus(state, action);
        case RECEIVED_SENSOR_DATA_ERROR:
            return updateSensorStatus(state, action);
        case RECEIVED_DEVICE_LIST:
            console.log(state);
            return state.set( 'deviceList', fromJS(action.payload));
        case RECEIVED_SENSOR_DATA:
            return updateSensorStatus(state, action);
        case FETCH_DEVICE_LIST:
            return state;
        default:
            return state;
    }
};

export { iotControllerApp };
