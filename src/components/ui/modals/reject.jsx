/**
 * Developed by Veer Shrivastav
 * Date: 25th May 2019
 * 
 * Purpose: When you click add brand anywhere then this modal pops up.
 */
import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
// import $ from 'jquery';
// import utility from '../../../js/lib/utility';
import {MainNavBar__Toast} from '../../ui/navbar/navbar';

class RejectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { show: false, confirmReject: '', rejectReason: '' }
    }

    hideModal() {
        this.setState({ show: false, confirmReject: '', rejectReason: '' });
    }

    componentWillReceiveProps(nextprops) {
        if ("rejectModal" in nextprops) {
            this.setState({show: nextprops.rejectModal});
        }
    }

    onConfirm(e) {
        e.preventDefault();
        if (!(this.state.confirmReject === 'REJECT')) {
            MainNavBar__Toast('err', "You must type REJECT");
            return false;
        }
        this.props.onConfirm(this.state.rejectReason);
    }

    changeReject(e) {
        this.setState({confirmReject: e.target.value});
    }
    changeReason(e) {
        this.setState({rejectReason: e.target.value});
    }

    render() {
        return (
            <Modal show={this.state.show} id="rejectionModal" className="x-modal" centered={true} onHide={() => this.hideModal()}>
                <ModalHeader closeButton={true}>
                    <h4 className="montserrat-light">Type 'REJECT' to confirm.</h4>
                </ModalHeader>
                <Modal.Body className="">
                    <Form name="rejectionForm" id="rejectionForm">
                        <Form.Group controlId="rejectionForm__rejectConfirm">
                            <Form.Control type="text" placeholder="type 'REJECT'" name="rejectConfirm" value={this.state.confirmReject} onChange={(e) => this.changeReject(e)} />
                        </Form.Group>
                        <Form.Group controlId="rejectionForm__rejectReason">
                            <Form.Label className="padding-left-5">Please give a reson to reject.</Form.Label>
                            <Form.Control type="text" placeholder="I am rejecting this because..." name="rejectReason" value={this.state.rejectReason} onChange={(e) => this.changeReason(e)}/>
                        </Form.Group>
                        <Button variant="x-dark-default" className="right margin-left-5" id="rejectionForm__btnRejectConfirm" onClick={(e) => this.onConfirm(e)}>
                            <i className="fas fa-plus margin-right-10"></i>Add
                        </Button>
                        <Button variant="outline-x-love" className="right margin-right-5" onClick={() => this.hideModal()}>
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default RejectModal;