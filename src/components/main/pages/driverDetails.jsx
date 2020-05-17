import React, { Component } from 'react';
import { MainNavBar, SideNavBar } from "../../ui/navbar/navbar";
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import Card from 'react-bootstrap/Card';
import Jumbotron from 'react-bootstrap/Jumbotron';


var driverDetails = function (driverDetails) {
    this.setState({driverDetails: driverDetails});
}

class DriverDetails extends Component {
    
    constructor(props)  {
        super(props);
        this.state = {driverDetails: {} };
        driverDetails = driverDetails.bind(this);

        var driverId = props.match.params.driverId;
        AjaxService.get(Routes.GetSearchedVehicle(driverId), function(response) {
            console.log(response);
            driverDetails(response);
        }, function(error) {
            console.log(error);
        })
    }

    render() { 
        return ( 
            <React.Fragment>
                <MainNavBar />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-md-4 col-lg-3 col-xl-2 d-none d-md-block padding-left-0 padding-right-0 dashboard-menuholder">
                            <SideNavBar />
                        </div>
                        <div className="col col-8 margin-top-50 padding-top-10">
                            <div className="col col-12 margin-top-10">
                                <Jumbotron>
                                    <Card className="margin-top-20">
                                        <Card.Header className="text-primary font-weight-700 text-lg">Driver / Owner Details</Card.Header>
                                        <Card.Body>
                                            <div className="row margin-left-5">
                                                <div className="col col-3">
                                                    <img src="https://new-img.patrika.com/upload/uppatrika/upload/images/2016/02/16/Driving-Licence-demo-1455622859_835x547.jpg" 
                                                        alt="" height="100px"/>
                                                </div>
                                                <div className="col col-5">
                                                    { this.state.driverDetails.OwnerOfVehicle !== undefined && (
                                                    <div>
                                                        <div className="text-primary font-weight-bold">Driver Details</div>
                                                        <div className="margin-top-10">Name: {this.state.driverDetails.OwnerOfVehicle.first_name} {this.state.driverDetails.OwnerOfVehicle.middle_name} {this.state.driverDetails.OwnerOfVehicle.last_name}</div>
                                                        <div><i className="fas fa-phone-square margin-right-10 margin-top-5"></i>Contact Number: {this.state.driverDetails.OwnerOfVehicle.phone}</div>
                                                        <div><i className="fas fa-phone-square margin-right-10 margin-top-5"></i>Mobile Number: {this.state.driverDetails.OwnerOfVehicle.phone_alt}</div>
                                                    </div>
                                                    )}
                                                </div>
                                                <div className="col col-4">
                                                    { this.state.driverDetails.OwnerOfVehicle !== undefined && (
                                                    <div>
                                                        <div className="text-primary font-weight-bold">Owner Details</div>
                                                        <div className="margin-top-10">Name: {this.state.driverDetails.OwnerOfVehicle.DriverOwner.first_name} {this.state.driverDetails.OwnerOfVehicle.DriverOwner.middle_name} {this.state.driverDetails.OwnerOfVehicle.DriverOwner.last_name}</div>
                                                        <div><i className="fas fa-phone-square margin-right-10 margin-top-5"></i>Contact Number: {this.state.driverDetails.OwnerOfVehicle.DriverOwner.phone}</div>
                                                        <div><i className="fas fa-phone-square margin-right-10 margin-top-5"></i>Mobile Number: {this.state.driverDetails.OwnerOfVehicle.DriverOwner.phone_alt}</div>
                                                    </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <Card className="margin-top-20">
                                        <Card.Header className="text-primary font-weight-700 text-lg">Car Details</Card.Header>
                                        <Card.Body>
                                            <div className="row margin-left-5">
                                                    <div className="col col-3">
                                                    <img src="https://i.ytimg.com/vi/368gFkaiErk/hqdefault.jpg" 
                                                        alt="" height="100px"/>
                                                </div>
                                                <div className="col col-5">
                                                    { this.state.driverDetails.TypeOfVehicle !== undefined && (
                                                        <div>
                                                            <div> Model: {this.state.driverDetails.TypeOfVehicle.make} {this.state.driverDetails.TypeOfVehicle.model} {this.state.driverDetails.TypeOfVehicle.model_extended}</div>
                                                            <div> Color: {this.state.driverDetails.color}</div>
                                                            <div> Regd. No : {this.state.driverDetails.license_plate} </div>
                                                            <div> Engine Number: {this.state.driverDetails.engine_number}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col col-4">
                                                    { this.state.driverDetails.TypeOfVehicle !== undefined && (
                                                        <div>
                                                            <div> Regd. Address: { this.state.driverDetails.registration_address }</div>
                                                            <div> Regd. Authority: { this.state.driverDetails.registration_authority }</div>
                                                            <div> Regd. Authority: { this.state.driverDetails.registration_type }</div>
                                                            <div> Identification Number : { this.state.driverDetails.identification_number }</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Jumbotron>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default DriverDetails;