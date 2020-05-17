import React, { Component } from "react";
import Config from "../../../config";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import ContentManagement from "./content-marketing/index";
import ContentView from "./content-marketing/view";
import EditContent from "./content-marketing/editContent";

//Xplay 
import XplayRequests from './xplay/xPlayRequest';
import XplayManagement from './xplay/index';
import XplayVideoPreview from './xplay/video-preview';
import XplayVideoEdit from './xplay/edit-video';

//XMUSIC
import XmusicRequests from './xmusic/xMusicRequest';
import XmusicManagement from './xmusic/index';
import XmusicAudioPreview from './xmusic/audio-preview';
// import MainNavbar from "../../navbar/mainNavbar";
import { MainNavBar, SideNavBar } from "../../ui/navbar/navbar";


class Dashboard extends Component {

	constructor(props) {
		super(props);
		if (localStorage.getItem('token') == null) {
			window.location.replace(Config[Config.env].url);
		}
	}

	render() {
		return (
			<React.Fragment>
				<BrowserRouter>
				<MainNavBar />
					<div className="container-fluid">
						<div className="row">
							<div className="col col-md-4 col-lg-3 col-xl-2 d-none d-md-block padding-left-0 padding-right-0 dashboard-menuholder">
								<SideNavBar />
							</div>
							<div className="col col-md-8 col-lg-9 col-xl-10 main-body-holder">
								<Switch>
									<Route exact path="/content-marketing" component={ContentManagement} />
									<Route exact path="/content-marketing/content-preview" component={ContentView} />
									<Route exact path="/content-marketing/content-preview/edit" component={EditContent} />
									<Route exact path="/xplay/requests" component ={XplayRequests} />
									<Route exact path="/xplay/videos" component= {XplayManagement} />
									<Route exact path="/xplay/video-preview" component= {XplayVideoPreview} />
									<Route exact path="/xplay/video-preview/edit" component = {XplayVideoEdit} />
									<Route exact path="/xmusic/requests" component ={XmusicRequests} />
									<Route exact path="/xmusic/audios" component= {XmusicManagement} />
									<Route exact path="/xmusic/audio-preview" component = {XmusicAudioPreview} />
								</Switch>  
							</div>
						</div>
					</div>
				</BrowserRouter>
			</React.Fragment>
		);
	}
}

export default Dashboard;
