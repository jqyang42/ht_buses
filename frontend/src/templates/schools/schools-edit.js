import React, { Component } from "react";
import { Navigate } from "react-router";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';

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
    }

    handleSchoolNameChange = event => {
        this.setState({ school_name: event.target.value });
    }

    handleSchoolAddressChange = event => {
        this.setState({ school_address: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        const school = {
            school_name: this.state.school_name,
            school_address: this.state.school_address,
        }

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.put(API_DOMAIN + `schools/edit?id=` + this.props.params.id, school, config)  // TODO: use onclick id value
            .then(res => {
                console.log(res);
                console.log(res.data);
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
        this.setState({ school: school });
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
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2">
                                    <div className="row d-flex align-middle">
                                        <div className="w-auto px-2 ps-3">
                                            <a href={SCHOOLS_URL}><h5>Schools</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <a href={"/schools/" + this.props.params.id}><h5>{this.state.school.name}</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>Edit School</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                    <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
                                </div>
                            </div>
                        </div>
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
                                                {/* <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        this.setState({
                                                            school_address: place.formatted_address
                                                        })
                                                    }}
                                                    options={{
                                                        types: 'address'
                                                    }}
                                                    placeholder="Enter school address" className="form-control pb-2" id="exampleInputAddress1"
                                                    value={this.state.school_address} 
                                                    onChange={this.handleSchoolAddressChange} /> */}
                                                <input type="address" className="form-control pb-2" id="exampleInputAddress1" 
                                                defaultValue={this.state.school.address} placeholder="Enter school address"
                                                onChange={this.handleSchoolAddressChange}></input>
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