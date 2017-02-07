/**
 * Created by turui on 2/7/2017.
 */
import { REFRESH_DEVICE_LIST } from "../actions/actions"

const initialState = {
    deviceList: []
};

function todoApp(state = initialState, action) {
    switch (action.type) {
        case REFRESH_DEVICE_LIST:
        default:
            return state
    }
}