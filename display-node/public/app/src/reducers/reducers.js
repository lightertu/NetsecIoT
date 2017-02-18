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

let iotControllerApp = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVED_DEVICE_LIST:
            console.log(state);
            return state.set( 'deviceList', fromJS(action.payload));
        case RECEIVED_SENSOR_DATA:
            let deviceIndex = state.get('deviceList')
                .findIndex(function(device) {
                    return device.get('ipAddress') === action.ipAddress;
                });

            let newState = state.setIn(['deviceList', deviceIndex, 'sensorList', action.sensorIndex, 'status'], action.payload);

            return newState;
        case FETCH_DEVICE_LIST:
            return state;
        case "dumpAction":
            alert("dumpAction");
            return state;
        default:
            return state;
    }
};

export { iotControllerApp };

