/**
 * Created by rui on 2/4/17.
 */
/* library files */
import React from "react"
import ReactDOM from "react-dom"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Router, Route, hashHistory} from "react-router"
import { Provider } from "react-redux";
import injectTapEventPlugin from 'react-tap-event-plugin';

/* custom files */
import DeviceGallery from './components/DeviceGallery.js'
import About from './components/About.js'
import NavBar from './components/NavBar.js'
import store from './store/store.js'

export const IOT_SERVER_URL = "http://192.168.1.141:8080";

injectTapEventPlugin();

class App extends React.Component {
    render() {
       return(
           <MuiThemeProvider>
               <Provider store={ store }>
                   <div>
                       <NavBar />
                       <Router history={ hashHistory }>
                           <Route path={"/"} component={ DeviceGallery }/>
                           <Route path={"/devices"} component={ DeviceGallery }/>
                           <Route path={ "/about" } component={ About } />
                       </Router>
                   </div>
               </Provider>
           </MuiThemeProvider>
       );
    }
}

const app = document.getElementById("app");
ReactDOM.render( <App/> ,app);
