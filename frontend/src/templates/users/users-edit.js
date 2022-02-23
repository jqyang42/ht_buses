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
import { emailValidation } from "../components/validation";

import { LOGIN_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { GOOGLE_API_KEY } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class UsersEdit extends Component {
    state = {
        user: {},
        edited_user: {},
        redirect: false,
        valid_address: true,
        valid_email: true,
        edit_success: 0,
        error_status: false,
        error_code: 200,
    }

    // initialize page
    componentDidMount() {
        this.getUserDetails()
    }

    // api calls
    getUserDetails = () => {
        api.get(`users/detail?id=${this.props.params.id}`)
        .then(res => {
            const user = res.data.user;
            this.setState({ 
                user: user,
                edited_user: user
            });
        })
        .catch(err => {
            if (err.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: err.response.status 
                });
            }
        })
    }

    validateNewEmail = async (request) => {
        const res = await api.put(`users/edit/validate-email?id=${this.props.params.id}`, request);
        const success = res.data.success;
        this.setState({ valid_email: success });
        return success; 
    }

    editUser = (request) => {
        api.put(`users/edit?id=${this.props.params.id}`, request)
        .then(res => {
            const success = res.data.success
            console.log(success)
            this.setState({ edit_success: success ? 1 : -1 })
            if (success) {
                this.setState({
                    redirect: true 
                });
            }
        })
    }

    // render handlers
    handleFirstNameChange = (event) => {
        const first_name = event.target.value
        let user = this.state.edited_user
        user.first_name = first_name
        this.setState({ edited_user: user });
    }

    handleLastNameChange = (event) => {
        const last_name = event.target.value
        let user = this.state.edited_user
        user.last_name = last_name
        this.setState({ edited_user: user });
    }

    handleEmailChange = (event) => {
        const email = event.target.value
        let user = this.state.edited_user
        user.email = email
        this.setState({ 
            edited_user: user,
            // valid_email: true
        });
    }

    handleAddressChange = (input) => {
        const address = input.target?.value || input.formatted_address  // accept address from onChange and from autocomplete
        let user = this.state.edited_user 
        user.location.address = address
        this.setState({ edited_user: user });
    }

    handleIsStaffChange = (event) => {
        const role_value = event.target.value
        let user = this.state.edited_user
        user.is_staff = role_value === 'administrator'
        this.setState({ edited_user: user });
    }

    handleAddressValidation = () => {
        const address = this.state.edited_user.location.address
        if (address != '') {
            Geocode.fromAddress(address).then(
                (response) => {
                    let user = this.state.edited_user
                    user.location.lat = parseFloat(response.results[0].geometry.location.lat)
                    user.location.long = parseFloat(response.results[0].geometry.location.lng)
                    this.setState({
                        edited_user: user,
                        valid_address: true,
                    })
                },
                (error) => {        
                    // todo error logging for google
                    this.setState({ valid_address: false })
                }
            )
        }
    }


    checkStaffAddress = async () => {
        const address = this.state.edited_user.location.address
        const empty_address = address === "" || address == undefined
        console.log(this.state.edited_user.is_parent)
        if(!this.state.edited_user.is_parent && empty_address) {
            let user = this.state.edited_user
            user.location.lat = 0
            user.location.long = 0
            user.location.address = ""
            this.setState({
                new_user: user,
                valid_address: true,
            })
        }
        console.log(this.state.valid_address)
        return this.state.valid_address
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.checkStaffAddress()
        console.log(this.state.valid_address)
        if (!emailValidation({ email: this.state.edited_user?.email }) || !this.state.valid_address ) {
            
            return 
        }
        else {
            const request = {
                user: {
                    email: this.state.edited_user?.email
                }
            }
    
            this.validateNewEmail(request).then(success => {
                if (success) {
                    const user = {
                        user: this.state.edited_user
                    }
                    this.editUser(user)
                }
            })
        }
    }

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
                                                    {(!emailValidation({ email: this.state.edited_user?.email})) ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid email
                                                    </div>) : ""
                                                }
                                                 {(!this.state.valid_email) ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Update unsuccessful. Please enter a different email, a user with this email already exists
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className={"form-group pb-3 w-75 " + (this.state.edited_user.is_parent ? "required" : "")}>
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={this.handleAddressChange}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1" 
                                                    value={this.state.edited_user?.location?.address}
                                                    onChange={this.handleAddressChange}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)}}
                                                    required={this.state.edited_user.is_parent}/>
                                                {/* <input type="address" className="form-control pb-2" id="exampleInputAddress1" placeholder="Enter home address" defaultValue={this.state.address} onChange={this.handleAddressChange} required={this.state.user.is_parent}></input> */}
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="adminType" className="control-label pb-2">User Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="administrator" value="administrator"
                                                        checked={this.state.edited_user.is_staff} onChange={this.handleIsStaffChange} disabled={sessionStorage.getItem("is_staff") && sessionStorage.getItem("user_id") == this.props.params.id}></input>
                                                    <label className="form-check-label" for="administrator">Administrator</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="general" value="general"
                                                        checked={!this.state.edited_user.is_staff} onChange={this.handleIsStaffChange} disabled={sessionStorage.getItem("is_staff") && sessionStorage.getItem("user_id") == this.props.params.id}></input>
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