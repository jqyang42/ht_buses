import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import { UserStudentsTable } from '../tables/user-students-table';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";
import { makeSchoolsDropdown } from "../components/dropdown";

import { LOGIN_URL, PASSWORD_URL } from "../../constants";
import SidebarMenu from "../components/sidebar-menu";

class Account extends Component {
    state = {
        user: {},
        location: {},
        redirect: false
    }

    componentDidMount() {
        this.getUserDetails()
    }

    // api calls
    getUserDetails() {
        console.log(localStorage.getItem('user_id'))
        api.get(`account?id=${localStorage.getItem('user_id')}`)
        .then(res => {
            const user = res.data.user;
            console.log(user)
            this.setState({ 
                user: user,
                location: user.location
            });
        })
        .catch (err => {
            if (err.response.status !== 200) {
                this.setState({ error_status: true });
                this.setState({ error_code: err.response.status });
            }
        })
    }


    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        // const { redirect } = this.state;
        // const redirect_url = USERS_URL + '/' + this.props.params.id;
        // if (redirect) {
        //     return <Navigate to={ PARENT_DASHBOARD_URL }/>;
        // }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    {
                        localStorage.getItem('is_staff') == "false" ? <ParentSidebarMenu /> : <SidebarMenu />
                    }

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Account" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>
                                            {this.state.user.first_name} {this.state.user.last_name}
                                        </h5>
                                        <h7>
                                        {this.state.user.is_staff ? ('ADMINISTRATOR') : ('GENERAL')}
                                        </h7>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            <Link to={PASSWORD_URL} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    Change Password
                                                </span>
                                            </Link>
                                            {/* <button className="btn btn-primary float-end w-auto me-3" role="button" onClick={this.handleLogout}>
                                                Log Out
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-1">
                                        <p className="gray-600">
                                            Email
                                        </p>
                                        <p className="gray-600">
                                            Address
                                        </p>
                                    </div>
                                    <div className="col-5 me-4">
                                        <p>
                                            {this.state.user.email}
                                        </p>
                                        <p>
                                            {this.state.location.address ? this.state.location.address : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <Account
        {...props}
        params={useParams()}
    />
);