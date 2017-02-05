/**
 * Created by rui on 2/4/17.
 */
import React from "react"
import { Link } from "react-router"

export default class NavBar extends React.Component {
    constructor(){
        super();
    }

    render(){
        return (
            <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="/">NETSEC IoT Testbed</a>
                    </div>
                    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul class="nav navbar-nav" role="nav">
                            <li>
                                <a href="#/about">About</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
