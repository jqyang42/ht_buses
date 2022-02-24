import React, { Component } from "react";
import { Navigate } from "react-router";
import Autocomplete from "react-google-autocomplete";
import { Link, useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import Geocode from "react-geocode";
import ErrorPage from "../error-page";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { GOOGLE_API_KEY } from "../../constants";

class SchoolsEdit extends Component {
    state = {
        edited_school: {
            name: '',
            location: {
                address: '',
                lat: 0.0,
                long: 0.0
            },
            arrival: '',
            departure: '',
        },
        school: {},
        redirect: false,
        valid_address: true,
        edit_success: 0,
        error_status: false,
        error_code: 200
    }

    // initialize
    componentDidMount() {
        this.getSchoolDetails()
    }

    // api calls
    getSchoolDetails = () => {
        api.get(`schools/detail?id=${this.props.params.id}`)
        .then(res => {
            const school = res.data.school
            const edited_school = {
                name: school.name,
                location: {
                    address: school.location.address,
                    lat: school.location.lat,
                    long: school.location.long
                },
                arrival: school.arrival,
                departure: school.departure
            }
            this.setState({ 
                school: school,
                edited_school: edited_school
            });
        }).catch (error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status 
                });
            }
        })
    }

    editSchool = (request) => {
        api.put(`schools/edit?id=${this.props.params.id}`, request)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    edit_success: 1,
                    redirect: true
                })
            } else {
                this.setState({ edit_success: -1 })
            }
        })
    }
    
    // render handlers
    handleSchoolNameChange = (event) => {
        const new_name = event.target.value
        let school = this.state.edited_school
        school.name = new_name
        this.setState({ edited_school: school });
    }

    handleSchoolAddressChange = (input) => {
        const address = input.target?.value || input.formatted_address  // accept address from onChange and from autocomplete        let school = this.state.new_school
        let school = this.state.edited_school
        school.location.address = address
        this.setState({ edited_school: school })
        console.log(this.state.edited_school)
    }

    handleAddressValidation = () => {
        const address = this.state.edited_school.location.address || 
        console.log(this.state.address)
        if (address !== '') {
            Geocode.fromAddress(address).then(
                (response) => {
                    let school = this.state.edited_school
                    school.location.lat = parseFloat(response.results[0].geometry.location.lat)
                    school.location.long = parseFloat(response.results[0].geometry.location.lng)
                    this.setState({
                        edited_school: school,
                        valid_address: true
                    })
                },
                (error) => {
                    // todo error logging for google
                    this.setState({ valid_address: false})
                }
            )
        }
    }

    handleArrivalChange = (event) => {
        const arrival = event.target.value
        let school = this.state.edited_school
        school.arrival = arrival
        this.setState({ edited_school: school })
    }

    handleDepartureChange = (event) => {
        const departure = event.target.value
        let school = this.state.edited_school
        school.departure = departure
        this.setState({ edited_school: school })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if ( !this.state.valid_address ) {
            this.setState({ edit_success: -1 })
            return 
        }

        const school = {
            school: this.state.edited_school
        }

        this.editSchool(school)
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
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
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
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to edit school details. Please correct all errors before submitting.
                                        </div>) : ""
                                    }
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
                                                    onPlaceSelected={this.handleSchoolAddressChange}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    placeholder="Enter school address" className="form-control pb-2" id="exampleInputAddress1"
                                                    defaultValue={this.state.edited_school.location.address} 
                                                    onChange={this.handleSchoolAddressChange.address}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)} }/>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="default-picker" className="control-label pb-2">Arrival Time</label>
                                                <input type="time" id="default-picker" className="form-control pb-2"
                                                    placeholder="Select arrival time" defaultValue={this.state.edited_school.arrival} required
                                                    onChange={this.handleArrivalChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="default-picker-2" className="control-label pb-2">Departure Time</label>
                                                <input type="time" id="default-picker-2" className="form-control pb-2"
                                                    placeholder="Select departure time" defaultValue={this.state.edited_school.departure} required
                                                    onChange={this.handleDepartureChange}></input>
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
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