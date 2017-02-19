/**
 * Created by rui on 2/11/17.
 */
/**
 * Created by rui on 2/11/17.
 */
import React from "react"
import Toggle from 'material-ui/Toggle';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Slider from 'material-ui/Slider';

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
        const actuatorComponent = device.actuatorList.map((actuator) => {
            return (
                <ListItem
                    key={ actuator._id }
                    disabled={ true }
                    insetChildren={ true }
                >
                    <Toggle
                        label={ actuator.name }
                        style={ styles.toggle }
                        defaultToggled={ actuator.status == "1"}
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
