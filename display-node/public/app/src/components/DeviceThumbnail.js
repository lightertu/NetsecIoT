import React from "react"
import { IOT_SERVER_URL }  from "../index"
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FontIcon from 'material-ui/FontIcon';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import {blue300, indigo900} from 'material-ui/styles/colors';

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

import Toggle from 'material-ui/Toggle';
export default class DeviceThumbnail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expanded: false,
        };
    }

    handleExpandChange = (expanded) => {
        this.setState({expanded: expanded});
    };

    handleToggle = (event, toggle) => {
        this.setState({expanded: toggle});
    };

    handleExpand = () => {
        this.setState({expanded: true});
    };

    handleReduce = () => {
        this.setState({expanded: false});
    };

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
                        <Toggle
                            toggled={this.state.expanded}
                            onToggle={this.handleToggle}
                            labelPosition="right"
                            label="Control Panel"
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}
