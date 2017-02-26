/**
 * Created by turui on 2/7/2017.
 */
import { applyMiddleware, createStore } from 'redux';
import { iotControllerApp } from '../reducers/reducers';
import { fetchDeviceList } from '../actions/actions';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const middleware = applyMiddleware(thunk, logger());
const store = createStore(iotControllerApp, middleware);

setTimeout( () => {
    store.dispatch((dispatch)=> {
        (fetchDeviceList())(dispatch);
    });
}, 2000);

export default store;