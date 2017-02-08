/**
 * Created by rui on 2/4/17.
 */
/* library files */
import React from "react"
import ReactDOM from "react-dom"
import { Router, Route, IndexRoute, browserHistory, hashHistory} from "react-router"
import { Provider } from "react-redux";

/* custom files */
import DeviceGallery from './components/DeviceGallery.js'
import About from './components/About.js'
import NavBar from './components/NavBar.js'
import store from './store/store.js'

class App extends React.Component {
    render() {
       return(
           <Provider store={ store }>
               <div>
                   <NavBar />
                   <Router history={ hashHistory }>
                       <Route path={"/"} component={ DeviceGallery }/>
                       <Route path={"/devices"} component={ DeviceGallery }/>
                       <Route path={ "/about" } component= { About } />
                   </Router>
               </div>
           </Provider>
       );
    }
}

const app = document.getElementById("app");
ReactDOM.render( <App/> ,app);
