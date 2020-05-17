import React, { Component } from 'react';
import {Button, Form, Modal, OverlayTrigger, Tooltip} from 'react-bootstrap';
import Chips from 'react-chips';

import utility from '../../../js/lib/utility';
import $ from 'jquery';
import Config from '../../../config';
import { AjaxService, Routes } from '../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../navbar/navbar";
import {SideNavBar__SetActiveMenu} from "../../ui/navbar/navbar";
import XMusicDataService from '../../../js/services/xmusicDataService';

var ShowEditAudioModal = function () {
    this.setState({ show: true  });
    var data =JSON.parse(XMusicDataService.getXMusicData().data);
    var hashtags = [];
    if(typeof data.keywords == 'object') {
        hashtags = data.keywords
    } else if (typeof data.keywords == 'string') {
        hashtags= data.keywords.split(',')
    }
    this.setState({ 
        audioTitle: data.songTitle, 
        audioArtist: data.songArtist,
        audioAlbum: data.songAlbum,
        audioCompany: data.songCompany,
        hashtags: hashtags
    })
}

class XMusicEditAudio extends Component { 

    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/xmusic/audios');
        this.state = { show: false, audioId: null, hashtags: [], audioTitle: '', audioCompany: '', audioAlbum: '', audioArtist: '' };
        ShowEditAudioModal = ShowEditAudioModal.bind(this);
    }

    closeUpdateAudioModal = (event) => {
        event.preventDefault();
        this.setState({ show: false });
    }

    audioTitleChange() {
        this.setState({
            audioTitle: $('#editAudioModalForm__audioTitle').val(),
            hashtags: this.state.hashtags,
            audioAlbum: this.state.audioAlbum,
            audioArtist: this.state.audioArtist,
            audioCompany: this.state.audioCompany
        });
    }

    audioAlbumChange() {
        this.setState({
            audioTitle: this.state.audioTitle,
            hashtags: this.state.hashtags,
            audioAlbum: $('#editAudioModalForm__audioAlbum').val(),
            audioArtist: this.state.audioArtist,
            audioCompany: this.state.audioCompany
        });
    }

    audioArtistChange() {
        this.setState({
            audioTitle: this.state.audioTitle,
            hashtags: this.state.hashtags,
            audioAlbum: this.state.audioAlbum,
            audioArtist:  $('#editAudioModalForm__audioArtist').val(),
            audioCompany: this.state.audioCompany
        });
    }

    audioCompanyChange() {
        this.setState({
            audioTitle: this.state.audioTitle,
            hashtags: this.state.hashtags,
            audioAlbum: this.state.audioAlbum,
            audioArtist:  this.state.audioArtist,
            audioCompany: $('#editAudioModalForm__audioCompany').val()
        });
    }

    addHashtag(hashtags) {
        if (hashtags.length > 0 ) {
            let newElement = hashtags[hashtags.length-1];
            newElement = newElement.trim().replace(/\s\s+/g, ' ').split(' ').join('_');
            hashtags[hashtags.length-1] = newElement.trim();
        }
        //Maximum of 25 tags
        if (hashtags.length > 25) {
            return false;
        }
        /**
         * Check the last one for any special character apart from _ and if there is one then done excpet it and return false.
         */
        this.setState({
            audioTitle: this.state.audioTitle,
            hashtags: hashtags,
            audioAlbum: this.state.audioAlbum,
            audioArtist: this.state.audioArtist,
            audioCompany: this.state.audioCompany
        });
    }

    handleApproveAudio = event => {
        event.preventDefault();
        if (this.state.audioTitle === null || this.state.audioTitle === undefined) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        
        let audioTitle = this.state.audioTitle.trim().replace(/\s\s+/g, ' ');
        if (audioTitle.length < 10 && audioTitle.length < 31) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 30 characters.");
            return false;
        }
        
        if (this.state.hashtags.length < 4) {
            MainNavBar__Toast('err', "Error. You must have atleast 4 keywords or hashtags.");
            return false;
        } 

        if (this.state.audioArtist.length < 5 && this.state.audioArtist.length < 101) {
            MainNavBar__Toast('err', "Error. Artist Name must be between 5 to 100 characters.");
            return false;
        }

        if (this.state.audioCompany.length < 5 && this.state.audioCompany.length < 21) {
            MainNavBar__Toast('err', "Error. Company must be between 5 to 21 characters.");
            return false;
        }

        if (this.state.audioAlbum.length < 5 && this.state.audioAlbum.length < 21) {
            MainNavBar__Toast('err', "Error. Album must be between 5 to 21 characters.");
            return false;
        }

        let audioUpdateData = {
            songTitle: this.state.audioTitle,
			songCompany: this.state.audioCompany,
			songArtist: this.state.audioArtist,
			songAlbum: this.state.audioAlbum,
            keywords: this.state.hashtags
        }

        AjaxService.post(Routes.SAVE_XMUSIC_AUDIO_TO_LIVE(XMusicDataService.getXMusicData().id), audioUpdateData, function (response) {
            this.setState({show: false, hashtags: [], audioTitle: '', audioAlbum: '', audioArtist: '', audioCompany : '' });
            MainNavBar__Toast('success', "Audio approved successfully");
            XMusicDataService.removeXMusicData();
            window.location.replace(Config[Config.env].url+"/xmusic/audios");
        }.bind(this), function (error) {
            MainNavBar__Toast('err', "Error. "+ error.responseJSON.message);
            console.log(error);
        },
        {
            onComplete: function () {
                $('button#editAudioModalForm__btnApproveAudio').removeAttr('disabled');
                $('button#editAudioModalForm__btnCancelEditAudio').removeAttr('disabled');
                $('button#editAudioModalForm__btnUplodSong').html('Update and Approve Audio');
            },
        }, {
            beforeSend: function () {
                $('button#editAudioModalForm__btnApproveAudio').html('Approving...');
                $('button#editAudioModalForm__btnApproveAudio').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#editAudioModalForm__btnApproveAudio').attr('disabled', 'disabled');
                $('button#editAudioModalForm__btnCancelEditAudio').attr('disabled', 'disabled');
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <Modal id="editAudioModalForm__updateAudioModal" centered show={this.state.show} onHide={() => this.closeUpdateAudioModal()}>
                    <Modal.Header>
                        <div className="row">
                            <div className="col col-12">
                                <h4 className="montserrat-light">Edit Audio</h4>
                            </div>
                            <div className="col col-12">
                                <p className="text-muted">You cannot edit/update the audio file</p>
                            </div>
                        </div>
                    </Modal.Header>
                    <Modal.Body className="padding-top-0 margin-top-20">
                        <Form name="editAudioModalForm" id="editAudioModalForm" onSubmit={this.handleApproveAudio}>
                            <div className="container">
                                <div className="row">
                                    <div className="col col-12">
                                        <Form.Group controlId="editAudioModalForm__audioTitle">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Provide a suitable title to the audio
                                                    </Tooltip>
                                                }
                                            >
                                            <Form.Label className="text-x-default">Audio Title</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control name="audioTitle" size="sm" type="text" placeholder="Audio Title" maxLength="30" value={this.state.audioTitle} onChange={() => this.audioTitleChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximum 30 characters 
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12">
                                        <Form.Group controlId="editAudioModalForm__hashtags">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Choose perfect SEO Keywords for your song. This helps Xwards in pushing your song to the most relevant user.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default">SEO Keywords (don't use #) - Use 'Tab' to seperate</Form.Label>
                                            </OverlayTrigger>
                                            <Chips
                                                name="seoKeywords"
                                                value={this.state.hashtags}
                                                onChange={(e) => this.addHashtag(e)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12">
                                        <Form.Group controlId="editAudioModalForm__audioArtist">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Audio Artist
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default">Audio Artist</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control size="sm" name="audioArtist" type="text" maxLength="100" value={this.state.audioArtist} onChange={() => this.audioArtistChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximum 100 characters 
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-6">
                                        <Form.Group controlId="editAudioModalForm__audioCompany">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Audio Company
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default">Audio Company</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control size="sm" name="audioCompany" type="text" maxLength="20" value={this.state.audioCompany} onChange={() => this.audioCompanyChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximum 20 characters 
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-6">
                                        <Form.Group controlId="editAudioModalForm__audioAlbum">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Audio Album
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default">Audio Album</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control size="sm" name="audioAlbum" type="text" maxLength="20" value={this.state.audioAlbum} onChange={() => this.audioAlbumChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximum 20 characters 
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                            <Button variant="x-dark-default" type="submit" id="editAudioModalForm__btnApproveAudio" className="right margin-left-5" onClick={(e) => this.handleApproveAudio(e)} >
                                Update and Approve Audio
                            </Button>
                            <Button variant="outline-x-love" className="right margin-right-5" id="editAudioModalForm__closeModalBtn" onClick={(e) => this.closeUpdateAudioModal(e)}>
                                Close
                            </Button>
                        </Form>	
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}

export { XMusicEditAudio, ShowEditAudioModal };