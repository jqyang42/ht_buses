import React, { Component } from "react";
import { HT_LOGO } from "../constants";
import { Link } from "react-router-dom";

import { INDEX_URL } from "../constants";
import { SCHOOLS_URL } from "../constants";
import { STUDENTS_URL } from "../constants";
import { USERS_URL } from "../constants";
import { ROUTES_URL } from "../constants";
import { SCHOOLS_DETAIL_URL } from "../constants";
import { STUDENTS_DETAIL_URL } from "../constants";
import { USERS_DETAIL_URL } from "../constants";
import { ROUTES_DETAIL_URL } from "../constants";
import { SCHOOLS_CREATE_URL } from "../constants";
import { USERS_CREATE_URL } from "../constants";
import { ROUTES_PLANNER_URL } from "../constants";
import { SCHOOLS_EDIT_URL } from "../constants";
import { STUDENTS_EDIT_URL } from "../constants";
import { USERS_EDIT_URL } from "../constants";
import { ROUTES_EDIT_URL } from "../constants";

class StudentsEdit extends Component {
    render() {
        return (
            <body className="overflow-hidden">
                <div className="container-fluid mx-0 px-0">
                    <div className="row flex-nowrap">
                        <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                            <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                                <a href={INDEX_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                    <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                                </a>

                                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                    <li className="nav-item active">
                                        <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                            <i className="bi bi-list-ul"></i>
                                            <span className="ms-1 d-none d-sm-inline">Students</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-geo-alt"></i>
                                            <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-building"></i>
                                            <span className="ms-1 d-none d-sm-inline">Schools</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-people"></i>
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
                                                <a href={STUDENTS_URL}><h5>Students</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <a href={STUDENTS_DETAIL_URL}><h5>Student Name</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <h5>Edit Student</h5>
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
                                            <h5>Edit Student</h5>
                                        </div>
                                    </div>
                                    <form>
                                        <div className="row">
                                            <div className="col mt-2">
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                    <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                        value="First Name" placeholder="Enter first name" required></input>
                                                </div>
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                    <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                        value="Last Name" placeholder="Enter full name" required></input>
                                                </div>
                                                <div className="form-group pb-3 w-75">
                                                    <label for="exampleInputID1" className="control-label pb-2">Student ID</label>
                                                    <input type="id" className="form-control pb-2" id="exampleInputID1" value="Student ID" placeholder="Enter student ID"></input>
                                                </div>
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                    <select className="form-select" placeholder="Select a School" aria-label="Select a School">
                                                        <option>Select a School</option>
                                                        <option selected value="1">Student School</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div className="form-group pb-3 w-75">
                                                    <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
                                                    <select className="form-select" placeholder="Select a Route" aria-label="Select a Route">
                                                        <option>Select a Route</option>
                                                        <option selected value="1">Student Route</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="exampleInputParent1" className="control-label pb-2">Parent</label>
                                                    <select className="form-select" placeholder="Select a Parent" aria-label="Select a Parent">
                                                        <option>Select a Parent</option>
                                                        <option selected value="1">Student Parent</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                    <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button>
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
            </body>
        );
    }
}

export default StudentsEdit;