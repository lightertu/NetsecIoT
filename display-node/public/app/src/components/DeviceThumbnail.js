import React from "react"
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import DeviceDashboard from "./DeviceDashboard";

const styles = {
    chip: {
        margin: 4,
    },
};


export default class DeviceThumbnail extends React.Component {
    constructor(){
        super();
        this.state = {
            dashboardOpen: false,
        };

        this.dataFetchingId = 0;
    }

    dashboardToggle = () => {

        // here sensor data will be fetched
        this.setState( { dashboardOpen: !this.state.dashboardOpen } );
        // this logic is kind of strange
        if (!this.state.dashboardOpen) {
            // execute immediately
            this.props.fetchSensorStatus(this.props.device);
            this.props.fetchActuatorStatus(this.props.device);
            // interval loop
            this.dataFetchingId = setInterval( () => {
                this.props.fetchSensorStatus(this.props.device);
                // interval loop
            }, 5000);
        } else {
            clearInterval(this.dataFetchingId);
        }
    };

    convertName (deviceName) {
        let convertedName = "";
        for (let i = 0; i < deviceName.length; i++) {
            if (deviceName[i] != ' ') {
                convertedName += deviceName[i].toLowerCase();
            }
        }

        return convertedName;
    }

    render() {
        let device = this.props.device;

        let imageSrc = "../../assets/imgs/" + this.convertName(device.name) + ".jpg";

        return (
            <div class="col-md-4 portfolio-item">
                <Card>
                    <CardMedia overlay={ <CardTitle title={ device.name }
                                                    subtitle={ <samp> { device.ipAddress } </samp> }
                                         /> }
                    >
                    <img class="img-responsive" src={ imageSrc } alt="" />
                    </CardMedia>
                    <CardText>
                        <RaisedButton
                            icon={ <FontIcon className="material-icons">settings</FontIcon> }
                            label="Control"
                            secondary={ true }
                            style={ styles.button }
                            onClick={ this.dashboardToggle } primary={true}
                            target="_blank"
                        />
                    </CardText>
                </Card>
                <DeviceDashboard
                    open={ this.state.dashboardOpen }
                    toggle={ this.dashboardToggle }
                    device={ device }
                    imageSrc={ imageSrc }
                    controlActuator={ this.props.controlActuator }
                />
            </div>
        );
    }
}
