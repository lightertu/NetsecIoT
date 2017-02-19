/**
 * Created by rui on 2/18/17.
 */
import React from "react"
import Toggle from 'material-ui/Toggle';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Slider from 'material-ui/Slider';

let createToggleHandler = (device, actuatorIndex, controlActuator) => {
    return (event, toggled) => {
        let payload = (toggled) ? "1" : "0";
        controlActuator(device, actuatorIndex, payload);
    }
};

let createSliderHandler = (device, actuatorIndex, controlActuator) => {
    return (event, newValue) => {
        controlActuator(device, actuatorIndex, payload);
    }
};

export default class ActuatorList extends React.Component {
    constructor(){
        super();
    }
}
