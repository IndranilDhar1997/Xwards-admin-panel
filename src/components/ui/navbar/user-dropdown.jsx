/**
 * Developed by Veer Shrivastav
 * Date: 24th May 2019
 * 
 * Purpose: All the user related routes and functions are written here.
 */
//Utility functions

import React, { Component } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { AjaxService, Routes } from "../../../js/ajax/ajax";
import Config from "../../../config";

class UserDropDown extends Component {
    
    constructor() {
        super();
        var user = JSON.parse(localStorage.getItem('user'));
        this.state = { name : user.name };
    }

    logout() {
        AjaxService.get(Routes.Logout(), function(response) {
            console.log(response);
            window.location.replace(Config[Config.env].url);
            localStorage.clear();
        }, function(error) {
            console.error(error);
            window.location.replace(Config[Config.env].url);
            localStorage.clear();
        })
    }

    render () {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="x-transparent" id="user-dropdown" bsPrefix="btn-sm btn-link text-x-default">
                <i className="fas fa-user-alt"></i> { this.state.name } <i className="margin-left-5 fas fa-caret-down"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight={true}>
                    <Dropdown.Item href="/profile" bsPrefix="dropdown-item"><i className="far fa-id-card margin-right-10"></i> Personal Info</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item bsPrefix="dropdown-item" onClick={this.logout}><i className="fas fa-power-off margin-right-10"></i> Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default UserDropDown;