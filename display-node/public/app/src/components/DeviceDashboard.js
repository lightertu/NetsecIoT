/**
 * Created by rui on 2/11/17.
 */
import React from "react"
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export default class DeviceDashboard extends React.Component {
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
                    openSecondary={ true }
                    onRequestChange={ this.props.toggle }
                    disableSwipeToOpen={ true }
                    swipeAreaWidth={10}
                >
                    <Menu>
                        <MenuItem>Menu Item</MenuItem>
                        <MenuItem>Menu Item 2</MenuItem>
                    </Menu>
                </Drawer>
            </div>
        );
    }
}
