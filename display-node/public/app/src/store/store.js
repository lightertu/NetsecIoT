/**
 * Created by turui on 2/7/2017.
 */
import { applyMiddleware, createStore } from 'redux';
import { iotControllerApp } from '../reducers/reducers';
import { refreshDeviceList } from '../actions/actions';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

/*
Device {
    name: String,
        ipAddress: String,
        sensors: [ Sensor ],
        actuators: [ Actuator ],
}

Actuator {
    name: String,
    path: String,
    payloadType: String
    status: String,
}

Sensor {
    name: String,
    path: String,
    status: String
}
*/

const middleware = applyMiddleware(thunk, logger());
const store = createStore(iotControllerApp, middleware);

setInterval( () => {
    store.dispatch((dispatch)=> {
        (refreshDeviceList())(dispatch);
    });
}, 2000);

export default store;