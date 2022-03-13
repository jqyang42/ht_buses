import React, { Component } from "react";
import { GOOGLE_API_KEY } from "../../constants";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import Autocomplete from "react-google-autocomplete";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import Geocode from "react-geocode";
import api from "../components/api";
import { emailValidation, passwordValidation, studentIDValidation } from "../components/validation";
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

import { LOGIN_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { makeSchoolsDropdown, makeRoutesDropdown, makeSchoolsMultiSelect } from "../components/dropdown";

class UsersCreate extends Component {
    state = {
        new_user: {
            email: '',
            password: '',
            first_name: '',
            phone_number: 0,
            last_name: '',
            role_id: 0,
            is_parent: false,
            location: {
                address: '',
                lat: 0.0,
                lng: 0.0
            },
            students: []
        },
        confirm_password: '',
        added_students_list: [],
        students: [],
        schools_dropdown: [],
        schools_multiselect: [],
        routes_dropdowns: [],
        redirect: false,
        valid_password: false,
        same_password: false,
        create_success: 0,
        valid_email: true,
        student_ids_changed: false,
        valid_address: true,
        create_success: 0,
        redirect_detail: false,
        detail_url: '',
        error404: false
    }

    // initialize
    componentDidMount() {
        makeSchoolsDropdown().then(ret => {
            this.setState({ schools_dropdown: ret })
        })
        makeSchoolsMultiSelect().then(ret => {
            this.setState({ schools_multiselect: ret })
        })
    }

    // api calls
    validateNewEmail = async (request) => {
        const res = await api.post(`email_exists`, request)
        const valid_email = !res.data.user_email_exists
        this.setState({ valid_email: valid_email })
        return valid_email
    }

    createUser = (request) => {
        api.post(`users/create`, request)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    create_success: 1,
                    redirect_detail: true,
                    detail_url: USERS_URL + "/" + res.data.user.id
                });
            } else {
                this.setState({ create_success: -1 })
            }
        })
    }

    // render handlers
    handleFirstNameChange = (event) => {
        const first_name = event.target.value
        let user = this.state.new_user
        user.first_name = first_name
        this.setState({ new_user: user });
    }

    handleLastNameChange = (event) => {
        const last_name = event.target.value
        let user = this.state.new_user
        user.last_name = last_name
        this.setState({ new_user: user });
    }
    
    handleEmailChange = (event) => {
        const email = event.target.value
        let user = this.state.new_user
        user.email = email
        this.setState({ new_user: user })
        this.setState({ valid_email: true })
    }

    handlePasswordChange = (event) => {
        const password = event.target.value
        let user = this.state.new_user
        user.password = password
        this.setState({
            new_user: user,
            same_password: false,
        })
    }

    handlePassword2Change = (event) => {
        const confirm_password = event.target.value
        const same_password = this.state.new_user.password === confirm_password
        const valid_password = passwordValidation({ password: this.state.new_user.password }) && same_password
        this.setState({
            confirm_password: confirm_password,
            same_password: same_password,
            valid_password: valid_password
        })
    }

    handleAddressChange = (input) => {
        const address = input.target?.value || input.formatted_address  // accept address from onChange and from autocomplete
        let user = this.state.new_user 
        user.location.address = address
        this.setState({ new_user: user });
    }

    handlePhoneChange = (event) => {
        const phone_number = event.target.value
        let user = this.state.new_user
        user.phone_number = phone_number
        this.setState({ new_user: user });
    }

    handleRoleChange = (event) => {
        const role_id = event.target.value
        let user = this.state.new_user
        user.role_id = parseInt(role_id)
        this.setState({ new_user: user });
    }

    // Called when onBlur (when user clicks out of input box) to reduce Geocoding API calls.
    handleAddressValidation = () => {
        const address = this.state.new_user.location.address
        const empty_address = address === "" || address == undefined
        if (!empty_address) {
            Geocode.fromAddress(address).then(
                (response) => {
                    let user = this.state.new_user
                    user.location.lat = parseFloat(response.results[0].geometry.location.lat)
                    user.location.lng = parseFloat(response.results[0].geometry.location.lng)
                    this.setState({
                        new_user: user,
                        valid_address: true,
                    })
                },
                (error) => {
                    // todo error logging for google
                    this.setState({ valid_address: false})
                }
            )
        }
      
    }
    
    handleStudentFirstNameChange = (event, student_num) => {
        const index = this.state.added_students_list.indexOf(student_num)
        let students = [...this.state.students]
        let student = {...students[index]}
        student.first_name = event.target.value
        students[index] = student
        this.setState({ students: students })
    }

    handleStudentLastNameChange = (event, student_num) => {
        const index = this.state.added_students_list.indexOf(student_num)
        let students = [...this.state.students]
        let student = {...students[index]}
        student.last_name = event.target.value
        students[index] = student
        this.setState({ students: students })
    }

    handleStudentIDChange = (event, student_num) => {
        const index = this.state.added_students_list.indexOf(student_num)
        let students = [...this.state.students]
        let student = {...students[index]}
        student.student_school_id = event.target.value
        students[index] = student
        this.setState({ students: students })
        this.setState({  student_ids_changed : true })
    }

    handleSchoolChange = (event, student_num) => {
        const school_id = event.target.value       
        const index = this.state.added_students_list.indexOf(student_num)        
        let students = [...this.state.students]
        let student = {...students[index]}
        student.school_id = school_id
        students[index] = student
        this.setState({ students: students })

        makeRoutesDropdown({ school_id: school_id}).then(ret => {
            let routes_dropdowns = this.state.routes_dropdowns
            routes_dropdowns[index] = ret
            this.setState({ routes_dropdowns: routes_dropdowns })
        })
    }

    handleRouteChange = (event, student_num) => {
        const route_id = event.target.value
        const index = this.state.added_students_list.indexOf(student_num)        
        let students = [...this.state.students]
        let student = {...students[index]}
        student.route_id = route_id
        students[index] = student
        this.setState({ students: students })
    }

    handleAddStudent = () => {      
        let new_list
        if (this.state.added_students_list.length === 0) {
            new_list =  [...this.state.added_students_list, 0]
        } else {
            const last_element_index = this.state.added_students_list.length - 1
            new_list = [...this.state.added_students_list, this.state.added_students_list[last_element_index] + 1]
        }
        
        let user = this.state.new_user
        user.is_parent = true
        
        const student_field = {
            first_name: '',
            last_name: '',
            school_id: '',
            route_id: null,   //TODO: replicate?
            student_school_id: '',
            in_range: false // TODO USE REAL VALUE
        }

        // update is_parent, add empty student field, individual routes
        this.setState({
            new_user: user,
            added_students_list: new_list,
            students: [...this.state.students, student_field],
            routes_dropdowns: [...this.state.routes_dropdowns, []]
        })
        this.checkNonParentAddress()
    }

    handleDeleteStudent = (student_num) => {       
        const index = this.state.added_students_list.indexOf(student_num)
        let new_list = this.state.added_students_list
        new_list.splice(index, 1)
        
        let new_students = this.state.students
        new_students.splice(index, 1)

        let new_routes_dropdowns = this.state.routes_dropdowns
        new_routes_dropdowns.splice(index, 1)

        this.setState({ 
            added_students_list: new_list,
            students: new_students,
            routes_dropdowns: new_routes_dropdowns
        })

        if (new_list.length === 0) {
            let user = this.state.new_user
            user.is_parent = false
            this.setState({ new_user: user })
        }
    }
    checkNonParentAddress = () => {
        const address = this.state.new_user.location.address
        const empty_address = address === "" || address == undefined
        if(!this.state.new_user.is_parent && empty_address) {
            let user = this.state.new_user
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
        if (!emailValidation({ email: this.state.new_user.email }) || !valid_address || !this.studentIDValidation() || this.state.new_user.role_id === 0) {
            this.setState({ create_success: -1 })
            return 
          }
        else {
            const request = {
                user: {
                    email: this.state.new_user.email
                }            
            }
    
            this.validateNewEmail(request).then(success => {
                if (success) {
                    this.sendCreateRequest()
                }
            })
          }
    }
        

    // helper functions
    sendCreateRequest = () => {
        let new_user = this.state.new_user
        new_user.students = this.state.students
        new_user.is_parent = !(this.state.added_students_list.length === 0)

        const request = {
            user: new_user            
        }

        this.createUser(request)
    }

    studentIDValidation = () => {
        if(!this.state.student_ids_changed) {
            return true
        }
        for(var i = 0; i< this.state.students.length; i++) {
            const id = this.state.students[i].student_school_id
            if (!studentIDValidation({ student_id: id })) {
                return false
            }
        }
        return true 
    }

    accordionIndex = (count) => {
        return this.state.added_students_list.indexOf(count)
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state.redirect;
        if (redirect) {
            return <Navigate to={USERS_URL}/>;
        }
        // const { redirect_detail } = this.state.redirect_detail;
        if (this.state.redirect_detail) {
            return <Navigate to={this.state.detail_url}/>;
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Manage Users" isRoot={false} isSecond={true} name="Create User" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Create New User</h5>
                                    </div>
                                </div>
                                {(this.state.create_success === -1) ? 
                                    (<div class="alert alert-danger mt-2 mb-2" role="alert">
                                        Unable to create new user. Please correct all errors before submitting.
                                    </div>) : ""
                                }
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2 w-50">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    placeholder="Enter first name" required onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    placeholder="Enter last name" required onChange={this.handleLastNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputEmail1" className="control-label pb-2">Email</label>
                                                <input type="email" className="form-control pb-2" id="exampleInputEmail1" 
                                                placeholder="Enter email" required ref={el => this.emailField = el} onChange={this.handleEmailChange}></input>
                                                <small id="emailHelp" className="form-text text-muted pb-2">We'll never share your email with anyone
                                                    else.</small>
                                                {(!emailValidation({ email: this.state.new_user.email }) && this.state.new_user.email !== "") ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid email.
                                                    </div>) : ""
                                                }
                                                {(!this.state.valid_email) ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        User creation was unsuccessful. Please enter a different email, a user with this email already exists.
                                                    </div>) : ""
                                                }
                                            </div>

                                            {/* <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPhone" className="control-label pb-2">Phone</label>
                                                <input type="tel" className="form-control pb-2" id="exampleInputPhone" 
                                                placeholder="Enter phone number" required pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" onChange={this.handlePhoneChange}></input> */}

                                                {/* TODO: add phoneValidation() method to check if phone number is valid @fern */}

                                                {/* {(!phoneValidation({ phone: this.state.new_user.phone }) && this.state.new_user.phone !== "") ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid phone number.
                                                    </div>) : ""
                                                } */}
                                            {/* </div> */}

                                            <div className="form-group required pb-3 w-75">
                                                <label for="phone_number" className="control-label pb-2">Phone</label>
                                                <input type="tel" className="form-control pb-2" id="examplePhone"
                                                    placeholder="Enter a phone number" required onChange={this.handlePhoneChange}></input>
                                            </div>

                                            <div className={"form-group pb-3 w-75 " + (this.state.new_user.is_parent ? "required" : "")}>
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={this.handleAddressChange}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    value={this.state.new_user?.location?.address}
                                                    defaultValue=""
                                                    placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1"
                                                    onChange={this.handleAddressChange}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)}}
                                                    required={this.state.new_user.is_parent} />
                                                {/* <input type="address" className="form-control pb-2" id="exampleInputAddress1" placeholder="Enter home address"
                                                onChange={this.handleAddressChange}></input> */}
                                            </div>

                                            <div onChange={this.handleRoleChange.bind(this)} className="form-group pb-3 w-75 required">
                                                <label for="roleType" className="control-label pb-2">Role</label>
                                                <select className="form-select" placeholder="Select a Role" aria-label="Select a Role" id="roleType" required
                                                onChange={(e) => this.handleRoleChange(e)}>
                                                    <option value={0} disabled selected>Select a Role</option>
                                                    <option value={4} id="4">General</option>
                                                    <option value={1} id="1">Administrator</option>
                                                    <option value={2} id="2">School Staff</option>
                                                    <option value={3} id="3">Driver</option>
                                                    {/* { {this.state.roles_dropdown.map(role => 
                                                        <option value={role.value} id={role.display}>{role.display}</option>
                                                    )} } */}
                                                </select>
                                            </div>

                                            {/* <div onChange={this.handleRoleChange.bind(this)} className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="adminType" className="control-label pb-2">User Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="general" value={4} defaultChecked={true}></input>
                                                    <label className="form-check-label" for="general">General</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="administrator" value={1}></input>
                                                    <label className="form-check-label" for="administrator">Administrator</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="school_staff" value={2} ></input>
                                                    <label className="form-check-label" for="achool_staff">School Staff</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="roleType" id="bus_driver" value={3} ></input>
                                                    <label className="form-check-label" for="bus_driver">Bus Driver</label>
                                                </div>
                                            </div> */}

                                            {/* if user role is school staff */}
                                            { this.state.new_user.role_id == 2 ?
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="managedSchools" className="control-label pb-2">Managed Schools</label>
                                                    {/* TODO: @jessica link up schools in the options field */}
                                                    <DropdownMultiselect
                                                        // options={["Australia", "Canada", "USA", "Poland", "Spain", "1", "adsfasdf asdf", "asd fadsfasdf ", "24t fgwaf", "asdf", "afdghjghmkjgahg", "adfhgsjhmej", "8", "9", "adfghsjj", "uy765re", "3456y7uijhgfe2", "fghjeretytu"]}
                                                        options={this.state.schools_multiselect}
                                                        id="managedSchools"
                                                        placeholder="Select Schools to Manage"
                                                        buttonClass="form-select border"
                                                        actionBtnStyle="ms-1 mt-1 bg-primary w-75"
                                                        selectDeselectLabel="Select / Deselect All"
                                                        // @jessica you can add an onChange method here by using "handleOnChange"
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

                                            {/*
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPassword1" className="control-label pb-2">Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword1" 
                                                placeholder="Password" required ref={el => this.password1Field = el} onChange={this.handlePasswordChange}></input>
                                                {(!passwordValidation({ password: this.state.new_user.password }) && this.state.new_user.password !== "") ? 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Your password is too weak. Password must contain at least 8 characters, including a combination of uppercase letters, lowercase letters, and numbers.
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className="form-group required pb-2 w-75">
                                                <label for="exampleInputPassword2" className="control-label pb-2">Confirm Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword2" placeholder="Password" onChange={this.handlePassword2Change} ref={el => this.password2Field = el} required></input>
                                                {(!this.state.same_password && this.state.confirm_password !== "") ? (this.state.new_user.password !== "" ? 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Password confirmation failed
                                                    </div>) : 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Please type in your new password before confirming
                                                    </div>)
                                                ) : ""
                                                }
                                            </div>
                                            */}
                                        </div>
                                        <div className="col mt-2 w-50">
                                            <div className="form-group pb-3">
                                                <label for="exampleInputStudents" className="pb-2">Students</label>
                                                <div>
                                                    <button className="btn w-auto px-0 mb-3" onClick={this.handleAddStudent}>
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                        Add a student
                                                    </button>
                                                    {this.state.added_students_list.map(count => 
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id={"heading" + count}>
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse" + count} aria-expanded="true" aria-controls={"collapseOne" + count}>
                                                                    Student {count + 1}
                                                                </button>
                                                            </h2>
                                                            <div id={"collapse" + count} className="accordion-collapse collapse show" aria-labelledby={"heading" + count} data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputFirstName" + count} className="control-label pb-2">First Name</label>
                                                                                <input type="name" className="form-control pb-2" id={"exampleInputFirstName" + count}
                                                                                value={this.state.students[this.accordionIndex(count)].first_name} placeholder="Enter first name" required onChange={(e) => this.handleStudentFirstNameChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputLastName" + count} className="control-label pb-2">Last Name</label>
                                                                                <input type="name" className="form-control pb-2" id={"exampleInputLastName" + count}
                                                                                value={this.state.students[this.accordionIndex(count)].last_name} placeholder="Enter last name" required onChange={(e) => this.handleStudentLastNameChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputID" + count} className="control-label pb-2">Student ID</label>
                                                                                <input type="id" className="form-control pb-2" id={"exampleInputID" + count} 
                                                                                value={this.state.students[this.accordionIndex(count)].student_school_id} placeholder="Enter student ID" required onChange={(e) => this.handleStudentIDChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputSchool" + count} className="control-label pb-2">School</label>
                                                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School" value={this.state.students[this.accordionIndex(count)].school_id} 
                                                                                onChange={(e) => this.handleSchoolChange(e, count)} required>
                                                                                    <option value="" disabled selected>Select a School</option>
                                                                                    {this.state.schools_dropdown.map(school => 
                                                                                        <option value={school.value} id={school.display}>{school.display}</option>
                                                                                    )}
                                                                                </select>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for={"exampleInputRoute" + count} className="control-label pb-2">Route</label>
                                                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route" value={this.state.students[this.accordionIndex(count)].route_id} 
                                                                                onChange={(e) => this.handleRouteChange(e, count)} required>
                                                                                    <option selected>Select a Route</option>
                                                                                    {this.state.routes_dropdowns[this.accordionIndex(count)].map(route => 
                                                                                        <option value={route.value} id={route.display}>{route.display}</option>
                                                                                    )}
                                                                                </select>
                                                                            </div>
                                                                            <div className="row justify-content-start mt-1 ms-0 mb-2">
                                                                                <button type="button" className="btn btn-danger w-auto justify-content-end" onClick={(e) =>this.handleDeleteStudent(count)}>Delete</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {(!this.studentIDValidation()) ? 
                                                      (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                          The Student ID value for at least one student is invalid. Please edit and try again.
                                                      </div>) : ""
                                                      }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-end mt-2 me-0">
                                        <Link to={USERS_URL} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                            <span className="btn-text">
                                                Cancel
                                            </span>
                                        </Link>
                                        <button type="submit" className="btn btn-primary w-auto justify-content-end">Create</button>
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

export default UsersCreate;