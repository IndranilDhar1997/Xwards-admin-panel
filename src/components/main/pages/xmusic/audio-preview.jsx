import React, { Component } from 'react';
import XMusicDataService from '../../../../js/services/xmusicDataService';
import RejectModal from '../../../ui/modals/reject';
import Config from '../../../../config';
import $ from 'jquery';
import {AjaxService, Routes} from '../../../../js/ajax/ajax';
import {MainNavBar__Toast} from '../../../ui/navbar/navbar';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";
import ReactAudioPlayer from 'react-audio-player';
import {XMusicEditAudio, ShowEditAudioModal } from '../../../ui/xmusic/xmusic-edit-audio';

class AudioPreview extends Component {

    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/xmusic/audios');
        var audioDetails = JSON.parse(XMusicDataService.getXMusicData().data);
        var hashtags = [];
        if(typeof audioDetails.keywords == 'object') {
            hashtags = audioDetails.keywords
        } else if ( typeof audioDetails.keywords == 'string') {
            hashtags = audioDetails.keywords.split(',')
        }
        this.state = {
            audioDetails: audioDetails,
            hashtags: hashtags,
            userId: XMusicDataService.getXMusicData().userId,
            rejectModal: false,
            audio: XMusicDataService.getXMusicData().url,
        }
    }

    rejectAudio(e) {
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
        }
        AjaxService.post(Routes.REJECT_XMUSIC_AUDIO(XMusicDataService.getXMusicData().id), data, function() {
            window.location.replace(Config[Config.env].url+"/xmusic/audios");
            XMusicDataService.removeXMusicData();
        },function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#audioForm__btnRejectAudio').removeAttr('disabled');
                $('button#audioForm__btnRejectAudio').html('Reject');
            },
            beforeSend: function () {
                $('button#audioForm__btnRejectAudio').html('Rejecting...');
                $('button#audioForm__btnRejectAudio').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#audioForm__btnRejectAudio').attr('disabled', 'disabled');
            }
        })
    }

    approveAudio(e) {
        e.preventDefault();
        let data = {
            songTitle: this.state.audioDetails.songTitle,
            songAlbum: this.state.audioDetails.songAlbum,
            songArtist: this.state.audioDetails.songArtist,
            songCompany: this.state.audioDetails.songCompany,
            keywords: this.state.hashtags
        }

        console.log(data);
        AjaxService.post(Routes.SAVE_XMUSIC_AUDIO_TO_LIVE(XMusicDataService.getXMusicData().id), data, function(response) {
            console.log(response);
            XMusicDataService.removeXMusicData();
            window.location.replace(Config[Config.env].url+"/xmusic/audios");
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#audioForm__btnApproveAudio').removeAttr('disabled');
                $('button#audioForm__btnApproveAudio').html('Approve');
            },
            beforeSend: function () {
                $('button#audioForm__btnApproveAudio').html('Approving...');
                $('button#audioForm__btnApproveAudio').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#audioForm__btnApproveAudio').attr('disabled', 'disabled');
            }
        })
    }


    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-bottom-50">
                    <div className="row margin-top-5">
                        <div className="col col-12 right-align">
                            <button onClick={()=> ShowEditAudioModal()} className="btn-sm btn btn-outline-x-default margin-right-10">Edit</button>
                            <button id="audioForm__btnApproveAudio" onClick={(e) => this.approveAudio(e)} className="btn btn-sm btn-success margin-right-10">Approve</button>
                            <button id="audioForm__btnRejectAudio" onClick={(e) => this.rejectAudio(e)} className="btn btn-sm btn-x-love">Reject</button>
                        </div>
                        <div className="col col-12 margin-top-0">
                            <h4 className="text-x-default">{ this.state.audioDetails.songTitle }</h4>
                        </div>
                        <div className="col col-12 margin-top-30">
                            <ReactAudioPlayer
                                src={this.state.audio}
                                controls
                                title={ this.state.audioDetails.songTitle }
                                style={{ width: "100%"}}
                            />
                        </div>
                        <div className="col col-12 margin-top-15 margin-left-5">
                            <strong>Artists :  </strong>  { this.state.audioDetails.songArtist } 
                        </div>
                        <div className="col col-12 margin-top-15 margin-left-5">
                            <strong>Audio Company :  </strong>  { this.state.audioDetails.songCompany }
                        </div>
                        <div className="col col-12 margin-top-15 margin-left-5">
                            <strong>Audio Album :  </strong>  { this.state.audioDetails.songAlbum }
                        </div>
                        <div className="col col-12 margin-top-15 margin-left-5 max-width-100">
                            <strong> SEO Tags: </strong>{this.state.hashtags.map(hashtag => (
                                <span key={hashtag} className="text-sm badge badge-pill badge-secondary margin-right-10 montserrat-light"> {hashtag} </span>
                            ))}
                        </div>
                    </div>
                    <RejectModal rejectModal={this.state.rejectModal} onConfirm={(reason) => this.rejectThis(reason)} />
                </div>
                <XMusicEditAudio />
            </React.Fragment>
        );
    }
}
 
export default AudioPreview;