import React, { Component } from 'react';
import XplayDataService from '../../../../js/services/xplayDataService';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Chips from 'react-chips';
import XUploadVideo from '../../../ui/utility/XUploadVideo';
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import Config from '../../../../config'

class EditVideo extends Component {
    
    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/xplay/videos');
        this.state = {
            formData: {
                id: XplayDataService.getXplayData().id,
                editorState: EditorState.createEmpty(),
                videoTitle: XplayDataService.getXplayData().videoTitle,
                keywords: XplayDataService.getXplayData().keywords.split(','),
                video: null,
                videoData: XplayDataService.getXplayData(),
                images: [],
                
            },
            deleteArr: []
        }
    }

    componentDidMount() {
       
        let VideoFile = null;
        for (let files in this.state.formData.videoData.files.video) {
            if(this.state.formData.videoData.files.video[files].fieldname === 'video') {
                VideoFile = this.state.formData.videoData.files.video[files].location;
            }
        }
        let ImgArr = [];
        let availableSize = ['large', 'big', 'full', 'mid'];
        for (let i in availableSize) {
            if (availableSize[i] in this.state.formData.videoData.files) {
                ImgArr.push(this.state.formData.videoData.files[availableSize[i]][0])
            }
        }
        let width = $('#xVideoHolder').width();
        let calculatedHeight = (720*width)/1280;        
        this.setState({videoUploadWidth: width+'px', videoUploadHeight: calculatedHeight+'px'});
        $("input[type='file']#newChannelModalForm__photo").hover(function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.85');
        }, function() {
            $("div#xPlay__btnUploadCoverPhoto").css('opacity', '0.1');
        })
        let blocksFromHtml = htmlToDraft(XplayDataService.getXplayData().description);
        let { contentBlocks, entityMap } = blocksFromHtml;
        let contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        let localEditorState = EditorState.createWithContent(contentState);
        this.setState({
            formData: {
                id: this.state.formData.id,
                videoTitle: this.state.formData.videoTitle,
                keywords: this.state.formData.keywords,
                editorState: localEditorState,
                videoTitle: this.state.formData.videoTitle,
                images: ImgArr, 
                video: VideoFile,
                videoData: this.state.formData.videoData
            },
            deleteArr: []
        })
    }

    onWriting(editorState) {
        this.setState({
            formData: {
                editorState: editorState,
                id: this.state.formData.id,
                editorState: editorState,
                videoTitle: this.state.formData.videoTitle,
                keywords: this.state.formData.keywords,
                video: this.state.formData.video,
                images: this.state.formData.images,
                videoData: this.state.formData.videoData
            }
        });
    }

    addHashtag(keywords) {
        if (keywords.length > 0 ) {
            let newElement = keywords[keywords.length-1];
            newElement = newElement.trim().replace(/\s\s+/g, ' ').split(' ').join('_');
            keywords[keywords.length-1] = newElement.trim();
        }
        if (keywords.length > 25) {
            return false;
        }
        this.setState({
            formData: {
                keywords: keywords,
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                videoTitle: this.state.formData.videoTitle,
                keywords: keywords,
                video: this.state.formData.video,
                images: this.state.formData.images,
                videoData: this.state.formData.videoData
            }
        });
    }

    videoTitleChange() {
        this.setState({
            formData: {
                videoTitle: $('#editVideoForm__videoTitle').val(),
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                keywords: this.state.formData.keywords,
                video: this.state.formData.video,
                images: this.state.formData.images,
                videoData: this.state.formData.videoData
            }
        });
    }


    removeThisImage(e, file) {
        e.preventDefault();
        let deleteArr = []
        let verify = window.prompt("Type 'DELETE' to delete this image.");
        if (!(verify === 'DELETE')) {
            return false;
        }
        let fileArr = this.state.formData.images;
        fileArr = fileArr.filter(thisFile => {
            if (thisFile.fieldname !== file.fieldname) {
                return thisFile;
            } else {
                //Mark for delete
                deleteArr.push(file.location);
                console.log(deleteArr);
            }
        });
        this.setState({
            formData: {
                images: fileArr,
                videoTitle: $('#editVideoForm__videoTitle').val(),
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                keywords: this.state.formData.keywords,
                video: this.state.formData.video,
                videoData: this.state.formData.videoData
            },
            deleteArr: deleteArr
        });
    }
    
    goBack = e => {
        e.preventDefault();
        window.location.replace(Config[Config.env].url+"/xplay/video-preview");
    }

    pushVideoLive(e) {
        e.preventDefault();
        if (this.state.formData.videoTitle === null || this.state.formData.videoTitle === undefined) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }

        let videoTitle = this.state.formData.videoTitle.trim().replace(/\s\s+/g, ' ');
        if (videoTitle.length < 10 && videoTitle.length < 61) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }

        if (this.state.formData.keywords.length < 4) {
            MainNavBar__Toast('err', "Error. You must have atleast 4 keywords.");
            return false;
        } 

        let verify = window.prompt("Type 'CREATE VIDEO' to make and save the changes.");
        if (!(verify === 'CREATE VIDEO')) {
            return false;
        }
        let editorContent = this.state.formData.editorState; //Read editor Content data
        let htmlContent = draftToHtml(convertToRaw(editorContent.getCurrentContent())); //Convert editor content data into HTML
        let contentHtml = htmlContent; //Add editor contetn HTML to your form.

        let videoDetails = {
            description: contentHtml,
            deleteArr: this.state.deleteArr,
            videoTitle: this.state.formData.videoTitle,
            keywords: this.state.formData.keywords,
            files: this.state.formData.images
        }
        console.log(videoDetails);
        // AjaxService.post(Routes.SAVE_XPLAY_VIDEO_TO_LIVE(this.state.formData.id),videoDetails, function(response) {
        //     console.log(response);
        //     XplayDataService.removeContentData();
        //     window.location.replace(Config[Config.env].url+"/xplay/videos");

        // }, function(error) {
        //     console.log(error);
        //     MainNavBar__Toast('err', "Some Error! Please Try Again...");
        // }, {
        //     onComplete: function () {
        //         $('button#editVideoForm__btnPushVideoLive').removeAttr('disabled');
        //         $('button#editVideoForm__btnPushVideoLive').html('Push This Video To Live');
        //         $('button#editVideoForm__btnPushVideoLive').prepend("<i class='fas fa-plus margin-right-10'></i>");
        //     },
        // }, {
        //     beforeSend: function () {
        //         $('button#editVideoForm__btnPushVideoLive').html('Sending To Live...');
        //         $('button#editVideoForm__btnPushVideoLive').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
        //         $('button#editVideoForm__btnPushVideoLive').attr('disabled', 'disabled');
        //     }
        // })
        
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-top-5" id="editVideoForm">
                    <div className="row">
                        <div className="col col-12 margin-bottom-10">
                            <h3>Xplay Management - Approve Video</h3>
                        </div>
                        <div className="col col-12 margin-bottom-50">
                            <Form name="editVideoForm" id="editVideoForm">
                                <div className="row">
                                    <div className="col col-12">
                                        <Form.Group controlId="editVideoForm__videoTitle">
                                            <Form.Label className="text-x-default cursor-pointer">Title</Form.Label>
                                            <Form.Control type="text" placeholder="Video Title" name="videoTitle" value={this.state.formData.videoTitle || ''} maxLength="60" onChange={() => this.videoTitleChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximun 60 characters
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12">
                                        <Form.Group controlId="editVideoForm__editorpane">
                                            <Form.Label className="text-x-default cursor-pointer">Description Writing Place</Form.Label>
                                            <Editor
                                                toolbarHidden
                                                editorState={this.state.formData.editorState}
                                                toolbarClassName="x-toolbar"
                                                wrapperClassName="editor-wrapper"
                                                editorClassName="editing-preview-area"
                                                onEditorStateChange={(e) => this.onWriting(e)}
                                                editorStyle={{minHeight: '300px'}}
                                                value={this.state.editorState}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12">
                                        <Form.Group controlId="editVideoForm__keywords">
                                            <Form.Label className="text-x-default cursor-pointer">SEO Keywords (don't use #) - Use 'Tab' to seperate</Form.Label>
                                            <Chips
                                                name="keywords"
                                                value={this.state.formData.keywords}
                                                onChange={(e) => this.addHashtag(e)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col col-8 margin-top-20">
                                        {this.state.formData.images.map(file => (
                                            <div className="display-inline-block position-relative"  key={file.fieldname}>
                                                 <img key={file.fieldname} src={file.location} className="margin-10" style={{width: '200px', height: "150px"}}></img>
                                                 <button className="btn btn-sm btn-danger" style={{position: 'absolute', top: '-3px', right: '-3px'}} onClick={(e) => this.removeThisImage(e, file)}><i className="fas fa-trash-alt"></i></button>
                                            </div>                                           
                                        ))}
                                    </div>
                                    <div className="col col-4 margin-top-20" id="xVideoHolder">
                                        <XUploadVideo
                                            videoSrc={this.state.formData.video}
                                            width={this.state.videoUploadWidth}
                                            height={this.state.videoUploadHeight}
                                            allowUpload={false}
                                        /> 
                                    </div>
                                </div>
                                <button type="button" className="btn-sm btn btn-outline-x-love margin-right-10" onClick={(e) => this.goBack(e)}>
                                    <i className="fas fa-chevron-left"></i> Back
                                </button>
                                <button type="button" className="btn btn-sm btn-x-default" id="editVideoForm__btnPushVideoLive" onClick={(e) => this.pushVideoLive(e)}>
                                    Push This Video To Live <i className="fas fa-chevron-right margin-left-5"></i>
                                </button>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
 
export default EditVideo;