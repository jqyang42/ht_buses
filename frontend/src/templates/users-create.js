import React, { Component } from "react";
import { HT_LOGO, GOOGLE_API_KEY } from "../constants";
import { Link } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";

class UsersCreate extends Component {
    render() {
        return (
            <body className="overflow-hidden">
                <div className="container-fluid mx-0 px-0">
                    <div className="row flex-nowrap">
                        <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                            <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                                <a href="/" className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                    <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                                </a>

                                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                    <li className="nav-item">
                                        <a href="/students" className="nav-link align-middle mx-4 px-4">
                                            <i className="bi bi-list-ul me-2"></i>
                                            <span className="ms-1 d-none d-sm-inline">Students</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/routes" className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="/schools" className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-building me-2"></i>
                                            <span className="ms-1 d-none d-sm-inline">Schools</span>
                                        </a>
                                    </li>
                                    <li className="nav-item active">
                                        <a href="/users" className="nav-link px-0 align-middle mx-4 px-4">
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
                                                <a href="/users"><h5>Manage Users</h5></a>
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
                                    <form>
                                        <div className="row">
                                            <div className="col mt-2">
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputName1" className="control-label pb-2">Name</label>
                                                    <input type="name" className="form-control pb-2" id="exampleInputName1"
                                                        placeholder="Enter full name" required></input>
                                                </div>
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputEmail1" className="control-label pb-2">Email</label>
                                                    <input type="email" className="form-control pb-2" id="exampleInputEmail1" placeholder="Enter email" required></input>
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
                                                        placeholder="Enter home address" className="form-control pb-2" id="exampleInputAddress1" />
                                                </div>
                                                <div className="form-group required pb-3 w-75">
                                                    <div>
                                                        <label for="exampleInputType1" className="control-label pb-2">Type</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="administrator"></input>
                                                        <label className="form-check-label" for="inlineRadio1">Administrator</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="general"></input>
                                                        <label className="form-check-label" for="inlineRadio2">General</label>
                                                    </div>
                                                </div>
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputPassword1" className="control-label pb-2">Password</label>
                                                    <input type="password" className="form-control pb-2" id="exampleInputPassword1" placeholder="Password" required></input>
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
                                                                                    <label for="exampleInputName1" className="control-label pb-2">Name</label>
                                                                                    <input type="name" className="form-control pb-2" id="exampleInputName1"
                                                                                        placeholder="Enter full name" required></input>
                                                                                </div>
                                                                                <div className="form-group pb-3">
                                                                                    <label for="exampleInputID1" className="control-label pb-2">Student ID</label>
                                                                                    <input type="id" className="form-control pb-2" id="exampleInputID1" placeholder="Enter student ID" required></input>
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
                                                                                    <label for="exampleInputName1" className="control-label pb-2">Name</label>
                                                                                    <input type="name" className="form-control pb-2" id="exampleInputName1"
                                                                                        placeholder="Enter full name"></input>
                                                                                </div>
                                                                                <div className="form-group pb-3">
                                                                                    <label for="exampleInputID1" className="control-label pb-2">Student ID</label>
                                                                                    <input type="id" className="form-control pb-2" id="exampleInputID1" placeholder="Enter student ID"></input>
                                                                                </div>
                                                                                <div className="form-group required pb-3">
                                                                                    <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                                                    <select className="form-select" placeholder="Select a School" aria-label="Select a School">
                                                                                        <option selected>Select a School</option>
                                                                                        <option value="1">One</option>
                                                                                        <option value="2">Two</option>
                                                                                        <option value="3">Three</option>
                                                                                    </select>
                                                                                </div>
                                                                                <div className="form-group pb-3">
                                                                                    <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
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
                                            <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button>
                                            <button type="submit" className="btn btn-primary w-auto justify-content-end">Create</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        );
    }
}

export default UsersCreate;