/**
 * Created by rui on 2/11/17.
 */
import React from "react"
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Actuator from './Actuator';

const styles = {
    chip: {
        margin: 4,
    },
    toggle: {
        marginRight: 5
    }
};

export default class ActuatorList extends React.Component {
    constructor(){
        super();
    }


    render() {
        let device = this.props.device;
        let actuatorIndex = 0;
        const actuatorComponent = device.actuatorList.map((actuator) => {
            return (
                <ListItem
                    key={ actuator._id }
                    disabled={ true }
                    insetChildren={ true }
                >

                    <Actuator
                        styles = { styles }
                        device = { this.props.device }
                        actuatorIndex = { actuatorIndex++ }
                        controlActuator = { this.props.controlActuator }
                    />

                </ListItem>
            );
        });

        return (
            <div>
                <ListItem
                    disabled={true}
                    leftAvatar={
                        <Avatar icon={ <FontIcon className="material-icons">toys</FontIcon> } />
                    }
                >
                    Actuators
                </ListItem>
                <Divider inset={true} />
                { actuatorComponent }
            </div>
        );
    }
};
