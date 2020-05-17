import React, { Component } from 'react';
import Pagination from "react-js-pagination";

import {Table, Card} from 'react-bootstrap';
import { AjaxService, Routes } from '../../../../js/ajax/ajax';
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";
import Config from '../../../../config';
import ContentDataService from '../../../../js/services/contentDataService';
import Utility from '../../../../js/lib/utility';

class ContentManager extends Component {
    constructor(props) {
        super(props);
        this.state = { contentDetails: [], totalItemsCount: '', activePage: 1  };
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_CONTENTS_TO_APPROVE()+"?page="+this.state.activePage, function(response) {
            console.log(response);
            this.setState({contentDetails: response.contents, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_CONTENTS_TO_APPROVE()+"?page="+pageNumber, function(response) {
            this.setState({contentDetails: response.contents, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    //Click the eye to get the preview of content
    openThisItem(contentId, user_id) {
        AjaxService.get(Routes.GET_CONTENT_FOR_PREVIEW(contentId, user_id), function(response) {
            let contentData = JSON.parse(response.data);
            contentData.id = response.id;
            ContentDataService.saveContentData(contentData);
            window.location.replace(Config[Config.env].url+"/content-marketing/content-preview");
        }, function(error) {
            MainNavBar__Toast('err', "Some Error! Please Try Again...");
        })
    }

    render() {
        return ( 
            <div className="container-fluid margin-bottom-50" id= "contents">
                { this.state.contentDetails.length !== 0 && (
                    <React.Fragment>
                        <div className="row margin-top-20">
                            <div className="col col-12">
                                <h4 className="margin-bottom-20">Summary of Saved Contents</h4>
                                <Table striped={true} bordered={true} hover={true} id="content-summary">
                                    <thead>
                                        <tr>
                                            <th>Content Type</th>
                                            <th>Created Title</th>
                                            <th>Created Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.contentDetails.map(contentsData => (
                                            <tr key={contentsData.id}>
                                                <td>{JSON.parse(contentsData.data).contentType}</td>
                                                <td><div className="cursor-pointer text-x-default" onClick={() => this.openThisItem(contentsData.id, contentsData.user_id)}>{JSON.parse(contentsData.data).contentTitle}</div></td>
                                                <td>{Utility.toDateFormat(contentsData.created_at)}</td>
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
                { this.state.contentDetails.length === 0 && (
                    <Card className="text-center margin-top-20">
                        <Card.Body>
                            <h5 className="text-secondary">No content for review</h5>
                        </Card.Body>
                    </Card>
                )}
            </div>
    )}
}
 
export default ContentManager;