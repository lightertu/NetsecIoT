/**
 * Created by rui on 2/4/17.
 */
import React from "react"
import FontIcon from 'material-ui/FontIcon';
const iconStyles = {
    marginRight: 10,
    fontSize: '48px',
};


export default class DeviceGalleryHeader extends React.Component {
    constructor(){
        super();
    }
    render() {
        return (
            <div class="row">
                <div class="col-lg-12">
                    <h1 class="page-header">
                        <FontIcon className="material-icons" style={iconStyles}> developer_board </FontIcon>
                        <small> { this.props.description }</small>
                    </h1>
                </div>
            </div>
        );
    }
}
