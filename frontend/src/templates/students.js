import React, { Component, useMemo } from "react";
import { useTable } from 'react-table'
import { HT_LOGO } from "../constants";
import { Link } from "react-router-dom";
// import { StudentsTable } from "./students-table";
import { StudentsTable } from "./students-table";

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

export function Setup() {
    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: 'id', // accessor is the "key" in the data
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Parent',
                accessor: 'parent',
            },
            {
                Header: 'School',
                accessor: 'school',
            },
            {
                Header: 'Route',
                accessor: 'route',
            },
        ],
        []
    )
    
    const data = React.useMemo(
        () => [
            {
                col1: 'Hello',
                col2: 'World',
            },
            {
                col1: 'react-table',
                col2: 'rocks',
            },
            {
                col1: 'whatever',
                col2: 'you want',
            },
        ],
        []
    )
}

class Students extends Component {

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
                                    <div className="col-md-auto mx-2 py-2 px-2 ps-3">
                                        <h5>Students</h5>
                                    </div>
                                    <div className="col-md-auto mx-2 py-0 mr-4">
                                        <h6 className="font-weight-bold mb-0">Admin Name</h6>
                                        <p className="text-muted text-small">Administrator</p>
                                    </div>
                                </div>
                            </div>
                            <div className="container my-4 mx-0 w-100 mw-100">
                                <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                    <div className="row">
                                        <div className="col">
                                            <div className="input-group w-50">
                                                <input id="search-input" type="search" placeholder="Search" id="form1" className="form-control"></input>
                                                <button id="search-button" type="button" className="btn btn-primary align-items-center pb-2">
                                                    <i className="bi bi-search"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col">
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <StudentsTable/>
                                        {/* <table className="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Name</th>
                                                    <th>Parent</th>
                                                    <th>School</th>
                                                    <th>Route</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Student ID</td>
                                                    <td>Student Name</td>
                                                    <td>Parent Name</td>
                                                    <td>School</td>
                                                    <td>Route</td>
                                                </tr>
                                            </tbody>
                                        </table> */}
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

export default Students;

