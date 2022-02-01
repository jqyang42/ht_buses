import React, { Component } from "react";
import { API_DOMAIN } from "../../constants";
import { Link , Navigate, useParams} from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";

import { LOGIN_URL, STUDENTS_URL } from "../../constants";
import { ParentDashboardTable } from "../tables/parent-dashboard-table";
import axios from "axios";

class ParentDashboard extends Component {
    state = {
        id: 0,
        parent: [],
        students: [],
        show_all: false
    }

    handleShowAll = event => {
        this.setState({show_all: !this.state.show_all})
        console.log(this.state.show_all)
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        console.log(sessionStorage.getItem('user_id'))
        axios.get(API_DOMAIN + 'dashboard?id=' + sessionStorage.getItem('user_id'), config)
            .then(res => {
            const parent = res.data;

            let students
            if (parent.students) {
                students = parent.students
            } else {
                students = []
            }
            console.log(students)
            this.setState({ parent: parent, students: students, show_all: false})
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
                        <HeaderMenu root="My Dashboard" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <ParentDashboardTable data={this.state.students} showAll={this.state.show_all}/>
                                    <button className="btn btn-secondary align-self-center" onClick={this.handleShowAll}>
                                        { !this.state.show_all ?
                                            "Show All" : "Show Pages"
                                        }
                                    </button>
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