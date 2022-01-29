import React, { Component } from "react";
import { API_DOMAIN, HT_LOGO } from "../../constants";
import { Link } from "react-router-dom";

import { INDEX_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { ParentDashboardTable } from "../tables/parent-dashboard-table";
import axios from "axios";

class ParentDashboard extends Component {
    state = {
        id: 0,
        parent: [],
        students: [],
    }

    componentDidMount() {
        axios.get(API_DOMAIN + 'dashboard?id=' + this.state.id)
            .then(res => {
            const parent = res.data;
            const students = parent.students;
            console.log(students)
            this.setState({ parent: parent, students: students})
        })
    }

    render() {
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                            <a href={PARENT_DASHBOARD_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                            </a>

                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                <li className="nav-item active">
                                    <a href={PARENT_DASHBOARD_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-house me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2 px-2 ps-3">
                                    <h5>My Dashboard</h5>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">User Name</h6>
                                    <p className="text-muted text-small">Parent</p>
                                </div>
                            </div>
                        </div>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <ParentDashboardTable data={this.state.students}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ParentDashboard;