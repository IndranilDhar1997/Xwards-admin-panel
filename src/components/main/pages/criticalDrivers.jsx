import React, { Component } from 'react';
import { MainNavBar, SideNavBar } from "../../ui/navbar/navbar";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import Utility from "../../../js/lib/utility";
import Form from "react-bootstrap/Form";

var criticalDriverDetails = function (criticalDriverDetails) {
    this.setState({criticalDriverDetails: criticalDriverDetails});
}

function searchingFor(term) {
    return function(x) {
        return ((x.OwnerOfVehicle.first_name) + " " + (x.OwnerOfVehicle.last_name)).toLowerCase().includes(term.toLowerCase()) || !term;
    }
}

class CriticalDrivers extends Component {
    
    constructor(props) {
        super(props);
        this.state = {criticalDriverDetails: [], term: ''};
        criticalDriverDetails = criticalDriverDetails.bind(this);
        this.toggleSortDate = this.toggleSortDate.bind(this);
        this.searchHandler = this.searchHandler.bind(this);

        AjaxService.get(Routes.Get_Critical_Drivers(), function(response) {
            console.log(response);
            criticalDriverDetails(response);
        }, function(error) {
            console.log(error);
        })
    }

    searchHandler(event) {
        this.setState({ term: event.target.value })
    }

    toggleSortDate (event) {
        const { criticalDriverDetails } = this.state;
        let newCriticalDriverDetails = criticalDriverDetails.reverse();
        this.setState( {
            criticalDriverDetails: newCriticalDriverDetails.sort((a,b) => a.VehicleDevice.Device_DeviceConnection.last_socket_connection_at > b.VehicleDevice.Device_DeviceConnection.last_socket_connection_at)
        })
    }
    
    render() {
        const { criticalDriverDetails,term } = this.state;
        return ( 
            <React.Fragment>
                <MainNavBar />
				<div className="container-fluid">
					<div className="row">
						<div className="col col-md-4 col-lg-3 col-xl-2 d-none d-md-block padding-left-0 padding-right-0 dashboard-menuholder">
							<SideNavBar />
						</div>
						<div className="col margin-top-50 padding-top-10">
                            <div className="row margin-top-10 margin-left-30">
                                <div className="col col-8">
                                    <Form>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Control type="text" placeholder="Enter Driver Name" 
                                                onChange={this.searchHandler} value= { term }/>
                                            <Form.Text className="text-muted margin-left-5">
                                               Search for Critical Drivers with first and last name...
                                            </Form.Text>
                                        </Form.Group>
                                    </Form>
                                </div>
                                <div className = "col col-4">
                                    <Button variant="light" block onClick={this.toggleSortDate}> Sort By Time </Button>
                                </div>
                            </div>
                            { this.state.criticalDriverDetails !== undefined && (
                                <div className="margin-top-20 margin-left-30">
                                    { criticalDriverDetails.filter(searchingFor(term)).map(data => ( 
                                        <Accordion key={data.id}>
                                            <Card>
                                                <Card.Header>
                                                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                        <div className="text-primary font-weight-bold"> Driver Name: &nbsp; &nbsp; {data.OwnerOfVehicle.first_name} {data.OwnerOfVehicle.middle_name} {data.OwnerOfVehicle.last_name}</div>
                                                    </Accordion.Toggle>
                                                </Card.Header>
                                                <Accordion.Collapse eventKey="0">
                                                    <Card.Body>
                                                        <div className="row margin-left-10">
                                                            <div className="col col-4 margin-bottom-10">
                                                                Car Number: {data.license_plate}
                                                            </div>
                                                            <div className="col col-8 text-danger margin-bottom-10">
                                                                Last Active Connection :  { Utility.toDateFormat(data.VehicleDevice.Device_DeviceConnection.last_socket_connection_at) }
                                                            </div>
                                                            <div className="col col-4 margin-bottom-10">
                                                                Driver Name: { data.OwnerOfVehicle.first_name } {data.OwnerOfVehicle.middle_name} {data.OwnerOfVehicle.last_name}
                                                            </div>
                                                            <div className="col col-4 margin-bottom-10">
                                                                Driver Contact I: { data.OwnerOfVehicle.phone } 
                                                            </div>
                                                            <div className="col col-4 margin-bottom-10">
                                                                Driver Contact II: { data.OwnerOfVehicle.phone_alt } 
                                                            </div>
                                                            <div className="col col-4 margin-bottom-10">
                                                                Owner Name: { data.OwnerOfVehicle.DriverOwner.first_name } {data.OwnerOfVehicle.DriverOwner.middle_name} {data.OwnerOfVehicle.DriverOwner.last_name}
                                                            </div>
                                                            <div className="col col-4 margin-bottom-10">
                                                                Owner Contact I: { data.OwnerOfVehicle.DriverOwner.phone } 
                                                            </div>
                                                            <div className="col col-4 margin-bottom-10">
                                                                Owner Contact II: { data.OwnerOfVehicle.DriverOwner.phone_alt } 
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Accordion.Collapse>
                                            </Card>
                                        </Accordion>
                                    ))}
                                </div>
                            )}
                        </div>
					</div>
				</div>
            </React.Fragment>
        );
    }
}
 
export default CriticalDrivers;
