import axios from "axios";
import React, { Component } from "react";
import { HT_LOGO, GOOGLE_API_KEY } from "../../constants";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import Autocomplete from "react-google-autocomplete";
import { emailRegex, passwordRegex } from "../regex/input-validation";

import { INDEX_URL } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";


class UsersCreate extends Component {
    state = {
        user_email: '',
        user_password: '',
        user_first_name: '',
        user_last_name: '',
        user_address: '',
        user_is_staff: '',
        added_students_list: [],
        students: [],
        schools_dropdown: [],
        routes_dropdown: [],
        redirect: false,
    }

    password2 = '';
    validEmail = false;
    validPassword = false;
    samePassword = false;

    emailValidation = function() {
        return (emailRegex.test(this.emailField.value))
    }
    
    passwordValidation = function() {
        return (passwordRegex.test(this.state.user_password))
    }

    handleEmailChange = event => {
        this.setState( {user_email: event.target.value})
        this.validEmail = this.emailValidation() 
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
        student.first_name = event.target.value
        students[index] = student
        this.setState({ students: students })
    }

    handleStudentIDChange = (event, student_num) => {
        const index = this.state.added_students_list.indexOf(student_num)
        let students = [...this.state.students]
        let student = {...students[index]}
        student.first_name = event.target.value
        students[index] = student
        this.setState({ students: students })
    }

    handleSchoolChange = (event, student_num) => {
        const school_id = event.target.value
        const school_name = event.target[event.target.selectedIndex].id
        
        const index = this.state.added_students_list.indexOf(student_num)        
        let students = [...this.state.students]
        let student = {...students[index]}
        student.school_name = school_name
        students[index] = student
        this.setState({ students: students })

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + 'schools/detail?id=' + school_id, config)
            .then(res => {
                let routes_data
                if (res.data.routes == null) {
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
        const route_name = event.target[event.target.selectedIndex].id

        const index = this.state.added_students_list.indexOf(student_num)        
        let students = [...this.state.students]
        let student = {...students[index]}
        student.route_name = route_name
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
        // console.log(new_list)
        this.setState({ added_students_list: new_list })
        
        const student_field = {
            first_name: '',
            last_name: '',
            school_name: '',
            route_name: null,   //TODO: replicate?
            student_school_id: ''
        }
        this.setState({ students: [...this.state.students, student_field] })
    }

    handleDeleteStudent = (student_num) => {
        console.log(student_num)

        // console.log(this.state.added_students_list)        
        const new_list = this.state.added_students_list
        const index = new_list.indexOf(student_num)
        // console.log(new_list)
        // console.log(new_list[index])
        new_list.splice(index, 1)
        // console.log(new_list)
        this.setState({ added_students_list: new_list })

        console.log(this.state.students)
        const new_students = this.state.students
        console.log(new_students)
        console.log(new_students[index])
        new_students.splice(index, 1)
        console.log(new_students)
        this.setState({ students: new_students })

        // console.log(this.state.added_students_list)
        // console.log(dthis.state.students)
    }

    handleSubmit = event => {
        if (!this.validEmail || !this.validPassword) {
            return 
        }
        event.preventDefault();
        
        let user_address
        if (this.state.user_address === null) {
            user_address = ''
        } else {
            user_address = this.state.user_address
        }

        let school_id
        if (this.state.student_id === '') {
            school_id = null
        } else {
            school_id = this.state.student_id
        }

        const user = {
            email: this.state.user_email,
            password: this.state.user_password,
            first_name: this.state.user_first_name,
            last_name: this.state.user_last_name,
            address: user_address,
            is_staff: this.state.user_is_staff === 'general' ? false : true,
            is_parent: this.state.students.length !== 0,
            students: this.state.students
        }

        console.log(user)


         const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.post(API_DOMAIN + `users/create`, user, config) // TODO, config as 3rd parameter

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
        axios.get(API_DOMAIN + `schools`,  config)
            .then(res => {            
            let schools = res.data.schools.map(school => {
                return {value: school.id, display: school.name}
            })
            this.setState({ schools_dropdown: schools})
            console.log(this.state.schools_dropdown)
        })
    }

    handleLogout = event => {
        event.preventDefault();
        const creds = {
            user_id: sessionStorage.getItem('user_id')
        }
        axios.post(API_DOMAIN + `logout`, creds)
        .then(res => {
            this.setState({token: '', message: res.data.message})
            sessionStorage.setItem('token', '')
            sessionStorage.setItem('user_id', '')
            sessionStorage.setItem('first_name', '')
            sessionStorage.setItem('last_name', '')
            sessionStorage.setItem('is_staff', false)
            sessionStorage.setItem('logged_in', false)
            console.log(sessionStorage.getItem('logged_in'))
            console.log(sessionStorage.getItem('token'))
            window.location.reload()
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
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                            <a href={INDEX_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                            </a>

                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                <li className="nav-item">
                                    <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-list-ul me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Students</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-building me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Schools</span>
                                    </a>
                                </li>
                                <li className="nav-item active">
                                    <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-people me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="w-100 px-auto pb-1 d-flex justify-content-around">
                                <button className="btn btn-primary w-75 mb-4 mx-auto" role="button" onClick={this.handleLogout}>
                                    Log Out
                                </button> 
                            </div>
                        </div>
                    </div>

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2">
                                    <div className="row d-flex align-middle">
                                        <div className="w-auto px-2 ps-3">
                                            <a href={USERS_URL}><h5>Manage Users</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>Create User</h5>
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
                                        <h5>Create New User</h5>
                                    </div>
                                </div>
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
                                                {(!this.validEmail && this.state.user_email !== "") ? 
                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                        Please enter a valid email
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className="form-group pb-3 w-75">
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                {/* Uses autocomplete API, only uncomment when needed to */}
                                                {/* <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        this.setState({
                                                            user_address: place.formatted_address
                                                        })
                                                    }}
                                                    options={{
                                                        types: 'address'
                                                    }}
                                                    value={this.state.user_address}
                                                    placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1" 
                                                    onChange={this.handleAddressChange} /> */}
                                                <input type="address" className="form-control pb-2" id="exampleInputAddress1" placeholder="Enter home address"
                                                onChange={this.handleAddressChange}></input>
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
                                                                            <div className="form-group pb-3">
                                                                                <label for={"exampleInputID" + count} className="control-label pb-2">Student ID</label>
                                                                                <input type="id" className="form-control pb-2" id={"exampleInputID" + count} 
                                                                                placeholder="Enter student ID" onChange={(e) => this.handleStudentIDChange(e, count)}></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for={"exampleInputSchool" + count} className="control-label pb-2">School</label>
                                                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School" 
                                                                                onChange={(e) => this.handleSchoolChange(e, count)} required>
                                                                                    <option selected>Select a School</option>
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