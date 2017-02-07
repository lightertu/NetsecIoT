/**
 * Created by turui on 2/7/2017.
 */
const REFRESH_DEVICE_LIST = "REFRESH_DEVICE_LIST";

export function refreshDeviceList(text) {
    return { type: REFRESH_DEVICE_LIST, text }
}

module.export = REFRESH_DEVICE_LIST;