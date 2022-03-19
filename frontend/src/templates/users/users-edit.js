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
import { emailValidation, phoneValidation } from "../components/validation";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import { makeSchoolsDropdown } from "../components/dropdown";

import { LOGIN_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { GOOGLE_API_KEY } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class UsersEdit extends Component {
    state = {
        user: {},
        edited_user: {},
        schools_dropdown: [],
        redirect: false,
        valid_address: true,
        valid_email: true,
        valid_phone: 0,
        edit_success: 0,
        error_status: false,
        error_code: 200,
    }

    // initialize page
    componentDidMount() {
        this.getUserDetails()
        makeSchoolsDropdown().then(ret => {
            this.setState({ schools_dropdown: ret })
        })
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
            console.log(user)
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

    handlePhoneChange = (event) => {
        const phone_number = event.target.value
        if(!phoneValidation({ phone_number: phone_number })) {
            this.setState({ valid_phone: -1 });
        }
        else {
            let user = this.state.edited_user
            user.phone_number = phone_number.replace(/\D/g, '');
            this.setState({ new_user: user });
            this.setState({ valid_phone: 1 });
            this.setState({ edited_user: user  });
        }
    }

    handleRoleChange = (event) => {
        const role_value = event.target.value
        let user = this.state.edited_user
        console.log(role_value)
        user.role = this.role_conversion(role_value)
        user.role_id = parseInt(role_value)
        this.setState({ edited_user: user });
    }

    handleAddressValidation = () => {
        const address = this.state.edited_user.location.address
        if (address != '') {
            Geocode.fromAddress(address).then(
                (response) => {
                    let user = this.state.edited_user
                    user.location.lat = parseFloat(response.results[0].geometry.location.lat)
                    user.location.lng = parseFloat(response.results[0].geometry.location.lng)
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

    role_conversion(role_id) {
        if (role_id == 1) {
            return 'Administrator'
        }
        else if (role_id == 2) {
            return 'School Staff'
        }
        else if (role_id == 3) {
            return 'Driver'
        }
        else {
            return 'General'
        }
    }

    // @jessica check with backend
    handleManagedSchoolsChange = (selected) => {
        const selected_schools = selected.map(id => {
            return { 'id': id }
        })
        // console.log(selected)
        // console.log(selected_schools)
        let user = {...this.state.edited_user}
        // console.log(user)
        user.managed_schools = selected_schools
        this.setState({ edited_user: user })
    }

    checkNonParentAddress = () => {
        const address = this.state.edited_user.location.address
        const empty_address = address === "" || address == undefined
        if(!this.state.edited_user.is_parent && empty_address) {
            let user = this.state.edited_user
            user.location.lat = 0
            user.location.lng = 0
            user.location.address = ""
            this.setState({
                new_user: user,
                valid_address: true,
            })
        }
        return this.state.valid_address
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const valid_address = this.checkNonParentAddress()
        
        if (!emailValidation({ email: this.state.edited_user?.email }) || !valid_address ) {
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
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
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
                <div className="row flex-wrap">
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
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    defaultValue={this.state.user.first_name} placeholder="Enter first name" required
                                                    onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    defaultValue={this.state.user.last_name} placeholder="Enter last name" required
                                                    onChange={this.handleLastNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 form-col">
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
                                            { <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPhone" className="control-label pb-2">Phone</label>
                                                <input type="tel" className="form-control pb-2" id="exampleInputPhone" 
                                                placeholder="Enter phone number" required defaultValue= {this.state.edited_user.phone_number} onChange={this.handlePhoneChange}></input> 
                                            
                                                 {(!phoneValidation({ phone_number: this.state.edited_user.phone })) && this.state.valid_phone === -1 ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid North American phone number.
                                                    </div>) : ""
                                                }
                                            </div> }
                                                
                                            <div className={"form-group pb-3 form-col " + (this.state.edited_user.is_parent ? "required" : "")}>
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
                                            
                                            {/* <div onChange={this.handleRoleChange.bind(this)} className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="adminType" className="control-label pb-2">User Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="administrator" checked={this.state.edited_user.role_id === 1} disabled={ localStorage.getItem("user_id") == this.props.params.id} value={1}></input>
                                                    <label className="form-check-label" for="administrator">Administrator</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="school_staff" checked={this.state.edited_user.role_id === 2} disabled={ localStorage.getItem("user_id") == this.props.params.id} value={2} ></input>
                                                    <label className="form-check-label" for="achool_staff">School Staff</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="bus_driver" checked={this.state.edited_user.role_id === 3} disabled={ localStorage.getItem("user_id") == this.props.params.id} value={3} ></input>
                                                    <label className="form-check-label" for="bus_driver">Bus Driver</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="general" checked={this.state.edited_user.role_id === 4} disabled={ localStorage.getItem("user_id") == this.props.params.id} value={4} ></input>
                                                    <label className="form-check-label" for="general">General</label>
                                                </div>
                                            </div> */}
                
                                            <div onChange={this.handleRoleChange.bind(this)} className="form-group pb-3 form-col required">
                                                <label for="roleType" className="control-label pb-2">User Type</label>
                                                <select className="form-select" placeholder="Select a Role" aria-label="Select a Role" id="roleType"
                                                disabled={ localStorage.getItem("role") !== "Administrator" || localStorage.getItem("user_id") == this.props.params.id}
                                                onChange={(e) => this.handleRoleChange(e)} required>
                                                    <option value={0} disabled>Select a Role</option>
                                                    <option value={4} id="4" selected={this.state.edited_user.role_id === 4}>General</option>
                                                    <option value={1} id="1" selected={this.state.edited_user.role_id === 1}>Administrator</option>
                                                    <option value={2} id="2" selected={this.state.edited_user.role_id === 2}>School Staff</option>
                                                    <option value={3} id="3" selected={this.state.edited_user.role_id === 3}>Driver</option>
                                                    {/* {this.state.roles_dropdown.map(role => 
                                                        <option value={role.value} id={role.display}>{role.display}</option>
                                                    )} */}
                                                </select>
                                            </div>

                                            {/* if user role is school staff */}
                                            { this.state.edited_user.role_id === 2 ?
                                                <div className="form-group required pb-3 form-col">
                                                    <label for="managedSchools" className="control-label pb-2">Managed Schools</label>
                                                    <DropdownMultiselect
                                                        options={this.state.schools_dropdown}
                                                        optionKey="value"
                                                        optionLabel="display"
                                                        id="managedSchools"
                                                        placeholder="Select Schools to Manage"
                                                        buttonClass="form-select border"
                                                        actionBtnStyle="ms-1 mt-1 bg-primary w-75"
                                                        selectDeselectLabel="Select / Deselect All"
                                                        // selected={[]}   // array of ids of schools
                                                        // handleOnChange={(selected) => {this.handleManagedSchoolsChange(selected)}}
                                                    />
                                                    {/* @jessica for your reference */}
                                                    {/* <select className="form-select selectpicker" placeholder="Select School(s)" aria-label="Select School(s)" id="managedSchools"
                                                    onChange={(e) => this.handleManagedSchoolChange(e)} multiple="multiple" required>
                                                        <option value="" disabled selected>Select a School</option>
                                                        <option value="1">School 1</option>
                                                        <option value="2">School 2</option>
                                                        <option value="3">School 3</option>
                                                        {this.state.schools_dropdown.map(school => 
                                                            <option value={school.value} id={school.display}>{school.display}</option>
                                                        )}
                                                    </select> */}
                                                </div>
                                                 : ""                                            
                                            }
                                        </div>
                                        <div className="col mt-2 extra-col">
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