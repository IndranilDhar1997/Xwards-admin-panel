import React, { Component } from "react";
import Pagination from "react-js-pagination";

import {Table, Card} from 'react-bootstrap';
import { AjaxService, Routes } from "../../../../js/ajax/ajax";
import utility from "../../../../js/lib/utility";
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import Config from '../../../../config'
import XMusicDataService from "../../../../js/services/xmusicDataService";

class XMusicManager extends Component {

	constructor(props) {
        XMusicDataService.removeXMusicData();
        super(props);
        this.state = { xMusicAudios: '', totalItemsCount: '', activePage: 1 }
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_XMUSIC_AUDIOS()+"?page="+this.state.activePage, function(response) {
            console.log(response);
            this.setState({ xMusicAudios: response.musics, totalItemsCount: response.count});
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_XMUSIC_AUDIOS()+"?page="+pageNumber, function(response) {
            this.setState({xMusicAudios: response.music, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }
    
    getAudioDetails(e, audioId, userId) {
        e.preventDefault(); 
        AjaxService.get(Routes.GET_XMUSIC_AUDIO_BY_ID(audioId)+"?user="+userId, function(response) {
            let audioData =response;
            audioData.id = response.id;
            audioData.userId = response.user_id;
            XMusicDataService.saveXMusicData(audioData);
            window.location.replace(Config[Config.env].url+"/xmusic/audio-preview");
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

	render() {
		return (
            <div className="container-fluid margin-bottom-50" id= "videos">
                { this.state.xMusicAudios.length !== 0 && (
                    <React.Fragment>
                        <div className="row margin-top-20">
                            <div className="col col-12">
                                <h4 className="margin-bottom-20">Summary of XMusic UnApproved Audios</h4>
                                <Table striped={true} bordered={true} hover={true} id="xmusic-audios">
                                    <thead>
                                        <tr>
                                            <th>Audio Title</th>
                                            <th>Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.xMusicAudios.map(data => (
                                            <tr key={data.id}>
                                                <td>
                                                    <a className="text-x-default cursor-pointer margin-left-15" onClick={(e) => this.getAudioDetails(e, data.id, data.user_id)} >
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
                { this.state.xMusicAudios.length === 0 && (
                    <Card className="text-center margin-top-20">
                        <Card.Body>
                            <h5 className="text-secondary">No XMusic Audios Uploaded</h5>
                        </Card.Body>
                    </Card>
                )}
            </div>
		);
	}
}

export default XMusicManager;