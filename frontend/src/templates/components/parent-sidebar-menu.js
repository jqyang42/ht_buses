import React, { Component } from 'react'
import { HT_LOGO, PARENT_PASSWORD_URL } from "../../constants";
import { API_DOMAIN } from '../../constants';
import axios from "axios";
import { PARENT_DASHBOARD_URL, PASSWORD_URL } from "../../constants";
import { Link, Navigate } from 'react-router-dom';

class ParentSidebarMenu extends Component {
    state = {
        activeTab: "",
        label: "",
        redirect: false
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
            // console.log(sessionStorage.getItem('logged_in'))
            // console.log(sessionStorage.getItem('token'))
            window.location.reload()
        })
    }

    componentDidMount() {
        const config = {
        headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`
        }}
    }

    render() {
        // if (this.state.redirect) {
        //     return <Navigate to={PARENT_PASSWORD_URL}/>;
        // }
        var activeTab = this.props.activeTab ? "active" : ""

        return (
            <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                    <a href={PARENT_DASHBOARD_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                    </a>

                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                        <li className={"nav-item " + activeTab}>
                            <a href={PARENT_DASHBOARD_URL} className="nav-link align-middle mx-4 px-4">
                                <i className="bi bi-house me-2"></i>
                                <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                            </a>
                        </li>
                    </ul>
                    <div className="w-100 px-auto pb-1 d-flex flex-wrap justify-content-around">
                            <Link to={PASSWORD_URL} className="btn btn-primary w-75 mb-2 mx-auto align-self-center  justify-content-around" role="button">
                                <span className="btn-text">
                                    Change Password
                                </span>
                            </Link>
                            <button className="btn btn-primary w-75 mb-4 mx-auto" role="button" onClick={this.handleLogout}>
                                Log Out
                            </button> 
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default React.memo(ParentSidebarMenu)
