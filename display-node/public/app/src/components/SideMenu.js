/**
 * Created by rui on 2/10/17.
 */
import React from "react"
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class SideMenu extends React.Component {
    constructor(){
        super();
    }

    render(){
        return (
            <div>
                <Drawer
                    docked={ false }
                    width={ 300 }
                    open={ this.props.open }
                    onRequestChange={ (open) => this.setState({ open }) }
                >
                    <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
                    <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
                </Drawer>
            </div>
        );
    }
}

