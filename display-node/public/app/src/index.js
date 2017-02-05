/**
 * Created by rui on 2/4/17.
 */
import React from "react"
import { render } from "react-dom"
import { Router, Route, IndexRoute, hashHistory} from "react-router"

import DeviceGallery from './components/DeviceGallery.js'
const app = document.getElementById("device");

render(
    <Router history={hashHistory}>
        <Route path="/" component={ DeviceGallery }>
        </Route>
    </Router>,
app);
