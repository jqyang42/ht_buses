import React, { Component } from "react";
import { HT_LOGO } from "../../constants";
import { Link , Navigate} from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { passwordRegex } from "../regex/input-validation";

import { INDEX_URL } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class UsersPassword extends Component {
    state = {
        password: '',
        confirm_password: '',
        redirect: false,
    }

    password2 = '';
    validEmail = false;
    validPassword = false;
    samePassword = false;
    
    passwordValidation = function() {
        return (passwordRegex.test(this.state.password))
    }

    handlePasswordChange = event => {
        this.password2 = '';
        this.password2Field.value = '';
        this.samePassword = false;
        this.setState({ password: event.target.value});
    }
    
    handleConfirmPasswordChange = event => {
        this.setState({ confirm_password: event.target.value });
        this.password2 = event.target.value;
        this.setState({ password: this.password1Field.value});
        this.samePassword  = this.state.password == this.password2
        this.validPassword = this.passwordValidation() && this.samePassword
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
            console.log(sessionStorage.getItem('logged_in'))
            console.log(sessionStorage.getItem('token'))
            window.location.reload()
        })
    }



    handleSubmit = event => {
        if (!this.validPassword) {
            return 
        }
        event.preventDefault();

        const password = {
            password: this.state.password
        }
        
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
    
        axios.put(API_DOMAIN + `users/password-edit?id=` + this.props.params.id, password, config) 
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
        this.setState({ redirect: true });
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = USERS_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                            <a href={INDEX_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                            </a>

                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                <li className="nav-item">
                                    <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-list-ul me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Students</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-building me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Schools</span>
                                    </a>
                                </li>
                                <li className="nav-item active">
                                    <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-people me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="w-100 px-auto pb-1 d-flex justify-content-around">
                                <button className="btn btn-primary w-75 mb-4 mx-auto" role="button" onClick={this.handleLogout}>
                                    Log Out
                                </button> 
                            </div>
                        </div>
                    </div>

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2">
                                    <div className="row d-flex align-middle">
                                        <div className="w-auto px-2 ps-3">
                                            <a href={USERS_URL}><h5>Manage Users</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <a href={"/users/" + this.props.params.id}><h5>User Name</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>Change Password</h5>
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
                                        <h5>Change Password</h5>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            {/* <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPassword1" className="control-label pb-2">Old Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword1" placeholder="Enter old password" required></input>
                                            </div> */}
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPassword2" className="control-label pb-2">New Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword2" 
                                                placeholder="Enter new password" required ref={el => this.password1Field = el} onChange={this.handlePasswordChange}></input>
                                                {(!this.passwordValidation() && this.state.password !== "") ? 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Your password is too weak. Password must contain at least 8 characters, including a combination of uppercase letters, lowercase letters, and numbers.
                                                    </div>) : ""
                                                }
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputPassword3" className="control-label pb-2">Confirm New Password</label>
                                                <input type="password" className="form-control pb-2" id="exampleInputPassword3" 
                                                placeholder="Re-enter password" required ref={el => this.password2Field = el} onChange={this.handleConfirmPasswordChange}></input>
                                                {(!this.samePassword && this.password2 !== "") ? (this.state.password !== "" ? 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Password confirmation failed
                                                    </div>) : 
                                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                        Please type in your new password before confirming
                                                    </div>)
                                                ) : ""
                                                }
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                <Link to={"/users/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
                                                {/* <button type="button" href={"/users/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button> */}
                                                <button type="submit" className="btn btn-primary w-auto justify-content-end">Update</button>
                                            </div>
                                        </div>
                                        <div className="col mt-2">
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <UsersPassword
        {...props}
        params={useParams()}
    />
);