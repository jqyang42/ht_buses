import React, { Component } from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { GOOGLE_API_KEY, HT_LOGO } from '../constants';
import RouteMap from './route-map';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

class Bus_Routes_Planner extends Component {
    render() {
        return (
            <main>
                <body class="overflow-hidden">
                    <div class="container-fluid mx-0 px-0">
                        <div class="row flex-nowrap">

                            {/* Sidebar Menu Nav */}

                            <div class="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                                <div class="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                                    {/*  HT Logo  */}
                                    <a href="/" class="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                        <img src={HT_LOGO} class="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation" />
                                    </a>

                                    {/*  Menu Links  */}
                                    <ul class="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                        <li class="nav-item">
                                            <a href="/students" class="nav-link align-middle mx-4 px-4">
                                                <span class="ms-1 d-none d-sm-inline">Students</span>
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="/routes" class="nav-link px-0 align-middle mx-4 px-4">
                                                <span class="ms-1 d-none d-sm-inline">Bus Routes</span></a>
                                        </li>
                                        <li class="nav-item active">
                                            <a href="/schools" class="nav-link px-0 align-middle mx-4 px-4">
                                                <span class="ms-1 d-none d-sm-inline">Schools</span></a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="/users" class="nav-link px-0 align-middle mx-4 px-4">
                                                <span class="ms-1 d-none d-sm-inline">Manage Users</span></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/*  Page contents  */}

                            <div class="col mx-0 px-0 bg-gray w-100">
                                <div class="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                                    <div class="row align-self-center d-flex justify-content-between">
                                        <div class="col-md-auto mx-2 py-2">
                                            <div class="row d-flex align-middle">
                                                <div class="w-auto px-2 ps-3">
                                                    <h5>Schools</h5>
                                                </div>
                                                <div class="w-auto px-2">
                                                    {/* {% bs_icon 'chevron-right' %} */}
                                                </div>
                                                <div class="w-auto px-2">
                                                    <h5>School Name</h5>
                                                </div>
                                                <div class="w-auto px-2">
                                                    {/* {% bs_icon 'chevron-right' %} */}
                                                </div>
                                                <div class="w-auto px-2">
                                                    <h5>Route Planner</h5>
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
                                    <div class="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                        <div>
                                            <h5>School Name</h5>
                                            <p>738 Illinois St., Lansdale, PA 19446</p>
                                        </div>
                                        <div class="row mt-4">
                                            <div class="col-7 me-4">
                                                <h7 class="text-muted text-small track-wide">PLAN ROUTES</h7>
                                                <div class="row d-flex mt-2">
                                                    <div class="col-auto float-start">
                                                        <button type="button" class="btn btn-primary">Add Route</button>
                                                    </div>
                                                    <div class="col justify-content-end">
                                                        <select class="w-50 form-select float-end" placeholder="Select a Route" aria-label="Select a Route">
                                                            <option selected>Select a Route</option>
                                                            <option value="1">One</option>
                                                            <option value="2">Two</option>
                                                            <option value="3">Three</option>
                                                        </select>
                                                    </div>
                                                    <div class="col-auto">
                                                        <button type="button" class="btn btn-primary">Assign</button>
                                                    </div>
                                                </div>
                                                <div class="bg-gray rounded mt-3 px-4 py-4">
                                                    <h5>Map</h5>
                                                    <RouteMap />
                                                </div>
                                            </div>
                                            <div class="col">
                                                <table class="table table-striped table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Bus Route</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td class="table-active">Example</td>
                                                            <td>Example</td>
                                                            <td>Example</td>
                                                        </tr>
                                                        <tr>
                                                            <td class="">Example</td>
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
        )
    }
}

export default React.memo(Bus_Routes_Planner)




