import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
import { GOOGLE_API_KEY } from "../../constants";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { validTime } from "../components/time";

class SchoolsCreate extends Component {
    state = {
        new_school: {
            name: '',
            arrival: '',    // TODO LINK TO FRONTEND FORM
            departure: '',  // TODO LINK TO FRONTEND FORM
            location: {
                address: '',
                lat: 0,
                lng: 0,
            }
        },
        redirect: false,
        valid_address: true,
        edit_success: 0,
        redirect_detail: false,
        detail_url: '',
        valid_time: 0
    }

    // api calls
    createSchool = (request) => {
        api.post(`schools/create`, request)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    edit_success: 1,
                    redirect_detail: true,
                    detail_url: SCHOOLS_URL + "/" + res.data.school.id 
                })
            } else {
                this.setState({ edit_success: -1 })
            }
        })
    }
    
    // render handlers
    handleSchoolNameChange = (event) => {
        const school_name = event.target.value
        let school = this.state.new_school
        school.name = school_name
        this.setState({ new_school: school });
    }

    handleSchoolAddressChange = (input) => {
        const address = input.target?.value || input.formatted_address  // accept address from onChange and from autocomplete        let school = this.state.new_school
        let school = this.state.new_school
        school.location.address = address
        this.setState({ new_school: school });
    }

    handleAddressValidation = () => {
        const address = this.state.new_school.location.address
        if (address !== '') {
            Geocode.fromAddress(address).then(
                (response) => {
                    let school = this.state.new_school
                    school.location.lat = parseFloat(response.results[0].geometry.location.lat)
                    school.location.lng = parseFloat(response.results[0].geometry.location.lng)
                    this.setState({
                        new_school: school,
                        valid_address: true
                    })
                },
                (error) => {
                    // todo error logging for google
                    this.setState({ valid_address: false})
                }
            )
        }
        else {
        this.setState({ valid_address: false})
        }
    }

    handleArrivalChange = (event) => {
        const arrival = event.target.value
        let school = this.state.new_school
        school.arrival = arrival
        this.setState({ new_school: school })
        const valid_time = validTime(this.state.new_school.departure, this.state.new_school.arrival ) 
        this.setState({ valid_time: valid_time}) 
       
    }

    handleDepartureChange = (event) => {
        const departure = event.target.value
        let school = this.state.new_school
        school.departure = departure
        this.setState({ new_school: school })
        const valid_time = validTime(this.state.new_school.departure, this.state.new_school.arrival ) 
        this.setState({ valid_time: valid_time}) 
       
    }


    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.state.valid_address || this.state.valid_time ===-1 ) {
            this.setState({ edit_success: -1 })
            return 
        }
        else {
        const school = {
            school: this.state.new_school
        }

        this.createSchool(school)
        }
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={SCHOOLS_URL}/>;
        }
        if (this.state.redirect_detail) {
            return <Navigate to={this.state.detail_url}/>;
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="schools" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Schools" isRoot={false} isSecond={true} name="Create School" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Create New School</h5>
                                    </div>
                                </div>
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to create new school. Please correct all errors before submitting.
                                        </div>) : ""
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label className="control-label pb-2">Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputName1"
                                                    placeholder="Enter school name" required
                                                    onChange={this.handleSchoolNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={this.handleSchoolAddressChange}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    placeholder="Enter school address" className="form-control pb-2" id="exampleInputAddress1"
                                                    value={this.state.new_school.location.address} 
                                                    onChange={this.handleSchoolAddressChange}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)} }
                                                    required={true}/>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="default-picker" className="control-label pb-2">Arrival Time</label>
                                                <input type="time" id="default-picker" className="form-control pb-2"
                                                    placeholder="Select arrival time" required
                                                    onChange={this.handleArrivalChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="default-picker-2" className="control-label pb-2">Departure Time</label>
                                                <input type="time" id="default-picker-2" className="form-control pb-2"
                                                    placeholder="Select departure time" required
                                                    onChange={this.handleDepartureChange}></input>
                                                {this.state.valid_time === -1 ?
                                                ( <div class="alert alert-danger mt-2 mb-0" role="alert">
                                                    Please enter valid times. Departure time must be at least one hour after arrival time.
                                                </div>) : ""
                                                }
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                <Link to={SCHOOLS_URL} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
                                                <button type="submit" className="btn btn-primary w-auto me-0 justify-content-end">Create</button>
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

export default SchoolsCreate;