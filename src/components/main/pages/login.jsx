import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import $ from 'jquery';
import {AjaxService, Routes} from "../../../js/ajax/ajax";
import utility from "../../../js/lib/utility";
import Config from "../../../config";


class Login extends Component {

    constructor(props) {
        super(props);
        if (localStorage.getItem('token') != null) {
			window.location.replace(Config[Config.env].url + "/dashboard");
		}
    }

    adminLogin() {
        let loginData = utility.getFormData(($('form#adminLoginForm').serializeArray()));
        console.log(loginData);
        let data = {
            email:loginData.email,
            password: loginData.password
        }
        AjaxService.post(Routes.Login(), data, function(response) {
            console.log(response);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response));
            window.open(Config[Config.env].url + "/dashboard");
            window.close(Config[Config.env].url);
        }, function(error) {
            console.log(error);
            $('#adminLoginForm #error-message').html(error.responseJSON.message);
        }, {
            onComplete: function () {
                $('button#adminLoginForm__btnLogin').removeAttr('disabled');
                $('button#adminLoginForm__btnLogin').html('Login');
                $('button#adminLoginForm__btnLogin').prepend("<i class='fas fa-plus margin-right-10'></i>");
            }, 
            beforeSend: function () {
                $('button#adminLoginForm__btnLogin').html('Login...');
                $('button#adminLoginForm__btnLogin').prepend("<span class='spinner-grow spinner-grow-sm' role='status' aria-hidden='true'></span>")
                $('button#adminLoginForm__btnLogin').attr('disabled', 'disabled');
            }
        })
    }

    render() { 
        return ( 
            <div className='container-fluid'>
                <div className="d-flex bd-highlight justify-content-center login-form-position">
                    <Form className="margin-30 width-70" name="adminLoginForm" id="adminLoginForm">
                        <div className="margin-bottom-20 text-center text-lg font-weight-700 text-primary">Admin Login</div>
                        <Form.Group controlId="adminLoginForm__email">
                            <Form.Label className="margin-left-5">Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name="email" />
                        </Form.Group>
                        <Form.Group controlId="adminLoginForm__password">
                            <Form.Label className="margin-left-5">Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter Password" name="password"/>
                        </Form.Group>
                        <div className="text-x-love font-weight-500 margin-bottom-10" id="error-message"></div>
                        <Button variant="x-dark-default" className="right margin-left-5" id="adminLoginForm__btnLogin" onClick={() => this.adminLogin()}>
                            Login<i className="fas fa-sign-in-alt margin-left-5"></i>
                        </Button>
                    </Form>
                </div>
            </div>
         );
    }
}
 
export default Login;