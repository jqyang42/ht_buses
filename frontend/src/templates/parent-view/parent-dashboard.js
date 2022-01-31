import React, { Component } from "react";
import { API_DOMAIN } from "../../constants";
import { Link , Navigate, useParams} from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';

import { LOGIN_URL, STUDENTS_URL } from "../../constants";
import { ParentDashboardTable } from "../tables/parent-dashboard-table";
import axios from "axios";

class ParentDashboard extends Component {
    state = {
        id: 0,
        parent: [],
        students: [],
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + 'dashboard?id=' + sessionStorage.getItem('user_id'), config)
            .then(res => {
            const parent = res.data;
            const students = parent.students;
            console.log(students)
            this.setState({ parent: parent, students: students})
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
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <ParentSidebarMenu />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2 px-2 ps-3">
                                    <h5>My Dashboard</h5>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                    <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
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