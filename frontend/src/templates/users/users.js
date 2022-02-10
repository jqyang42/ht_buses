import React, { Component } from "react";
import { Link, Navigate} from "react-router-dom";
import { UsersTable } from '../tables/users-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import api from "../components/api";

import { LOGIN_URL } from '../../constants';
import { USERS_CREATE_URL, PARENT_DASHBOARD_URL } from "../../constants";

class Users extends Component {
    state = {
        users : [],
        show_all: false
    }

    componentDidMount() {
        this.getUsers()
    }

    // api calls
    getUsers() {
        api.get('users')
            .then(response => {
            const users = response.data.users;
            this.setState({ 
                users: users,
            });
        })
    }
    
    // render handlers
    handleShowAll() {
        this.setState({
            show_all: !this.state.show_all
        })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Manage Users" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <div className="row d-inline-flex float-end">
                                        <Link to={"/users/email"} className="btn btn-primary float-end w-auto me-3" role="button">
                                            <span className="btn-text">
                                                <i className="bi bi-envelope me-2"></i>
                                                Send Announcement
                                            </span>
                                        </Link>
                                        <Link to={USERS_CREATE_URL} className="btn btn-primary float-end w-auto me-3" role="button">
                                            <span className="btn-text">
                                                <i className="bi bi-person-plus-fill me-2"></i>
                                                Create
                                            </span>
                                        </Link>
                                    </div>
                                    <UsersTable data={this.state.users} showAll={this.state.show_all}/>
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

export default Users;