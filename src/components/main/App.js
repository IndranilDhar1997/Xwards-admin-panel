//Importing Core React Modules
import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from './pages/login';
import Dashboard from "./pages/dashboard";
import Profile from './pages/profile';
// import TrackDrivers from "./pages/trackDrivers";
import CriticalDrivers from './pages/criticalDrivers'
import DriverDetails from "./pages/driverDetails";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"

class App extends Component {
	
	render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                        <Switch>
                            <Route exact path="/" component={Login} />
                            <Route component={Dashboard} />
                            {/* <Route exact path="/profile" component={Profile} /> */}
                            {/*<Route exact path="/track-drivers" component={TrackDrivers} />
                            <Route exact path="/critical-drivers" component={CriticalDrivers} />
                            <Route exact path="/track-drivers/:driverId" component = { DriverDetails } />
                            <Route exact path="/xplay-request" component = { XPlayRequest } /> */}
                        </Switch>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

export default App;
