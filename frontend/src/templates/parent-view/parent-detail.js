import React, { Component } from "react";
import { API_DOMAIN } from "../../constants";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, STUDENTS_URL } from "../../constants";
import axios from "axios";

class ParentDetail extends Component {
    state = {
        student: [],
        route: []
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        console.log(config)
        axios.get(API_DOMAIN + 'dashboard/students/detail?id=' + this.props.params.id, config)
            .then(res => {
                const student = res.data
                const route = student.route
                this.setState({ student: student, route: route })
            })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        return (
            <body className="overflow-hidden">
                <div className="container-fluid mx-0 px-0">
                    <div className="row flex-nowrap">
                        <ParentSidebarMenu />

                        <div className="col mx-0 px-0 bg-gray w-100">
                            <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                                <div className="row align-self-center d-flex justify-content-between">
                                    <div className="col-md-auto mx-2 py-2">
                                        <div className="row d-flex align-middle">
                                            <div className="w-auto px-2 ps-3">
                                                <a href={PARENT_DASHBOARD_URL}><h5>My Dashboard</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <h5>{this.state.student.first_name} {this.state.student.last_name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-auto mx-2 py-0 mr-4">
                                        <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                        <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="container my-4 mx-0 w-100 mw-100">
                                <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                    <div className="row">
                                        <div className="col">
                                            <h5>{this.state.student.first_name} {this.state.student.last_name}</h5>
                                            <h7>ID #{this.state.student.school_student_id}</h7>
                                        </div>
                                        <div className="col">
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-1">
                                            <p className="gray-600">
                                                School
                                            </p>
                                            <p className="gray-600">
                                                Route
                                            </p>
                                        </div>
                                        <div className="col-2 me-4">
                                            <p>
                                                {this.state.student.school_name}
                                            </p>
                                            <p>
                                                {this.state.route.name}
                                            </p>
                                            <p>
                                                {this.state.route.description}
                                            </p>
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

export default (props) => (
    <ParentDetail
        {...props}
        params={useParams()}
    />
);