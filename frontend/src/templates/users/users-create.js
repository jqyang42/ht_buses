import React, { Component } from "react";
import { GOOGLE_API_KEY } from "../../constants";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import Autocomplete from "react-google-autocomplete";
import { emailRegex, passwordRegex } from "../regex/input-validation";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import Geocode from "react-geocode";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";


class UsersCreate extends Component {
    state = {
        user_email: '',
        user_password: '',
        user_first_name: '',
        user_last_name: '',
        user_address: '',
        user_is_staff: '',
        user_is_parent: false,
        added_students_list: [],
        students: [],
        schools_dropdown: [],
        routes_dropdown: [],
        redirect: false,
        lat: 0,
        lng: 0,
        valid_address: true,
        edit_success: 0,
        redirect_detail: false,
        detail_url: '',
        error404: false
    }

    password2 = '';
    validPassword = false;
    samePassword = false;
    create_success = 0
    validEmail = true;
    email = '';

    emailValidation = function() {
        return (emailRegex.test(this.email))
    }
    
    passwordValidation = function() {
        return (passwordRegex.test(this.state.user_password))
    }

    handleEmailChange = event => {
        this.setState( {user_email: event.target.value})
        this.email = event.target.value
        this.validEmail = true
    }

    handlePasswordChange = event => {
        this.password2 = '';
        this.password2Field.value = '';
        this.samePassword = false;
        this.setState({ user_password: event.target.value});
    }

    handlePassword2Change = event => {
        this.password2 = event.target.value;
        this.setState({ user_password: this.password1Field.value});
        this.samePassword  = this.state.user_password === this.password2
        this.validPassword = this.passwordValidation() && this.samePassword
    }

    handleFirstNameChange = event => {
        this.setState({ user_first_name: event.target.value });
    }

    handleLastNameChange = event => {
        this.setState({ user_last_name: event.target.value });
    }

    handleAddressChange = event => {
        this.setState({ user_address: event.target.value });
    }
    /* 
    Called onBlur (when user clicks out of input box) to reduce Geocoding API calls.
    */
    handleAddressValidation = event => {
        if (this.state.user_address !== '') {
            // console.log(this.state.user_address)
            Geocode.fromAddress(this.state.user_address).then(
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
    
    handleIsStaffChange = event => {
        const type = event.target.value
        this.setState({ user_is_staff: type });
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
    }

    handleSchoolChange = (event, student_num) => {
        const school_id = event.target.value
        // const school_name = event.target[event.target.selectedIndex].id
        
        const index = this.state.added_students_list.indexOf(student_num)        
        let students = [...this.state.students]
        let student = {...students[index]}
        student.school_id = school_id
        students[index] = student
        this.setState({ students: students })

        api.get(`schools/detail?id=${school_id}`)
            .then(res => {
                let routes_data
                if (res.data.routes === null) {
                    routes_data = []
                } else {
                    routes_data = res.data.routes
                }
                let routes = routes_data.map(route => {
                    return {
                        value: route.id,
                        display: route.name
                    }
                })
                this.setState({ routes_dropdown: routes })
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
        let last_element_index
        let new_list
        if (this.state.added_students_list.length === 0) {
            new_list =  [...this.state.added_students_list, 0]
        } else {
            last_element_index = this.state.added_students_list.length - 1
            new_list = [...this.state.added_students_list, this.state.added_students_list[last_element_index] + 1]
        }
        // // console.log(new_list)
        this.setState({ added_students_list: new_list })
        this.setState({ user_is_parent: true })
        // console.log(this.state.user_is_parent)
        
        const student_field = {
            first_name: '',
            last_name: '',
            school_id: '',
            route_id: null,   //TODO: replicate?
            student_school_id: ''
        }
        this.setState({ students: [...this.state.students, student_field] })
    }

    handleDeleteStudent = (student_num) => {
        // console.log(student_num)

        // // console.log(this.state.added_students_list)        
        const new_list = this.state.added_students_list
        const index = new_list.indexOf(student_num)
        // // console.log(new_list)
        // // console.log(new_list[index])
        new_list.splice(index, 1)
        // // console.log(new_list)
        this.setState({ added_students_list: new_list })
        // console.log(this.state.added_students_list.length)
        if (this.state.added_students_list.length === 0) {
            this.setState({ user_is_parent: false })
        }

        // console.log(this.state.students)
        const new_students = this.state.students
        // console.log(new_students)
        // console.log(new_students[index])
        new_students.splice(index, 1)
        // console.log(new_students)
        this.setState({ students: new_students })

        // // console.log(this.state.added_students_list)
        // // console.log(dthis.state.students)
    }

    sendCreateRequest =  () => {
        let user_address

        if (this.state.user_address === null) {
            user_address = ''
        } else {
            user_address = this.state.user_address;
        }

        const user = {
            email: this.state.user_email,
            password: this.state.user_password,
            first_name: this.state.user_first_name,
            last_name: this.state.user_last_name,
            address: user_address,
            is_staff: this.state.user_is_staff === 'general' ? false : true,
            is_parent: this.state.students.length !== 0,
            students: this.state.students,
            lat: this.state.lat,
            long: this.state.lng,
        }

        // console.log(user)
        api.post(`users/create`, user)
        .then(res => {
            // console.log(res)
            const msg = res.data.data.message
            if (msg == 'User created successfully') {
                this.setState({ edit_success: 1 })
                this.setState({ redirect_detail: true });
                this.setState({ detail_url: USERS_URL + "/" + res.data.data.id});
            } else {
                this.setState({ edit_success: -1 })
            }
        })
    }

    handleRefresh = () => {
        this.setState({});
    };


    studentIDValidation = () => {
        // console.log(this.state.students.length)
        for(var i = 0; i< this.state.students.length; i++) {
            const id = this.state.students[i].student_school_id
            const isNumber = !isNaN(id)
            if (!isNumber ) {
                return false
            }
            else if(isNumber && Math.sign(id) === -1)   {
                return false
            }
        }
        return true 
    }


    handleSubmit = event => {
        
        event.preventDefault();

        if (!this.emailValidation() || !this.validPassword || !this.state.valid_address || !this.studentIDValidation()) {
            this.setState({ edit_success: -1 })
            return 
        }

        let request_body = {
            email: this.email
        }

        api.post(`users/create/validate-email`, request_body)
        .then(res => {
            const data = res.data.data
            this.validEmail = data.validEmail
       
            if(!this.validEmail) {
                this.handleRefresh()
                return
            }   
            
            this.sendCreateRequest()

        })
    }

    componentDidMount() {
        api.get(`schools`)
            .then(res => {            
            let schools = res.data.schools.map(school => {
                return {value: school.id, display: school.name}
            })
            this.setState({ schools_dropdown: schools})
            this.setState({ edit_success: 0 })
            this.setState({ user_is_parent: false })
            // console.log(this.state.schools_dropdown)
        })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
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
                                {(this.state.edit_success === -1) ? 
                                    (<div class="alert alert-danger mt-2 mb-2" role="alert">
                                        Unable to create new user. Please correct all errors before submitting.
                                    </div>) : ""
                                }
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
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
                                                {(!this.emailValidation() && this.state.user_email !== "") ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid email.
                                                    </div>) : ""
                                                }
                                                {(!this.validEmail) ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        User creation was unsuccessful. Please enter a different email, a user with this email already exists.
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className={"form-group pb-3 w-75 " + (this.state.user_is_parent ? "required" : "")}>
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        this.setState({
                                                            user_address: place.formatted_address
                                                        })
                                                    }}
                                                    options={{
                                                        types: ['address']
                                                    }}
                                                    value={this.state.user_address}
                                                    placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1"
                                                    onChange={this.handleAddressChange}
                                                    onBlur={event => {setTimeout(this.handleAddressValidation, 500)}}
                                                    required={this.state.user_is_parent} />
                                                {/* <input type="address" className="form-control pb-2" id="exampleInputAddress1" placeholder="Enter home address"
                                                onChange={this.handleAddressChange}></input> */}
                                            </div>
                                            <div onChange={this.handleIsStaffChange.bind(this)} className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="adminType" className="control-label pb-2">User Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="administrator" value="administrator"></input>
                                                    <label className="form-check-label" for="administrator">Administrator</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="general" value="general" ></input>
                                                    <label className="form-check-label" for="general">General</label>
                                                </div>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPassword1" className="control-label pb-2">Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword1" 
                                                placeholder="Password" required ref={el => this.password1Field = el} onChange={this.handlePasswordChange}></input>
                                                {(!this.passwordValidation() && this.state.user_password !== "") ? 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Your password is too weak. Password must contain at least 8 characters, including a combination of uppercase letters, lowercase letters, and numbers.
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className="form-group required pb-2 w-75">
                                                <label for="exampleInputPassword2" className="control-label pb-2">Confirm Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword2" placeholder="Password" onChange={this.handlePassword2Change} ref={el => this.password2Field = el} required></input>
                                                {(!this.samePassword && this.password2 !== "") ? (this.state.user_password !== "" ? 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Password confirmation failed
                                                    </div>) : 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Please type in your new password before confirming
                                                    </div>)
                                                ) : ""
                                                }
                                            </div>
                                        </div>
                                        <div className="col mt-2">
                                            <div className="form-group pb-3">
                                                <label for="exampleInputStudents" className="pb-2">Students</label>
                                                {/* <button type="add student test" className="btn w-auto justify-content-end" onClick={this.handleAddStudent}>
                                                    <i className="bi bi-plus-circle me-2"></i>
                                                    Add a student
                                                </button> */}
                                                <div>
                                                    {/* <a className="btn px-0 py-1" data-bs-toggle="collapse" href="#accordionExample" role="button" aria-expanded="false" aria-controls="accordionExample">
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                    Students
                                                    </a> */}
                                                    <button type="add student test" className="btn w-auto px-0 mb-3" onClick={this.handleAddStudent}>
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
                                                                                    placeholder="Enter first name" required onChange={(e) => this.handleStudentFirstNameChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputLastName" + count} className="control-label pb-2">Last Name</label>
                                                                                <input type="name" className="form-control pb-2" id={"exampleInputLastName" + count}
                                                                                    placeholder="Enter last name" required onChange={(e) => this.handleStudentLastNameChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputID" + count} className="control-label pb-2">Student ID</label>
                                                                                <input type="id" className="form-control pb-2" id={"exampleInputID" + count} 
                                                                                placeholder="Enter student ID" required onChange={(e) => this.handleStudentIDChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputSchool" + count} className="control-label pb-2">School</label>
                                                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School" 
                                                                                onChange={(e) => this.handleSchoolChange(e, count)} required>
                                                                                    <option value="" disabled selected>Select a School</option>
                                                                                    {this.state.schools_dropdown.map(school => 
                                                                                        <option value={school.value} id={school.display}>{school.display}</option>
                                                                                    )}
                                                                                </select>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for={"exampleInputRoute" + count} className="control-label pb-2">Route</label>
                                                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route"
                                                                                onChange={(e) => this.handleRouteChange(e, count)} required>
                                                                                    <option selected>Select a Route</option>
                                                                                    {this.state.routes_dropdown.map(route => 
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