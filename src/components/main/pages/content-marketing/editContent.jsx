import React, { Component } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import $ from 'jquery';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Chips from 'react-chips';
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";

import utility from "../../../../js/lib/utility";
import {AjaxService, Routes} from "../../../../js/ajax/ajax";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import {SideNavBar__SetActiveMenu} from "../../../ui/navbar/navbar";
import { Prompt } from 'react-router-dom';
import Config from '../../../../config';

import ContentDataService from '../../../../js/services/contentDataService';

class CreateContent extends Component {

    constructor(props) {
        super(props);
        SideNavBar__SetActiveMenu('/content-marketing');
        
        this.state = {
            formData: {
                id: ContentDataService.getContentData().id,
                editorState: EditorState.createEmpty(),
                contentTitle: ContentDataService.getContentData().contentTitle,
                contentType: ContentDataService.getContentData().contentType,
                expiryDate: utility.toDateFormatForInput(ContentDataService.getContentData().expiryDate),
                hashtags: ContentDataService.getContentData().keywords.split(',')
            },
            files: ContentDataService.getContentData().files,
            deleteArr: []
        }
    }

    componentDidMount() {
        let blocksFromHtml = htmlToDraft(ContentDataService.getContentData().contentHtml);
        let { contentBlocks, entityMap } = blocksFromHtml;
        let contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        let localEditorState = EditorState.createWithContent(contentState);
        
        this.setState({
            formData: {
                id: this.state.formData.id,
                contentTitle: this.state.formData.contentTitle,
                contentType: this.state.formData.contentType,
                expiryDate: this.state.formData.expiryDate,
                hashtags: this.state.formData.hashtags,
                editorState: localEditorState
            }
        })
    }

    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            if (location.pathname !== '/content-marketing/create' && location.pathname !== '/content-marketing/create/images') {
                ContentDataService.removeContentData();
            }
        });
    }

    onWriting(editorState) {
        this.setState({
            formData: {
                id: this.state.formData.id,
                editorState: editorState,
                contentTitle: this.state.formData.contentTitle,
                contentType: this.state.formData.contentType,
                expiryDate: this.state.formData.expiryDate,
                hashtags: this.state.formData.hashtags,
            }
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
            formData: {
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                contentTitle: this.state.formData.contentTitle,
                contentType: this.state.formData.contentType,
                expiryDate: this.state.formData.expiryDate,
                hashtags: hashtags,
            }
        });
    }

    contentTitleChange() {
        this.setState({
            formData: {
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                contentTitle: $('#createContentForm__contentTitle').val(),
                contentType: this.state.formData.contentType,
                expiryDate: this.state.formData.expiryDate,
                hashtags: this.state.formData.hashtags,
            }
        });
    }

    contentTypeChange() {
        this.setState({
            formData: {
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                contentTitle: this.state.formData.contentTitle,
                contentType: $('#createContentForm__contentType').val(),
                expiryDate: this.state.formData.expiryDate,
                hashtags: this.state.formData.hashtags,
            }
        });
    }


    expiryDateChange() {
        this.setState({
            formData: {
                id: this.state.formData.id,
                editorState: this.state.formData.editorState,
                contentTitle: this.state.formData.contentTitle,
                contentType: this.state.contentType,
                expiryDate: $('#createContentForm__expiryDate').val(),
                hashtags: this.state.formData.hashtags,
            }
            
        });
    }

    //Saving Content As Draft
    createDataForDraft() {
        let values = utility.getFormData(($('form#createContentForm').serializeArray())); //Read entire form
        
        let editorContent = this.state.formData.editorState; //Read editor Content data
        let htmlContent = draftToHtml(convertToRaw(editorContent.getCurrentContent())); //Convert editor content data into HTML
        
        values.keywords = this.state.formData.hashtags; //Add keywords to your form
        values.contentHtml = htmlContent; //Add editor contetn HTML to your form.
        values.expiryDate = utility.dateToEpoch(values.expiryDate);
        values.files = this.state.files;
        if (!(this.state.files.length > 0)) {
            MainNavBar__Toast('err', "You cannot delete all the images. Changes are not saved please refresh");
            return false;
        }
        values.id = ContentDataService.getContentData().id;
        values.deleteArr = this.state.deleteArr;

        return values;
    }

    saveContent(e) {
        e.preventDefault();
        let verify = window.prompt("Type 'CREATE CONTENT' to make and save the changes.");
        if (!(verify === 'CREATE CONTENT')) {
            return false;
        }
        
        if (this.state.formData.contentTitle === null || this.state.formData.contentTitle === undefined) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        
        let contentTitle = this.state.formData.contentTitle.trim().replace(/\s\s+/g, ' ');
        if (contentTitle.length < 10 && contentTitle.length < 61) {
            MainNavBar__Toast('err', "Error. Title must be between 10 to 60 characters.");
            return false;
        }
        if (this.state.formData.hashtags.length < 4) {
            MainNavBar__Toast('err', "Error. You must have atleast 4 keywords.");
            return false;
        } 
        if (this.state.formData.expiryDate === '' || this.state.formData.expiryDate === undefined || this.state.formData.expiryDate === 'NaN') {
            MainNavBar__Toast('err', "Error. You must select a future date");
            return false;
        }
        this.saveAndLive(function() {
            ContentDataService.removeContentData();
            window.location.replace(Config[Config.env].url+"/content-marketing/");
        }.bind(this));
    }

    //Saving Content to Service
    saveAndLive(action) {
        let dataValues = this.createDataForDraft();
        AjaxService.post(Routes.SAVE_CONTENT_TO_LIVE(ContentDataService.getContentData().id), dataValues, function(response) {
            action();
            MainNavBar__Toast('success', "Saved your changes");
        },function(error) {
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#createContentForm__btnDraftAddContent').removeAttr('disabled');
                $('button#createContentForm__btnDraftAddContent').html('Save As Draft');
                $('button#createContentForm__btnDraftAddContent').prepend("<i class='fas fa-plus margin-right-10'></i>");
            },
            beforeSend: function () {
                $('button#createContentForm__btnDraftAddContent').html('Saving Draft...');
                $('button#createContentForm__btnDraftAddContent').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#createContentForm__btnDraftAddContent').attr('disabled', 'disabled');
            }
        })
    }

    removeThisImage(e, file) {
        e.preventDefault();
        let deleteArr = []
        let verify = window.prompt("Type 'DELETE' to delete this image.");
        if (!(verify === 'DELETE')) {
            return false;
        }
        console.log(file);
        let fileArr = this.state.files;
        fileArr = fileArr.filter(thisFile => {
            console.log(fileArr);
            console.log(thisFile);
            if (thisFile.name !== file.name) {
                return thisFile;
            } else {
                //Mark for delete
                deleteArr.push(file.imgUrl);
                console.log(deleteArr);
            }
        });
        this.setState({files: fileArr, deleteArr: deleteArr});
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container-fluid margin-top-5" id="createContentForm">
                    <div className="row">
                        <div className="col col-12 margin-bottom-10">
                            <h3>Content Marketing - Create Content</h3>
                        </div>
                        <div className="col col-12 margin-bottom-50">
                            <Form name="createContentForm" id="createContentForm">
                                <div className="row">
                                    <div className="col col-8">
                                        <Form.Group controlId="createContentForm__contentTitle">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Choose the most suitable click-baiting title for your content.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">Title</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control type="text" placeholder="Content Title" name="contentTitle" value={this.state.formData.contentTitle || ''} maxLength="60" onChange={() => this.contentTitleChange()}/>
                                            <Form.Text className="text-muted">
                                                Maximun 60 characters
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-4">
                                        <Form.Group controlId="createContentForm__contentType">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        What type of content is it?
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">Content Type</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control as="select" name="contentType" value={this.state.formData.contentType} onChange={() => this.contentTypeChange()}>
                                                <option>News</option>
                                                <option>Article</option>
                                                <option>Extras</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </div>
                                    <div className="col col-12 margin-top-20">
                                        {this.state.files.map(file => (
                                            <div className="display-inline-block position-relative" key={file.name}>
                                                <img src={file.imgUrl} className="margin-10" style={{width: (file.width/2)+"px", height: (file.height/2)+"px"}}></img>
                                                <button className="btn btn-sm btn-danger" style={{position: 'absolute', top: '-3px', right: '-3px'}} onClick={(e) => this.removeThisImage(e, file)}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col col-12">
                                        <Form.Group controlId="createContentForm__editorpane">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Design and write your content here. Good reads are always less than 100 words.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">Content Writing Place</Form.Label>
                                            </OverlayTrigger>
                                            <Editor
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
                                    <div className="col col-8">
                                        <Form.Group controlId="createContentForm__keywords">
                                            <OverlayTrigger
                                                placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        Choose perfect SEO Keywords for your content. This helps Xwards in pushing your content to the most relevant reader.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">SEO Keywords (don't use #) - Use 'Tab' to seperate</Form.Label>
                                            </OverlayTrigger>
                                            <Chips
                                                name="keywords"
                                                value={this.state.formData.hashtags}
                                                onChange={(e) => this.addHashtag(e)}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col col-4">
                                        <Form.Group controlId="createContentForm__expiryDate">
                                            <OverlayTrigger
                                                    placement="right"
                                                overlay={
                                                    <Tooltip>
                                                        The content will be removed from the system after this date.
                                                    </Tooltip>
                                                }
                                            >
                                                <Form.Label className="text-x-default cursor-pointer">Expiry Date</Form.Label>
                                            </OverlayTrigger>
                                            <Form.Control type="date" placeholder="Expiry Date" name="expiryDate" max={utility.addDays(utility.curday(), 820)} min={utility.curday()} value={this.state.formData.expiryDate} onChange={() => this.expiryDateChange()} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <Prompt message="Are you sure you want to leave this page?" />
                                <Button variant="x-dark-default" id="createContentForm__btnAddContent" onClick={(e) => this.saveContent(e)}>
                                    Push This Content To Live <i className="fas fa-chevron-right margin-left-5"></i>
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default CreateContent;