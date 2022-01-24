import React, { Component } from "react";
import HT_Logo from '../static/img/HT_Logo.png';
import { Link } from "react-router-dom";

class BusRoutesPlanner extends Component {
	render() {
		return (
            <main>
                <body className="overflow-hidden">
                    <div className="container-fluid mx-0 px-0">
                        <div className="row flex-nowrap">
                            <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                                <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                                    <a href="/" className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                        <img src={HT_Logo} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
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
                                        <li className="nav-item active">
                                            <a href="/schools" className="nav-link px-0 align-middle mx-4 px-4">
                                                <i className="bi bi-building me-2"></i>
                                                <span className="ms-1 d-none d-sm-inline">Schools</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
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
                                                    <h5>Schools</h5>
                                                </div>
                                                <div className="w-auto px-2">
                                                    <i className="bi bi-chevron-right"></i>
                                                </div>
                                                <div className="w-auto px-2">
                                                    <h5>School Name</h5>
                                                </div>
                                                <div className="w-auto px-2">
                                                    <i className="bi bi-chevron-right"></i>
                                                </div>
                                                <div className="w-auto px-2">
                                                    <h5>Route Planner</h5>
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
                                    <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                        <div>
                                            <h5>School Name</h5>
                                            <p>738 Illinois St., Lansdale, PA 19446</p>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-7 me-4">
                                                <h7 className="text-muted text-small track-wide">PLAN ROUTES</h7>
                                                <div className="row d-flex mt-2">
                                                    <div className="col-auto float-start">
                                                        <button type="button" className="btn btn-primary">Add Route</button>
                                                    </div>
                                                    <div className="col justify-content-end">
                                                        <select className="w-50 form-select float-end" placeholder="Select a Route" aria-label="Select a Route">
                                                            <option selected>Select a Route</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-auto">
                                                        <button type="button" className="btn btn-primary">Assign</button>
                                                    </div>
                                                </div>
                                                <div className="bg-gray rounded mt-3 px-4 py-4">
                                                    <h5>Map</h5>
                                                </div>
                                            </div>
                                            <div className="col">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </body>
            </main>
		);
	}
}

export default BusRoutesPlanner;