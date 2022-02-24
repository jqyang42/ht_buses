import React, { Component } from 'react'
import { HT_LOGO, PARENT_DASHBOARD_URL } from "../../constants";
import { API_DOMAIN } from '../../constants';
import axios from "axios";
import { INDEX_URL, STUDENTS_URL, ROUTES_URL, SCHOOLS_URL, USERS_URL, PASSWORD_URL} from "../../constants";
import api from "../components/api";

class SidebarMenu extends Component {
    state = {
        activeTab: "",
        label: ""
    }

    handleLogout = event => {
        event.preventDefault();
        const creds = {
            user_id: sessionStorage.getItem('user_id')
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
            sessionStorage.setItem('is_parent', false)
            // console.log(sessionStorage.getItem('logged_in'))
            // console.log(sessionStorage.getItem('token'))
            window.location.reload()
        })
    }

    updateIsParent = () => {
        api.get(`users/detail?id=${sessionStorage.getItem('user_id')}`)
        .then(res => {
            const user = res.data.user;
            const prev = JSON.parse(sessionStorage.getItem('is_parent'))
            sessionStorage.setItem('is_parent', user.is_parent)
            if(user.is_parent && !prev) {
               window.location.reload()
            }
        })
        .catch (err => {
        })
    }

    componentDidMount() {
        const config = {
        headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`
        }}
        this.updateIsParent()
    }

    render() {
        var activeTab = this.props.activeTab;
        var studentsTab = (activeTab === "students") ? 'active' : '';
        var routesTab = (activeTab === "routes") ? 'active' : '';
        var schoolsTab = (activeTab === "schools") ? 'active' : '';
        var usersTab = (activeTab === "users") ? 'active' : '';
        var dashboardTab = (activeTab === "dashboard") ? 'active' : '';

        console.log(JSON.parse(sessionStorage.getItem('is_parent')))
        
        return (
            <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                    <a href={INDEX_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                    </a>

                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                        <li className={"nav-item " + studentsTab}>
                            <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                <i className="bi bi-list-ul me-2"></i>
                                <span className="ms-1 d-none d-sm-inline">Students</span>
                            </a>
                        </li>
                        <li className={"nav-item " + routesTab}>
                            <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                <i className="bi bi-geo-alt me-2"></i>
                                <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                            </a>
                        </li>
                        <li className={"nav-item " + schoolsTab}>
                            <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                <i className="bi bi-building me-2"></i>
                                <span className="ms-1 d-none d-sm-inline">Schools</span>
                            </a>
                        </li>
                        <li className={"nav-item " + usersTab}>
                            <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                <i className="bi bi-people me-2"></i>
                                <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                            </a>
                        </li>
                        {(JSON.parse(sessionStorage.getItem('is_staff')) && JSON.parse(sessionStorage.getItem('is_parent'))) ?
                            <>
                                <li className='hbar my-4'></li>
                                <li className={"nav-item " + dashboardTab}>
                                    <a href={PARENT_DASHBOARD_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-house me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">My Dashboard</span>
                                    </a>
                                </li>
                            </> : ""
                        }
                        
                    </ul>
                    <div className="w-100 px-auto pb-1 d-flex flex-wrap justify-content-around">
                        {/* <Link to={PASSWORD_URL} className="btn btn-primary w-75 mb-2 mx-auto align-self-center  justify-content-around" role="button">
                            <span className="btn-text">
                                Change Password
                            </span>
                        </Link> */}
                        <button className="btn btn-primary w-75 mb-4 mx-auto align-self-bottom" role="button" onClick={this.handleLogout}>
                            Log Out
                        </button> 
                    </div>
                </div>
            </div>
        )
    }
}

export default React.memo(SidebarMenu)
