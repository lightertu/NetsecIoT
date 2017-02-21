/**
 * Created by rui on 2/18/17.
 */
import React from "react"
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';

let createToggleHandler = (device, actuatorIndex, controlActuator) => {
    return (event, toggled) => {
        let payload = (toggled) ? "1" : "0";
        controlActuator(device, actuatorIndex, payload);
    }
};

let createSliderHandler = (device, actuatorIndex, controlActuator) => {
    return (event, newValue) => {
        controlActuator(device, actuatorIndex, newValue.toString());
    }
};

let createToggleButton = (props) => {
    let actuator = props.device.actuatorList[props.actuatorIndex];
    return (
        <Toggle
            label   ={ actuator.name }
            style   ={ props.styles.toggle }
            toggled ={ actuator.status == "1"}
            disabled={ actuator.status == "error"}
            onToggle={ createToggleHandler(props.device, props.actuatorIndex, props.controlActuator) }
        />
    );
};

let createSlideBar = (props) => {
    let actuator = props.device.actuatorList[props.actuatorIndex];
    return (
        <div>
            { actuator.name }
            { actuator.status }
            <Slider
                min={ 0 }
                max={ 100 }
                step={ 1 }
                defaultValue={ 50 }
                value={ parseInt(actuator.status) }
                disabled={ actuator.status == "error"}
                onChange={createSliderHandler(props.device, props.actuatorIndex, props.controlActuator)}
            />
        </div>
    );
}


export default class Actuator extends React.Component {
    constructor(){
        super();
    }

    render() {
        let device = this.props.device,
            actuator = device.actuatorList[this.props.actuatorIndex];

        switch (actuator.dataFormat) {
            case("boolean"):
                return createToggleButton(this.props);
            case("number"):
                return createSlideBar(this.props);
            default:
                return (<div> {"does not support type: " + actuator.dataFormat} </div>)
        }
    }
}
