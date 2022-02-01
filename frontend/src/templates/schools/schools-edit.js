import React, { Component } from "react";
import { Navigate } from "react-router";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import Geocode from "react-geocode";

import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { GOOGLE_API_KEY } from "../../constants";

class SchoolsEdit extends Component {
    state = {
        school_name: '',
        school_address: '',
        school: [],
        redirect: false,
        lat: 0,
        lng: 0,
        valid_address: true,
    }

    edit_success = 0

    handleSchoolNameChange = event => {
        this.setState({ school_name: event.target.value });
    }

    handleSchoolAddressChange = event => {
        this.setState({ school_address: event.target.value });
    }

        handleAddressValidation = event => {
        if (this.state.school_address != '') {
            console.log(this.state.school_address)
            Geocode.fromAddress(this.state.school_address).then(
                (response) => {
                    console.log(response)
                    this.setState({
                        lat : parseFloat(response.results[0].geometry.location.lat),
                        lng : parseFloat(response.results[0].geometry.location.lng),
                        valid_address : true,
                    })
                },
                (error) => {
                    console.log(error)
                    this.setState({ valid_address: false})
                }
            )
        }
    }

    handleSubmit = event => {
        event.preventDefault();
        if ( !this.state.valid_address ) {
            console.log('address not valid')
            return 
        }

        const school = {
            school_name: this.state.school_name,
            school_address: this.state.school_address,
            lat: this.state.lat,
            long: this.state.lng,
        }

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.put(API_DOMAIN + `schools/edit?id=` + this.props.params.id, school, config)  // TODO: use onclick id value
            .then(res => {
                const msg = res.data.data.message
                if (msg == 'school information updated successfully') {
                    this.edit_success = 1     // TODO ERROR: edit_success?
                    console.log(this.edit_success)
                } else {
                    this.edit_success = -1      // TODO ERROR
                }
            })
        this.setState({ redirect: true });
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + `schools/detail?id=` + this.props.params.id, config)  // TODO: use onclick id values
        .then(res => {
            const school = res.data;
            this.setState({ school: school, school_name: school.name, school_address: school.address });
        })
    }
    
    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = SCHOOLS_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;  // TODO: use onclick id values
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="schools" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Schools" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.school.name} page="Edit School" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit School</h5>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputName1" className="control-label pb-2">Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputName1"
                                                    defaultValue={this.state.school.name} placeholder="Enter school name" required
                                                    onChange={this.handleSchoolNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        this.setState({
                                                            school_address: place.formatted_address
                                                        })
                                                    }}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    placeholder="Enter school address" className="form-control pb-2" id="exampleInputAddress1"
                                                    value={this.state.school_address} 
                                                    onChange={this.handleSchoolAddressChange}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)} }/>
                                                {/* <input type="address" className="form-control pb-2" id="exampleInputAddress1" 
                                                defaultValue={this.state.school.address} placeholder="Enter school address"
                                                onChange={this.handleSchoolAddressChange}></input> */}
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                {/* <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button> */}
                                                <Link to={"/schools/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
                                                <button type="submit" className="btn btn-primary w-auto me-0 justify-content-end">Update</button>
                                            </div>
                                        </div>
                                        <div className="col mt-2"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <SchoolsEdit
        {...props}
        params={useParams()}
    />
);