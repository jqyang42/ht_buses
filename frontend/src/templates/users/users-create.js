import axios from "axios";
import React, { Component } from "react";
import { HT_LOGO, GOOGLE_API_KEY } from "../../constants";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";

import { INDEX_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";

class UsersCreate extends Component {
    state = {
        user: {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            address: '',
            is_staff: '',
        },
        students: [],
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

        axios.post(API_DOMAIN + `users/create`, user)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    }

    // studentAccordion(props) {
    //     return (
    //     <div className="accordion-item">
    //         <h2 className="accordion-header" id="headingTwo">
    //             <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
    //                 Student {props.student_count}
    //             </button>
    //         </h2>
    //         <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
    //             <div className="accordion-body">
    //                 <div className="row">
    //                     <div className="col">
    //                     <div className="form-group required pb-3">
    //                             <label for="exampleInputFirstName2" className="control-label pb-2">First Name</label>
    //                             <input type="name" className="form-control pb-2" id="exampleInputFirstName2"
    //                                 placeholder="Enter first name" required></input>
    //                         </div>
    //                         <div className="form-group required pb-3">
    //                             <label for="exampleInputLastName2" className="control-label pb-2">Last Name</label>
    //                             <input type="name" className="form-control pb-2" id="exampleInputLastName2"
    //                                 placeholder="Enter last name" required></input>
    //                         </div>
    //                         <div className="form-group pb-3">
    //                             <label for="exampleInputID2" className="control-label pb-2">Student ID</label>
    //                             <input type="id" className="form-control pb-2" id="exampleInputID2" 
    //                             placeholder="Enter student ID"></input>
    //                         </div>
    //                         <div className="form-group required pb-3">
    //                             <label for="exampleInputSchool2" className="control-label pb-2">School</label>
    //                             <select className="form-select" placeholder="Select a School" aria-label="Select a School">
    //                                 <option selected>Select a School</option>
    //                                 <option value="1">One</option>
    //                                 <option value="2">Two</option>
    //                                 <option value="3">Three</option>
    //                             </select>
    //                         </div>
    //                         <div className="form-group pb-3">
    //                             <label for="exampleInputRoute2" className="control-label pb-2">Route</label>
    //                             <select className="form-select" placeholder="Select a Route" aria-label="Select a Route">
    //                                 <option selected>Select a Route</option>
    //                                 <option value="1">One</option>
    //                                 <option value="2">Two</option>
    //                                 <option value="3">Three</option>
    //                             </select>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>);
    // }
    
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
                                            <h5>Create User</h5>
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
                                        <h5>Create New User</h5>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit} novalidate>
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
                                                placeholder="Enter email" required onChange={this.handleEmailChange}></input>
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
                                            </div>
                                            <div onChange={this.handleIsStaffChange} className="form-group required pb-3 w-75">
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
                                                placeholder="Password" required onChange={this.handlePasswordChange}></input>
                                            </div>
                                            <div className="form-group required pb-4 w-75">
                                                <label for="exampleInputPassword1" className="control-label pb-2">Confirm Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword1" placeholder="Password" required></input>
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
                                                                    Student 1
                                                                </button>
                                                            </h2>
                                                            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                                                    placeholder="Enter first name" required></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                                                    placeholder="Enter last name" required></input>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for="exampleInputID1" className="control-label pb-2">Student ID</label>
                                                                                <input type="id" className="form-control pb-2" id="exampleInputID1" placeholder="Enter student ID"></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School" required>
                                                                                    <option selected>Select a School</option>
                                                                                    <option value="1">One</option>
                                                                                    <option value="2">Two</option>
                                                                                    <option value="3">Three</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
                                                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route" required>
                                                                                    <option selected>Select a Route</option>
                                                                                    <option value="1">One</option>
                                                                                    <option value="2">Two</option>
                                                                                    <option value="3">Three</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header" id="headingTwo">
                                                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                    Student 2
                                                                </button>
                                                            </h2>
                                                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                                <div className="accordion-body">
                                                                    <div className="row">
                                                                        <div className="col">
                                                                        <div className="form-group required pb-3">
                                                                                <label for="exampleInputFirstName2" className="control-label pb-2">First Name</label>
                                                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName2"
                                                                                    placeholder="Enter first name" required></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputLastName2" className="control-label pb-2">Last Name</label>
                                                                                <input type="name" className="form-control pb-2" id="exampleInputLastName2"
                                                                                    placeholder="Enter last name" required></input>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for="exampleInputID2" className="control-label pb-2">Student ID</label>
                                                                                <input type="id" className="form-control pb-2" id="exampleInputID2" placeholder="Enter student ID"></input>
                                                                            </div>
                                                                            <div className="form-group required pb-3">
                                                                                <label for="exampleInputSchool2" className="control-label pb-2">School</label>
                                                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School">
                                                                                    <option selected>Select a School</option>
                                                                                    <option value="1">One</option>
                                                                                    <option value="2">Two</option>
                                                                                    <option value="3">Three</option>
                                                                                </select>
                                                                            </div>
                                                                            <div className="form-group pb-3">
                                                                                <label for="exampleInputRoute2" className="control-label pb-2">Route</label>
                                                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route">
                                                                                    <option selected>Select a Route</option>
                                                                                    <option value="1">One</option>
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
                                        <Link to={USERS_URL} class="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                            <span class="btn-text">
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