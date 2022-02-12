import React, { Component } from "react";
import { Link} from "react-router-dom";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import Geocode from "react-geocode";
import ErrorPage from "../error-page";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { GOOGLE_API_KEY } from "../../constants";
import { emailRegex } from "../regex/input-validation";
import { PARENT_DASHBOARD_URL } from "../../constants";

class UsersEdit extends Component {
    state = {
        email: '',
        first_name: '',
        last_name: '',
        address: '',
        role_value: null,
        user: {},
        redirect: false,
        lat: 0,
        lng: 0,
        valid_address: true,
        edit_success: 0,
        is_parent: false,
        error_status: false,
        error_code: 200
    }

    validEmail = true;
    email = '';

    // initialize page
    componentDidMount() {
        this.getUserDetails()
    }

    // api calls
    getUserDetails = () => {
        api.get(`users/detail?id=${this.props.params.id}`)
        .then(res => {
            const user = res.data.user;
            console.log(user)

            this.email = user.email

            let role
            if (user.is_staff) {
                role = 'administrator'
            } else {
                role = 'general'
            }
            this.setState({ 
                user: user,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                address: user.location.address,
                role_value: role,
                edit_success: 0,
                is_parent: user.is_parent
                });
            })
        .catch ( err => {
            // console.log(error.response)
            if (err.response.status !== 200) {
                // console.log(error.response.data)
                this.setState({ error_status: true });
                this.setState({ error_code: err.response.status });
            }
        })
    }

    // render handlers

    emailValidation = function() {
        return (emailRegex.test(this.email))
        // return (emailRegex.test(this.state.email))
    }

    handleEmailChange = event => {
        this.setState( { email: event.target.value })
        this.email = event.target.value
        this.validEmail = true
    }

    handleFirstNameChange = event => {
        this.setState({ first_name: event.target.value });
    }

    handleLastNameChange = event => {
        this.setState({ last_name: event.target.value });
    }

    handleAddressChange = event => {
        this.setState({ address: event.target.value });
        // console.log(this.state.address)
    }

    handleIsStaffChange = event => {
        let role_value = event.target.value
        this.setState({ role_value });
        this.setState({ is_staff: role_value === 'administrator' })
    }

    handleAddressValidation = event => {
        if (this.state.address != '') {
            // console.log(this.state.address)
            Geocode.fromAddress(this.state.address).then(
                (response) => {
                    // console.log(response)
                    this.setState({
                        lat : parseFloat(response.results[0].geometry.location.lat),
                        lng : parseFloat(response.results[0].geometry.location.lng),
                        valid_address : true,
                    })
                },
                (error) => {
                    // console.log(error)
                    this.setState({ valid_address: false})
                }
            )
        }
    }

    sendEditRequest = () => {
        const request = {
            user: {
                email: this.state.email,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                location: {
                    address: this.state.address,
                    lat: this.state.lat,
                    long: this.state.lng
                },
                is_staff: this.state.role_value === 'administrator',
                is_parent: this.state.user.is_parent,
            }
        }

        console.log(request)

        api.put(`users/edit?id=${this.props.params.id}`, request)
        .then(res => {
            const success = res.data.success
            if ( success ) {
                this.setState({ edit_success: 1 })
                // console.log(this.state.edit_success)
                this.setState({ redirect: true });
            }
        })
        this.validEmail = true 
        // this.setState({ redirect: true });
    }

    handleSubmit = event => {
        event.preventDefault();
        this.email = this.emailField.value
        // console.log(this.email)


        if (!this.emailValidation() || !this.state.valid_address ) {
            this.setState({ edit_success: -1 })
            return 
        }

        const request_body = {
            user: {
                email: this.state.email
            }
        }
              
        api.put(`users/edit/validate-email?id=${this.props.params.id}`, request_body)
        .then(res => {
            const data = res.data
            this.validEmail = data.success
       
            if(!this.validEmail) {
                this.handleRefresh()
                return
            }     
           this.sendEditRequest()
        })
        
    }

    handleRefresh = () => {
        this.setState({});
    };

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = USERS_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
        }
        if (this.state.error_status) {
            return <ErrorPage />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Manage Users" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.user.first_name + " " + this.state.user.last_name} page="Edit User" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit User</h5>
                                    </div>
                                </div>
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to edit user details. Please correct all errors before submitting.
                                        </div>) : ""
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    defaultValue={this.state.user.first_name} placeholder="Enter first name" required
                                                    onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    defaultValue={this.state.user.last_name} placeholder="Enter last name" required
                                                    onChange={this.handleLastNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputEmail1" className="control-label pb-2">Email</label>
                                                <input type="email" className="form-control pb-2" id="exampleInputEmail1" 
                                                defaultValue={this.state.user.email} placeholder="Enter email" required
                                                onChange={this.handleEmailChange} ref={el => this.emailField = el}></input>
                                                <small id="emailHelp" className="form-text text-muted pb-2">We'll never share your email with anyone
                                                    else.</small>
                                                    {(!this.emailValidation()) ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid email
                                                    </div>) : ""
                                                }
                                                 {(!this.validEmail) ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Update unsuccessful. Please enter a different email, a user with this email already exists
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className={"form-group pb-3 w-75 " + (this.state.is_parent ? "required" : "")}>
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        this.setState({
                                                            address: place.formatted_address
                                                        })
                                                    }}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1" 
                                                    value={this.state.address}
                                                    onChange={this.handleAddressChange}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)}}
                                                    required={this.state.is_parent}/>
                                                {/* <input type="address" className="form-control pb-2" id="exampleInputAddress1" placeholder="Enter home address" defaultValue={this.state.address} onChange={this.handleAddressChange} required={this.state.user.is_parent}></input> */}
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="adminType" className="control-label pb-2">User Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="administrator" value="administrator"
                                                    checked={this.state.is_staff} onChange={this.handleIsStaffChange}></input>
                                                    <label className="form-check-label" for="administrator">Administrator</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="general" value="general"
                                                    checked={!this.state.is_staff} onChange={this.handleIsStaffChange}></input>
                                                    <label className="form-check-label" for="general">General</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col mt-2">
                                        </div>
                                    </div>
                                    <div className="row justify-content-end mt-2 me-0">
                                        {/* <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button> */}
                                        <Link to={"/users/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                            <span className="btn-text">
                                                Cancel
                                            </span>
                                        </Link>
                                        <button type="submit" className="btn btn-primary w-auto justify-content-end">Update</button>
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
    <UsersEdit
        {...props}
        params={useParams()}
    />
);