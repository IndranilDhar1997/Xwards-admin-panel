import React, { Component } from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { MainNavBar, SideNavBar } from "../../ui/navbar/navbar";
import $ from 'jquery';
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup'
import Button from "react-bootstrap/Button"

import utility from '../../../js/lib/utility';
import DriverSearchDropDown from "../../ui/track-drivers/driver-search-drop-down";
import coords from "../../../sample-data/coords-data";

const redMarker = L.icon({
	iconUrl: 'https://svgsilh.com/svg/602136.svg',
	iconSize: [40, 40],
	iconAnchor: [20, 40],
});

class TrackDrivers extends Component {

	constructor(props) {
		super(props);
		this.state = {
			center: [ -37.8869090667, 175.3657417333],
			zoom : 8,
			maxZoom: 20,
			coordsData: coords
		}
	}
	searchDriver() {
		let data = utility.getFormData(($('form#searchDriver').serializeArray()));
		var driverId = data.memberSearch;
		window.location.href = "/track-drivers/" + driverId;
	}


	render() {
		return (
			<React.Fragment>
				<MainNavBar />
				<div className="container-fluid pl-0">
					<div className="row">
						<div className="col col-md-4 col-lg-3 col-xl-2 d-none d-md-block padding-left-0 padding-right-0 dashboard-menuholder">
							<SideNavBar />
						</div>
						<div className="col width-100 margin-top-50 padding-top-10">
							<div className="row margin-top-10">
								<div className="col col-12">
									<div className="row">
										<div className="col col-6">
											<Card className="width-100 ml-3">
												<Card.Body className="driver_online">
													<div className="row">
														<div className="col col-4">
															<i className="fa fa-car fa-3x" aria-hidden="true"></i>
														</div>
														<div className="col col-8">
															<Card.Text className="driver_counter">
																120
															</Card.Text>
															<div className="text-right">
																Online Drivers
															</div>
														</div>
													</div>
												</Card.Body>
											</Card>
										</div>
										<div className="col col-6">
											<Card className="width-100">
												<Card.Body className="driver_offline">
													<div className="row">
														<div className="col col-4">
															<i className="fa fa-car fa-3x" aria-hidden="true"></i>
														</div>
														<div className="col col-8">
															<Card.Text className="driver_counter">
																40
															</Card.Text>
															<div className="text-right">
																Offline Drivers
															</div>
														</div>
													</div>
												</Card.Body>
											</Card>
										</div>
									</div>
								</div>
								<div className="col col-12 mt-4 ml-3">
									<Form.Text className="margin-left-5 font-weight-bold text-md mb-2">
										Search by Car Number for driver...
									</Form.Text>
									<Form className="" name="searchDriver" id="searchDriver">
										<div className="row">
											<div className="col col-10 width-100">
												<Form.Group controlId="searchDriver__memberSearch">
													<DriverSearchDropDown id="memberSearch" name="memberSearch" />
												</Form.Group>
											</div>
											<div className="col col-2">
												<Button variant="x-dark-default" className="width-100" id="searchDriver__btnSearchDriver" onClick={() => this.searchDriver()}>
													Search
												</Button>
											</div>
										</div>
									</Form>
								</div>
							</div>
							<div className="margin-top-20 ml-3">
								<h6 className="text-primary text-md font-weight-bold margin-left-5 margin-bottom-10">Cab Location</h6>
								{/* <Map center={position} zoom={this.state.zoom} minZoom={9}  maxZoom={18}
									attributionControl={false}
									doubleClickZoom={false}>
									<HeatmapLayer
										fitBoundsOnLoad
										fitBoundsOnUpdate
										maxNativeZoom
										points={this.state.addressPoints}
										longitudeExtractor={m => m[1]}
										latitudeExtractor={m => m[0]}
										intensityExtractor={m => parseFloat(m[2])} />
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution="&copy; Xwards. OpenStreetMaps"
									/>
								</Map> */}
								<Map 
									className="markercluster-map" 
									center={this.state.center} 
									zoom={this.state.zoom} 
									maxZoom={this.state.maxZoom}
								>
									<TileLayer
										url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
										attribution="&copy; Xwards. OpenStreetMaps"
									/>
									<MarkerClusterGroup>
										{ this.state.coordsData.map( data=> (
											<div key={data.long}>
												<Marker position={[data.lat, data.long]} icon={redMarker}/>
											</div>
										)) }
									</MarkerClusterGroup>

								</Map>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default TrackDrivers;