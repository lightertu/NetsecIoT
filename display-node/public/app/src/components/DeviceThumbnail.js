import React from "react"
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import DeviceDashboard from "./DeviceDashboard"

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    button: {
        margin: 12,
    },
};

export default class DeviceThumbnail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dashboardOpen: false,
        };
    }


    dashbordToggle = () => this.setState( { dashboardOpen: !this.state.dashboardOpen } );

    convertName (name) {
        let convertedName = "";
        for (let i = 0; i < name.length; i++) {
            if (name[i] != ' ') {
                convertedName += name[i].toLowerCase();
            }
        }

        return convertedName;
    }
    render() {
        return (
            <div class="col-md-4 portfolio-item">
                <Card>
                    <CardMedia overlay={ <CardTitle title={ this.props.name } subtitle={ <samp> { this.props.ipAddress } </samp> }/> }>
                    <img class="img-responsive" src={ "../../assets/imgs/" + this.convertName(this.props.name) + ".jpg"} alt="" />
                    </CardMedia>
                    <CardText>
                        <RaisedButton
                            icon={ <FontIcon className="material-icons">settings</FontIcon>}
                            label="Control"
                            secondary={ true }
                            style={styles.button}
                            onClick={ this.dashbordToggle } primary={true}
                            target="_blank"
                        />
                    </CardText>
                </Card>
                <DeviceDashboard open={ this.state.dashboardOpen } toggle={ this.dashbordToggle }/>
            </div>
        );
    }
}
