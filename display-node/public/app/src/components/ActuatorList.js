/**
 * Created by rui on 2/11/17.
 */
/**
 * Created by rui on 2/11/17.
 */
import React from "react"
import Drawer from 'material-ui/Drawer';
import Toggle from 'material-ui/Toggle';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';
import Slider from 'material-ui/Slider';
import { CardHeader } from 'material-ui/Card';

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
        let deviceAddress = this.props.ipAdress;
        const actuatorComponent = this.props.actuators.map((actuator) => {
            return (
                <ListItem
                    key={ actuator.name }
                    disabled={ true }
                    insetChildren={ true }
                >
                    <Toggle
                        label={ actuator.name }
                        style={styles.toggle}
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
