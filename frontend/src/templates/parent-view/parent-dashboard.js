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
    }

<<<<<<< HEAD
=======
    handleLogout = event => {
        event.preventDefault();
        const creds = {
            user_id: sessionStorage.getItem('user_id')
        }
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.post(API_DOMAIN + `logout`, creds)
        .then(res => {
            this.setState({token: '', message: res.data.message})
            sessionStorage.setItem('token', '')
            sessionStorage.setItem('user_id', '')
            sessionStorage.setItem('first_name', '')
            sessionStorage.setItem('last_name', '')
            sessionStorage.setItem('is_staff', false)
            sessionStorage.setItem('logged_in', false)
            console.log(sessionStorage.getItem('logged_in'))
            console.log(sessionStorage.getItem('token'))
            window.location.reload()
        })
    }



>>>>>>> dev
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
                        <HeaderMenu root="My Dashboard" isRoot={true} />
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