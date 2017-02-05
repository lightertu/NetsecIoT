/**
 * Created by rui on 2/4/17.
 */
/* library files */
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, browserHistory, hashHistory} from "react-router"

/* custom files */
import DeviceGallery from './components/DeviceGallery.js'
import About from './components/About.js'
import NavBar from './components/NavBar.js'

class App extends React.Component {
    render() {
       return(
           <div>
               <NavBar />
               <Router history={ hashHistory }>
                   <Route path={"/"} component={ DeviceGallery }></Route>
                   <Route path={ "/about" } component= { About } />
               </Router>
           </div>
       );
    }
}

const app = document.getElementById("app");
ReactDOM.render( <App/> ,app);
