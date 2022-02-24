import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";

import { LOGIN_URL, STUDENTS_URL } from "../../constants";
import { ParentDashboardTable } from "../tables/parent-dashboard-table";
import SidebarMenu from '../components/sidebar-menu';
class ParentDashboard extends Component {
    state = {
        user: {},
        students: [],
        show_all: false
    }

    componentDidMount() {
        this.getUserDashboard();
    }

    // api calls
    getUserDashboard() {
        api.get(`dashboard?id=${sessionStorage.getItem('user_id')}`)
            .then(res => {
            const user = res.data.user;

            this.setState({ 
                user: user, 
                students: user.students
            })
        })
    }
    
    // render handlers
    handleShowAll() {
        this.setState(prevState => ({
            show_all: !prevState.show_all
        }))
    }    

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    {(JSON.parse(sessionStorage.getItem('is_staff')) && JSON.parse(sessionStorage.getItem('is_parent'))) ?
                    <SidebarMenu activeTab="users" /> :
                    <ParentSidebarMenu activeTab="Dashboard"/>
                    }

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