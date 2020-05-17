import React, { Component } from "react";
import Select from 'react-select';
import $ from 'jquery';

import { AjaxService, Routes } from "../../../js/ajax/ajax";

var searchTyping = null;

const selectMemberTheme = {
	control: (base, state) => ({
		...base,
	}),
	option: (base, state) => ({
		...base,
		background: state.isFocused ? '#0350a4' : '#fff',
		fontWeight: state.isFocused ? 'bold' : '',
		color: state.isFocused ? '#fff' : '#000',
		"&:hover": {
			background: state.isFocused ? '#0350a4' : '#fff',
			fontWeight: state.isFocused ? 'bold' : '',
			color: state.isFocused ? '#fff' : '#000',
			cursor: state.isFocused ? 'pointer' : 'initial',
		}
	})
};

var updateDriverList = function (list) {
	this.setState({drivers: list});
}

class DriverSearchDropDown extends Component {

    constructor() {
        super();
        this.state = {drivers: []};
		updateDriverList = updateDriverList.bind(this);
    }

    searchDriver() {
        let elementId = this.props.id;
		let searchedDriverData = $('#'+elementId).val();
		console.log(searchedDriverData);
		if (searchTyping) {
			//if a new letter comes in do not execute the previous search
			clearTimeout(searchTyping);
		}
		if (searchedDriverData.length > 3) {
			//Give 1.5 second delay before sending request to the server.
			searchTyping = setTimeout(function() {
				AjaxService.get(Routes.SearchVehicle(searchedDriverData), function (response) {
					console.log(response);
                    response = response.map(driver=> {
						return {value: driver.id, label: driver.license_plate + " ("+driver.OwnerOfVehicle.first_name + " " + driver.OwnerOfVehicle.last_name+")" };
                    });
					updateDriverList(response);
				}, function (error) {
					console.log(error);
				});
			}, 100);
		}
    }

    render() {
        return (
            <Select
                inputId={this.props.id}
                name={this.props.name}
                onInputChange={() => this.searchDriver()}
                options={this.state.drivers}
                classNamePrefix="react-select"
                styles={selectMemberTheme}
                isClearable={true}
                isSearchable={true}
            />
        );
    }
}

export default DriverSearchDropDown;