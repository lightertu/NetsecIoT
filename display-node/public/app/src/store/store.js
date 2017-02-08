/**
 * Created by turui on 2/7/2017.
 */
import { applyMiddleware, createStore } from 'redux';
import { iotControllerApp } from '../reducers/reducers';
import { fetchDeviceList, refreshDeviceList, fetchDeviceListError } from '../actions/actions';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

const middleware = applyMiddleware(thunk, logger());
const store = createStore(iotControllerApp, middleware);

//console.log(store.getState());

let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
);

store.dispatch((dispatch)=>{
    fetchDeviceList()(dispatch);
});

export default store;
