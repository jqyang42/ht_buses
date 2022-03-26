import React, { Component } from 'react'
import { HT_LOGO, PARENT_PASSWORD_URL } from "../../constants";
import { API_DOMAIN } from '../../constants';
import axios from "axios";
import { STUDENT_INFO_URL, PASSWORD_URL } from "../../constants";
import { Link, Navigate } from 'react-router-dom';

class StudentSidebarMenu extends Component {
    state = {
        activeTab: "",
        label: "",
        redirect: false
    }

    handleLogout = event => {
        event.preventDefault();
        const creds = {
            user_id: localStorage.getItem('user_id')
        }

        axios.post(API_DOMAIN + `logout`, creds)
        .then(res => {
            this.setState({token: '', message: res.data.message})
            localStorage.setItem('token', '')
            localStorage.setItem('user_id', '')
            localStorage.setItem('first_name', '')
            localStorage.setItem('last_name', '')
            localStorage.setItem('is_staff', false)
            localStorage.setItem('logged_in', false)
            localStorage.setItem('is_parent', false)
            window.location.reload()
        })
    }

    componentDidMount() {
        const config = {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }}
    }

    render() {
        var activeTab = this.props.activeTab ? "active" : ""

        return (
            <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white sidebar">
                    <a href={STUDENT_INFO_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 me-md-auto text-white text-decoration-none">
                        <img src={HT_LOGO} className="img-logo img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                    </a>

                    <ul className="nav nav-pills flex-column mb-md-auto mb-4 mb-0 w-100" id="menu">
                        <li className={"nav-item " + activeTab}>
                            <a href={STUDENT_INFO_URL} className="nav-link align-middle mx-4 px-4">
                                <i className="bi bi-person me-2"></i>
                                <span className="ms-1 d-none d-sm-inline">My Info</span>
                            </a>
                        </li>
                    </ul>
                    <div className="w-100 px-auto pb-1 d-flex flex-wrap justify-content-around">
                            <button className="btn btn-primary w-75 mb-4 mx-auto" role="button" onClick={this.handleLogout}>
                                Log Out
                            </button> 
                    </div>
                </div>
            </div>
        )
    }
}

export default React.memo(StudentSidebarMenu)
