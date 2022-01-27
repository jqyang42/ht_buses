import axios from "axios";
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
import { API_DOMAIN } from "../constants";

class BusRoutesEdit extends Component {
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
                                    <li className="nav-item">
                                        <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                            <i className="bi bi-list-ul me-2"></i>
                                            <span className="ms-1 d-none d-sm-inline">Students</span>
                                        </a>
                                    </li>
                                    <li className="nav-item active">
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
                                    <li className="nav-item">
                                        <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-people me-2"></i>
                                            <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="col mx-0 px-0 bg-gray w-100">
                            <div class="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                                <div class="row align-self-center d-flex justify-content-between">
                                    <div class="col-md-auto mx-2 py-2">
                                        <div class="row d-flex align-middle">
                                            <div class="w-auto px-2 ps-3">
                                                <a href={ROUTES_URL}><h5>Bus Routes</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div class="w-auto px-2">
                                                <a href={ROUTES_DETAIL_URL}><h5>Route Name</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div class="w-auto px-2">
                                                <h5>Edit Route</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-auto mx-2 py-0 mr-4">
                                        <h6 class="font-weight-bold mb-0">Admin Name</h6>
                                        <p class="text-muted text-small">Administrator</p>
                                    </div>
                                </div>
                            </div>
                            <div class="container my-4 mx-0 w-100 mw-100">
                                <div class="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                    <div class="row">
                                        <div class="col">
                                            <h5>Edit Route</h5>
                                        </div>
                                        <div class="col">
                                            <div class="row d-inline-flex float-end">
                                                <Link to={ROUTES_PLANNER_URL} class="btn btn-primary float-end w-auto me-3" role="button">
                                                    <span class="btn-text">
                                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                                        Route Planner
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <form>
                                        <div class="row">
                                            <div class="col mt-2">
                                                <div class="form-group required pb-3 w-75">
                                                    <label for="exampleInputName1" class="control-label pb-2">Name</label>
                                                    <input type="name" class="form-control pb-2" id="exampleInputName1"
                                                        value="Route Name" placeholder="Enter route name" required></input>
                                                </div>
                                                <div class="form-group required pb-3 w-75">
                                                    <label for="exampleInputSchool1" class="control-label pb-2">School</label>
                                                    <select class="form-select" placeholder="Select a School" aria-label="Select a School">
                                                        <option>Select a School</option>
                                                        <option selected value="1">Route School</option>
                                                        <option value="2">Two</option>
                                                        <option value="3">Three</option>
                                                    </select>
                                                </div>
                                                <div class="form-group pb-3 w-75">
                                                    <label for="exampleInputDescription1" class="control-label pb-2">Description</label>
                                                    <textarea type="description" class="form-control textarea-autosize pb-2" id="exampleInputDescription1" value="Route Description" placeholder="Enter route description"></textarea>
                                                </div>
                                                <div class="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                    <button type="button" class="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button>
                                                    <button type="submit" class="btn btn-primary w-auto me-0 justify-content-end">Update</button>
                                                </div>
                                            </div>
                                            <div class="col mt-2"></div>
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

export default BusRoutesEdit;