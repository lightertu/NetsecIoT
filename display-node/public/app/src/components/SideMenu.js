/**
 * Created by rui on 2/10/17.
 */
import React from "react"
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
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
                    onRequestChange={ this.props.toggle }
                >
                    <Menu>
                        <MenuItem onTouchTap={ this.props.toggle } >Menu Item</MenuItem>
                        <MenuItem onTouchTap={ this.props.toggle }>Menu Item 2</MenuItem>
                    </Menu>
                </Drawer>
            </div>
        );
    }
}

