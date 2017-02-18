/**
 * Created by rui on 2/11/17.
 */
import React from "react"
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List/List';
import Divider from 'material-ui/Divider';
import { CardHeader } from 'material-ui/Card';
import SensorList from './SensorList';
import ActuatorList from './ActuatorList';

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
                        <SensorList ipAddress = { device.ipAddress } device={ device }/>
                        <ActuatorList ipAddress = { device.ipAddress } device={ device }/>
                    </List>
                </Drawer>
            </div>
        );
    }
}
