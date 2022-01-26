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

class SchoolsDetail extends Component {
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
                                    <li className="nav-item">
                                        <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                        </a>
                                    </li>
                                    <li className="nav-item active">
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

                        <div className="col mx-0 px-0 bg-gray w-100">
                            <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                                <div className="row align-self-center d-flex justify-content-between">
                                    <div className="col-md-auto mx-2 py-2">
                                        <div className="row d-flex align-middle">
                                            <div className="w-auto px-2 ps-3">
                                                <a href={SCHOOLS_URL}><h5>Schools</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <h5>School Name</h5>
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
                                            <h5>School Name</h5>
                                            <p>738 Illinois St., Lansdale, PA 19446</p>
                                        </div>
                                        <div className="col">
                                            <div className="row d-inline-flex float-end">
                                                <Link to={ROUTES_PLANNER_URL} class="btn btn-primary float-end w-auto me-3" role="button">
                                                    <span class="btn-text">
                                                        <i className="bi bi-geo-alt-fill me-2"></i>
                                                        Route Planner
                                                    </span>
                                                </Link>
                                                <Link to={SCHOOLS_EDIT_URL} class="btn btn-primary float-end w-auto me-3" role="button">
                                                    <span class="btn-text">
                                                        <i className="bi bi-pencil-square me-2"></i>
                                                        Edit
                                                    </span>
                                                </Link>
                                                <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                    <i className="bi bi-trash me-2"></i>
                                                    Delete
                                                </button>

                                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Delete School</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <form>
                                                                    <p>Are you sure you want to delete this school and all of its associated students and routes?</p>
                                                                    <div className="form-group required">
                                                                        <label for="school-name" className="control-label pb-2">Type the school name to confirm.</label>
                                                                        <input type="text" className="form-control" id="school-name" placeholder="Enter school name"></input>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div class="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="button" className="btn btn-danger">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col me-4">
                                            <h7>STUDENTS</h7>
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Bus Route</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col">
                                            <h7>ROUTES</h7>
                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Student Count</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                        <td>Example</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        );
    }
}

export default SchoolsDetail;