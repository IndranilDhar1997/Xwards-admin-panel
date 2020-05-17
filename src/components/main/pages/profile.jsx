import React, { Component } from 'react';
import { MainNavBar, SideNavBar } from "../../ui/navbar/navbar";

class Profile extends Component {

    render() { 
        return ( 
            <React.Fragment>
            <MainNavBar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-md-4 col-lg-3 col-xl-2 d-none d-md-block padding-left-0 padding-right-0 dashboard-menuholder">
                        <SideNavBar />
                    </div>
                    <div className="col col-8">
                        <div className="margin-top-50 padding-top-10"><h6>Profile </h6></div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        );
    }
}
 
export default Profile;