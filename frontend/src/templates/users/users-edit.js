import axios from "axios";
import React, { Component } from "react";
import { HT_LOGO } from "../../constants";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";

import { INDEX_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { USERS_DETAIL_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { GOOGLE_API_KEY } from "../../constants";

class UsersEdit extends Component {
    state = {
        email: '',
        first_name: '',
        last_name: '',
        address: '',
        is_staff: '',
        // student_first_name: '',
        // student_last_name: '',
        // student_id: '',
        // school: '',
        // route: ''
        user: [],
        // schools: [],
        // routes: []
        // students: [],
        orig_first: '',
        orig_last: ''
    }

    handleEmailChange = event => {
        this.setState( { email: event.target.value })
    }

    handlePasswordChange = event => {
        this.setState({ password: event.target.value });
    }

    handleFirstNameChange = event => {
        this.setState({ first_name: event.target.value });
    }

    handleLastNameChange = event => {
        this.setState({ last_name: event.target.value });
    }

    handleAddressChange = event => {
        this.setState({ address: event.target.value });
    }

    handleIsStaffChange = event => {
        this.setState({ is_staff: event.target.value });
    }

    // handleStudentFirstNameChange = event => {
    //     this.setState( { student_first_name: event.target.value })
    // }

    // handleStudentLastNameChange = event => {
    //     this.setState({ student_last_name: event.target.value });
    // }

    // handleStudentIDChange = event => {
    //     this.setState({ student_id: event.target.value });
    // }

    // handleSchoolChange = event => {
    //     this.setState({ school: event.target.value });
    // }

    // handleRouteChange = event => {
    //     this.setState({ route: event.target.value });
    // }

    handleSubmit = event => {
        event.preventDefault();

        const user = {
            email: this.state.email,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            address: this.state.address,
            is_staff: this.state.is_staff == 'General' ? false : true,
            is_parent: this.state.students.length != 0
        }

        console.log(user)

        axios.put(API_DOMAIN + `users/edit`, user)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    componentDidMount() {
        axios.get(API_DOMAIN + `users/detail?id=0`)  // TODO: use onclick id values
        .then(res => {
        const user = res.data;
        this.setState({ user: user });
        })
    }

    render() {
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
                                            <a href={USERS_DETAIL_URL}><h5>{this.state.user.name}</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>Edit User</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">Admin Name</h6>
                                    <p className="text-muted text-small">Administrator</p>
                                </div>
                            </div>
                        </div>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit User</h5>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    placeholder="Enter first name" required
                                                    onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    placeholder="Enter last name" required
                                                    onChange={this.handleLastNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputEmail1" className="control-label pb-2">Email</label>
                                                <input type="email" className="form-control pb-2" id="exampleInputEmail1" 
                                                placeholder="Enter email" required
                                                onChange={this.handleEmailChange}></input>
                                                <small id="emailHelp" className="form-text text-muted pb-2">We'll never share your email with anyone
                                                    else.</small>
                                            </div>
                                            <div className="form-group pb-3 w-75">
                                                <label for="exampleInputAddress1" className="control-label pb-2">Address</label>
                                                <Autocomplete
                                                    apiKey={GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        console.log(place);
                                                    }}
                                                    options={{
                                                        types: 'address'
                                                    }}
                                                    placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1" 
                                                    onChange={this.handleAddressChange} />
                                                {/* <input type="address" className="form-control pb-2" id="exampleInputAddress1" placeholder="Enter home address" value="User Address"></input> */}
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="adminType" className="control-label pb-2">User Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="administrator" value="administrator"></input>
                                                    <label className="form-check-label" for="administrator">Administrator</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="adminType" id="general" value="general"></input>
                                                    <label className="form-check-label" for="general">General</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col mt-2">
                                            <div className="form-group pb-3">
                                                <label for="exampleInputStudents" className="pb-2">Students</label>
                                                <div>
                                                    <a className="btn px-0 py-1" data-bs-toggle="collapse" href="#accordionExample" role="button" aria-expanded="false" aria-controls="accordionExample">
                                                        <i className="bi bi-plus-circle me-2"></i>
                                                        Add a Student</a>

                                                    <div className="collapse accordion mt-4" id="accordionExample">
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="headingOne">
                                                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                                    Student 1 Name
                                                                </button>
                                                            </h2>
                                                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                                                    placeholder="Enter first name" value="First Name" required></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                                                    placeholder="Enter last name" value="Last Name" required></input>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for="exampleInputID1" className="control-label pb-2">Student 1 ID</label>
                                                                                <input type="id" className="form-control pb-2" id="exampleInputID1" placeholder="Enter student ID" value="Student ID" required></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School" required>
                                                                                    <option>Select a School</option>
                                                                                    <option selected value="1">Student 1 School</option>
                                                                                    <option value="2">Two</option>
                                                                                    <option value="3">Three</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
                                                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route" required>
                                                                                    <option>Select a Route</option>
                                                                                    <option selected value="1">Student 1 Route</option>
                                                                                    <option value="2">Two</option>
                                                                                    <option value="3">Three</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row justify-content-end mt-2 me-0">
                                        <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button>
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

export default UsersEdit;