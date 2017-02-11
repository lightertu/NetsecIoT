/**
 * Created by rui on 2/4/17.
 */
import React from "react"
import { Link } from "react-router"
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import SideMenu from "./SideMenu"

export default class NavBar extends React.Component {
    constructor(){
        super();
        this.state = { open: false };
    }

    handleToggle = () => this.setState({open: !this.state.open});

    render(){
        return (
            <div>
                <nav class="navbar navbar-fixed-top" role="navigation">
                    <AppBar
                        title= "Netsec"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={ this.handleToggle }
                    />
                </nav>
                <SideMenu open={ this.state.open }/>
            </div>
        );
    }
}
