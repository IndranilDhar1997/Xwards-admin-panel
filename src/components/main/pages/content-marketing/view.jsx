import React, { Component } from 'react';
import ContentDataService from '../../../../js/services/contentDataService';
import utility from '../../../../js/lib/utility';
import Config from '../../../../config';
import $ from 'jquery';
import {AjaxService, Routes} from '../../../../js/ajax/ajax';
import {MainNavBar__Toast} from '../../../ui/navbar/navbar';
import RejectModal from '../../../ui/modals/reject'

class ViewContents extends Component {

   constructor(props) {
        super(props);
        this.state = {
            draftData: ContentDataService.getContentData(),
            html: ContentDataService.getContentData().contentHtml,
            keywords: ContentDataService.getContentData().keywords.split(','),
            rejectModal: false
        }
    }

    editContent(e) {
        e.preventDefault();
        window.location.replace(Config[Config.env].url+"/content-marketing/content-preview/edit");
    }
    
    approveContent(e) {
        e.preventDefault();
        AjaxService.post(Routes.SAVE_CONTENT_TO_LIVE(ContentDataService.getContentData().id), ContentDataService.getContentData(), function(response) {
            window.location.replace(Config[Config.env].url+"/content-marketing/");
            MainNavBar__Toast('success', "Saved your changes");
        },function(error) {
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#contentForm__btnApproveContent').removeAttr('disabled');
                $('button#contentForm__btnApproveContent').html('Approve');
            },
            beforeSend: function () {
                $('button#contentForm__btnApproveContent').html('Approving...');
                $('button#contentForm__btnApproveContent').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#contentForm__btnApproveContent').attr('disabled', 'disabled');
            }
        })
    }
    rejectContent(e) {
        e.preventDefault();
        this.setState({rejectModal: true});
    }

    rejectThis(reason) {
        let data = {reason: reason}
        AjaxService.post(Routes.REJECT_CONTENT(ContentDataService.getContentData().id), data, function() {
            window.location.replace(Config[Config.env].url+"/content-marketing/");
            MainNavBar__Toast('success', "Content has been rejected");
        },function(error) {
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        }, {
            onComplete: function () {
                $('button#contentForm__btnRejectContent').removeAttr('disabled');
                $('button#contentForm__btnRejectContent').html('Reject');
            },
            beforeSend: function () {
                $('button#contentForm__btnRejectContent').html('Rejecting...');
                $('button#contentForm__btnRejectContent').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#contentForm__btnRejectContent').attr('disabled', 'disabled');
            }
        })
    }
    
    render() {
        return ( 
            <div className="container-fluid margin-bottom-50">
                <div className="row margin-top-5">
                    <div className="col col-12 right-align">
                        <button onClick={(e) => this.editContent(e)} className="btn-sm btn btn-outline-x-default margin-right-10">Edit</button>
                        <button id="contentForm__btnApproveContent" onClick={(e) => this.approveContent(e)} className="btn btn-sm btn-success margin-right-10">Approve</button>
                        <button id="contentForm__btnRejectContent" onClick={(e) => this.rejectContent(e)} className="btn btn-sm btn-x-love">Reject</button>
                    </div>
                    <div className="col col-12">
                        <h2 className="text-x-default">{this.state.draftData.contentTitle}</h2>
                    </div>
                    <div className="col col-12 margin-top-20">
                        {ContentDataService.getContentData().files.map(file => (
                            <img key={file.name} src={file.imgUrl} className="margin-10" style={{width: (file.width/2)+"px", height: (file.height/2)+"px"}}></img>
                        ))}
                    </div>
                    <div className="col col-12 margin-top-10">
                        <div dangerouslySetInnerHTML={{  __html: `${this.state.html}` }} />
                    </div>
                    <div className="col col-8 margin-top-10 max-width-70">
                        {this.state.keywords.map(keyword => (
                            <span key={keyword} className="text-sm badge badge-pill badge-secondary margin-right-10 montserrat-light">{keyword}</span>
                        ))}
                    </div>
                    <div className="col col-4 margin-top-10">
                        <div className="text-x-default">Expiry Date of this content is: <strong>{utility.toDateFormat(this.state.draftData.expiryDate)}</strong></div>
                    </div>
                    <div className="col col-12 right-align">
                        <button onClick={(e) => this.editContent(e)} className="btn-sm btn btn-outline-x-default margin-right-10">Edit</button>
                        <button id="contentForm__btnApproveContent" onClick={(e) => this.approveContent(e)} className="btn btn-sm btn-success margin-right-10">Approve</button>
                        <button id="contentForm__btnRejectContent" onClick={(e) => this.rejectContent(e)} className="btn btn-sm btn-x-love">Reject</button>
                    </div>
                </div>
                <RejectModal rejectModal={this.state.rejectModal} onConfirm={(reason) => this.rejectThis(reason)} />
            </div>
        );
    }
}
 
export default ViewContents;