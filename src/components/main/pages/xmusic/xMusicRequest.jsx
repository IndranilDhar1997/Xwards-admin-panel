import React, { Component } from "react";
import Pagination from "react-js-pagination";

import {Table, Card} from 'react-bootstrap';
import { AjaxService, Routes } from "../../../../js/ajax/ajax";
import utility from "../../../../js/lib/utility";
import {MainNavBar__Toast} from "../../../ui/navbar/navbar";


class XPlayRequest extends Component {

	constructor(props) {
        super(props);
        this.state = { xMusicRequests: '', totalItemsCount: '', activePage: 1 }
    }

    componentDidMount() {
        AjaxService.get(Routes.GET_XMUSIC_REQUESTS()+"?page="+this.state.activePage, function(response) {
            console.log(response);
            this.setState({ xMusicRequests: response.xmusic, totalItemsCount: response.count});
        }.bind(this), function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        AjaxService.get(Routes.GET_XMUSIC_REQUESTS()+"?page="+pageNumber, function(response) {
            this.setState({xMusicRequests: response.xmusic, totalItemsCount: response.count});
        }.bind(this), function(error) {
            MainNavBar__Toast('err', 'Some error happened while fetching details');
        })
    }
    
    handleApprove = (e, requestId) => {
        e.preventDefault();
        let verify = window.prompt("Type 'APPROVE' to approve this request.");
        if (!(verify === 'APPROVE')) {
            MainNavBar__Toast('err', 'Please Type Approve...');
            return false;
        }
        let data = {
            requestId: requestId
        }
        AjaxService.post(Routes.ACCEPT_XMUSIC_REQUEST(), data, function(response) {
            console.log(response);
            window.location.reload();
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'ERR. Please Try Again...');
        })
    }

    handleDecline = (e, requestId) => {
        e.preventDefault();
        let verify = window.prompt("Type 'REJECT' to delete this request.");
        if (!(verify === 'REJECT')) {
             MainNavBar__Toast('err', 'ERR. Please Try Again...');
            return false;
        }
        AjaxService.delete(Routes.DELETE_XMUSIC_REQUEST(requestId), function(response) {
            console.log(response);
            window.location.reload();
        }, function(error) {
            console.log(error);
            MainNavBar__Toast('err', 'ERR. Please Try Again...');
        })
    }

	render() {
		return (
            <div className="container-fluid margin-bottom-50" id= "requests">
                { this.state.xMusicRequests.length !== 0 && (
                    <React.Fragment>
                        <div className="row margin-top-20">
                            <div className="col col-12">
                                <h4 className="margin-bottom-20">Summary of XMusic Requests</h4>
                                <Table striped={true} bordered={true} hover={true} id="xmusic-requests">
                                    <thead>
                                        <tr>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Created Date</th>
                                            <th>Description</th>
                                            <th>Approve</th>
                                            <th>Reject</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.xMusicRequests.map(data => (
                                            <tr key={data.id}>
                                                <td>{data.email}</td>
                                                <td>{data.phone}</td>
                                                <td>{utility.toDateFormat(data.created_at)}</td>
                                                <td>{data.description}</td>
                                                <td>
                                                    <a className="text-x-default cursor-pointer text-lg margin-left-15" onClick={(e) => this.handleApprove(e, data.id)} >
                                                        <i className="fas fa-check"></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    <a className="text-x-love cursor-pointer text-lg margin-left-15" onClick={(e) => this.handleDecline(e, data.id)} >
                                                        <i className="far fa-times-circle"></i>
                                                    </a>
                                                </td>
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
                { this.state.xMusicRequests.length === 0 && (
                    <Card className="text-center margin-top-20">
                        <Card.Body>
                            <h5 className="text-secondary">No XMusic Requests</h5>
                        </Card.Body>
                    </Card>
                )}
            </div>
		);
	}
}

export default XPlayRequest;