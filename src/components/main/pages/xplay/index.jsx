import React, { Component } from "react";
import Pagination from "react-js-pagination";

import {Table, Card} from 'react-bootstrap';
import { AjaxService, Routes } from "../../../../js/ajax/ajax";
import utility from "../../../../js/lib/utility";
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import Config from '../../../../config'
import XplayDataService from "../../../../js/services/xplayDataService";

class XPlayManager extends Component {

	constructor(props) {
        XplayDataService.removeXplayData();
        super(props);
        this.state = { xPlayVideos: '', totalItemsCount: '', activePage: 1 }
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_XPLAY_VIDEOS()+"?page="+this.state.activePage, function(response) {
            this.setState({ xPlayVideos: response.videos, totalItemsCount: response.count});
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_XPLAY_VIDEOS()+"?page="+pageNumber, function(response) {
            this.setState({xPlayVideos: response.videos, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }
    
    getVideoDetails(e, videoId, userId) {
        e.preventDefault(); 
        AjaxService.get(Routes.GET_XPLAY_VIDEO_BY_ID(videoId)+"?user="+userId, function(response) {
            console.log(JSON.parse(response.data));
            let videoData = JSON.parse(response.data);
            videoData.id = response.id;
            videoData.channelId = response.channel_id;
            videoData.userId = response.user_id;
            XplayDataService.saveXplayData(videoData);
            window.location.replace(Config[Config.env].url+"/xplay/video-preview");
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

	render() {
		return (
            <div className="container-fluid margin-bottom-50" id= "videos">
                { this.state.xPlayVideos.length !== 0 && (
                    <React.Fragment>
                        <div className="row margin-top-20">
                            <div className="col col-12">
                                <h4 className="margin-bottom-20">Summary of Xplay UnApproved Videos</h4>
                                <Table striped={true} bordered={true} hover={true} id="xplay-videos">
                                    <thead>
                                        <tr>
                                            <th>Video Title</th>
                                            <th>Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.xPlayVideos.map(data => (
                                            <tr key={data.id}>
                                                <td>
                                                    <a className="text-x-default cursor-pointer margin-left-15" onClick={(e) => this.getVideoDetails(e, data.id, data.user_id)} >
                                                        {data.title}
                                                    </a>
                                                </td>
                                                <td>{utility.toDateFormat(data.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col col-12 margin-top-30" >
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={10}
                                    totalItemsCount={this.state.totalItemsCount}
                                    pageRangeDisplayed={5}
                                    itemClass="page-item"
                                    linkClass="page-link"
                                    onChange={(e) => this.handlePageChange(e)}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )}
                { this.state.xPlayVideos.length === 0 && (
                    <Card className="text-center margin-top-20">
                        <Card.Body>
                            <h5 className="text-secondary">No Xplay Videos Uploaded</h5>
                        </Card.Body>
                    </Card>
                )}
            </div>
		);
	}
}

export default XPlayManager;