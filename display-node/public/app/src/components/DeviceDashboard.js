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

    block: {
        maxWidth: 250,
    },
    toggle: {
    },
    thumbOff: {
        backgroundColor: '#ffcccc',
    },
    trackOff: {
        backgroundColor: '#ff9d9d',
    },
    thumbSwitched: {
        backgroundColor: 'red',
    },
    trackSwitched: {
        backgroundColor: '#ff9d9d',
    },
    labelStyle: {
        color: 'red',
    },
};

export default class DeviceDashboard extends React.Component {
    constructor(){
        super();
    }

    render(){
        let device = this.props.device;
        return (
            <div>
                <Drawer
                    docked={ false }
                    width={ 400 }
                    open={ this.props.open }
                    openSecondary={ true }
                    onRequestChange={ this.props.toggle }
                >
                    <CardHeader
                        title={ device.name }
                        subtitle={ <samp> { device.ipAddress } </samp> }
                        avatar={ this.props.imageSrc }
                    />
                    <Divider />
                    <List>
                        <ListItem
                            disabled={true}
                            leftAvatar={
                                <Avatar icon={ <FontIcon className="material-icons">memory</FontIcon> } />
                            }
                        >
                            Sensors
                        </ListItem>
                        <Divider inset={true} />

                            <ListItem
                                disabled={ true }
                                insetChildren={ true }
                                primaryText={ "Temperature:" }
                                rightAvatar={ <Chip style = {styles.chip} > 99F</Chip>}
                            >
                            </ListItem>

                        <ListItem
                            disabled={true}
                            leftAvatar={
                                <Avatar icon={ <FontIcon className="material-icons">toys</FontIcon> } />
                            }
                        >
                            Actuators
                        </ListItem>
                        <Divider inset={true} />
                        <ListItem disabled={ true } insetChildren={ true }>
                            <Toggle
                                label="LED"
                                style={styles.toggle}
                            />
                        </ListItem>
                        <ListItem
                            disabled={ true }
                            insetChildren={ true }
                            rightAvatar={ <Chip style = {styles.chip} > 99F</Chip>}
                        >
                            Thermostats
                            <Slider step={0.10} value={0.5} />
                        </ListItem>
                    </List>
                </Drawer>
            </div>
        );
    }
}
