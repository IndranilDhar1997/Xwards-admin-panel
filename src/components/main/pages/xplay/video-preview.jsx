import React, { Component } from 'react';
import XplayDataService from '../../../../js/services/xplayDataService';
import RejectModal from '../../../ui/modals/reject';
import Config from '../../../../config';
import XUploadVideo from '../../../ui/utility/XUploadVideo';
import $ from 'jquery';
import {AjaxService, Routes} from '../../../../js/ajax/ajax';
import {MainNavBar__Toast} from '../../../ui/navbar/navbar';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";

class VideoPreview extends Component {

    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/xplay/videos');
        console.log(XplayDataService.getXplayData());
        this.state = {
            videoData: XplayDataService.getXplayData(),
            keywords: XplayDataService.getXplayData().keywords.split(','),
            channelId: XplayDataService.getXplayData().channelId,
            userId: XplayDataService.getXplayData().userId,
            rejectModal: false,
            video: null,
            images: []
        }
    }

    componentDidMount() {
        let VideoFile = null;
        for (let files in this.state.videoData.files.video) {
            if(this.state.videoData.files.video[files].fieldname === 'video') {
                VideoFile = this.state.videoData.files.video[files].location;
            }
        }
        let ImgArr = [];
        let availableSize = ['big', 'mid', 'thumbnail'];
        for (let i in availableSize) {
            if (availableSize[i] in this.state.videoData.files) {
                ImgArr.push(this.state.videoData.files[availableSize[i]][0])
            }
        }
        this.setState({ images: ImgArr, video: VideoFile});

        let width = $('#xVideoHolder').width();
        let calculatedHeight = (720*width)/1280;        
        this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
        $("input[type='file']#newChannelModalForm__photo").hover(function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
        }, function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
        })
    }

    editVideo(e) {
        e.preventDefault();
        window.location.replace(Config[Config.env].url+"/xplay/video-preview/edit");
    }

    rejectVideo(e) {
        e.preventDefault();
        this.setState({rejectModal: true});
    }

    rejectThis(reason) {
        if (reason == 0 ) {
            MainNavBar__Toast('err', "Error. Rejection should be valid");
            return false;
        }

        this.setState({rejectModal: false});
        let data = {
            reason: reason,
            userId: this.state.userId,
            channelId: this.state.channelId
        }
        AjaxService.post(Routes.REJECT_XPLAY_VIDEO(XplayDataService.getXplayData().id), data, function() {
            window.location.replace(Config[Config.env].url+"/xplay/videos");
            XplayDataService.removeContentData();
        },function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#videoForm__btnRejectVideo').removeAttr('disabled');
                $('button#videoForm__btnRejectVideo').html('Reject');
            },
            beforeSend: function () {
                $('button#videoForm__btnRejectVideo').html('Rejecting...');
                $('button#videoForm__btnRejectVideo').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#videoForm__btnRejectVideo').attr('disabled', 'disabled');
            }
        })
    }

    approveVideo(e) {
        e.preventDefault();
        var data = XplayDataService.getXplayData();
        let videoDetails = {
            description: data.description,
            videoTitle: data.videoTitle,
            keywords: data.keywords
        }
        console.log(videoDetails);
        AjaxService.post(Routes.SAVE_XPLAY_VIDEO_TO_LIVE(data.id), XplayDataService.getXplayData(), function(response) {
            console.log(response);
            XplayDataService.removeXplayData();
            window.location.replace(Config[Config.env].url+"/xplay/videos");
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#videoForm__btnApproveVideo').removeAttr('disabled');
                $('button#videoForm__btnApproveVideo').html('Approve');
            },
            beforeSend: function () {
                $('button#videoForm__btnApproveVideo').html('Approving...');
                $('button#videoForm__btnApproveVideo').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#videoForm__btnApproveVideo').attr('disabled', 'disabled');
            }
        })
    }


    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-bottom-50">
                    <div className="row margin-top-5">
                        <div className="col col-12 right-align">
                            {/* <button onClick={(e) => this.editVideo(e)} className="btn-sm btn btn-outline-x-default margin-right-10">Edit</button> */}
                            <button id="videoForm__btnApproveVideo" onClick={(e) => this.approveVideo(e)} className="btn btn-sm btn-success margin-right-10">Approve</button>
                            <button id="videoForm__btnRejectVideo" onClick={(e) => this.rejectVideo(e)} className="btn btn-sm btn-x-love">Reject</button>
                        </div>
                        <div className="col col-12 margin-top-0">
                            <h4 className="text-x-default">{this.state.videoData.videoTitle}</h4>
                        </div>
                        <div className="col col-8 margin-top-20">
                            {this.state.images.map(file => (
                                <img key={file.fieldname} src={file.location} className="margin-10" style={{width: '200px', height: "150px"}}></img>
                            ))}
                        </div>
                        <div className="col col-4 margin-top-20" id="xVideoHolder">
                            <XUploadVideo
                                videoSrc={this.state.video}
                                width={this.state.videoUploadWidth}
                                height={this.state.videoUploadHeight}
                                allowUpload={false}
                            /> 
                        </div>
                        <div className="col col-12 margin-top-10">
                            <div dangerouslySetInnerHTML={{  __html: `${this.state.videoData.description}` }} />
                        </div>
                        <div className="col col-8 margin-top-10 max-width-70">
                            {this.state.keywords.map(keyword => (
                                <span key={keyword} className="text-sm badge badge-pill badge-secondary margin-right-10 montserrat-light">{keyword}</span>
                            ))}
                        </div>
                    </div>
                    <RejectModal rejectModal={this.state.rejectModal} onConfirm={(reason) => this.rejectThis(reason)} />
                </div>
            </React.Fragment>
        );
    }
}
 
export default VideoPreview;