import React, { Component } from "react";
import HT_Logo from '../static/img/HT_Logo.png';
import { Link } from "react-router-dom";

class BusRoutesDetail extends Component {
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
                                        <li className="nav-item active">
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
                                                    <h5>Bus Routes</h5>
                                                </div>
                                                <div className="w-auto px-2">
                                                    <i className="bi bi-chevron-right"></i>
                                                </div>
                                                <div className="w-auto px-2">
                                                    <h5>Route Name</h5>
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
                                                <h5>Route Name</h5>
                                                <h7>LOREM IPSUM ELEMENTARY SCHOOL</h7>
                                            </div>
                                            <div className="col">
                                                <div className="row d-inline-flex float-end">
                                                    <Link to="/routes_edit" class="btn btn-primary float-end w-auto me-3" role="button">
                                                        <span class="btn-text">
                                                            <i className="bi bi-pencil-square me-2"></i>
                                                            Edit
                                                        </span>
                                                    </Link>
                                                    <button type="button" className="btn btn-primary float-end w-auto me-3">
                                                        <i className="bi bi-trash me-2"></i>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-7 me-4">
                                                <div className="bg-gray rounded mb-4 px-4 py-4">
                                                    <h5>Map</h5>
                                                </div>
                                                <h6>Description</h6>
                                                <p>
                                                    Here is a relatively longer description of the route. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque viverra mauris in aliquam sem fringilla ut. Cras pulvinar mattis nunc sed blandit libero volutpat. Enim nec dui nunc mattis enim ut tellus.
                                                </p>
                                            </div>
                                            <div className="col">
                                                <h7>STUDENTS</h7>
                                                <table className="table table-striped table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>Example</td>
                                                            <td>Example</td>
                                                        </tr>
                                                        <tr>
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

export default BusRoutesDetail;