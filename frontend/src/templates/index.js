import axios from 'axios'
import React, { Component } from "react";
import { Navigate} from "react-router-dom";
import { PARENT_DASHBOARD_URL } from "../constants";
import PropTypes from 'prop-types';
import UnauthenticatedHeaderMenu from './components/unauthenticated-header-menu';
import UnauthenticatedSidebarMenu from "./components/unauthenticated-sidebar-menu";

import { STUDENTS_URL } from "../constants";
import { API_DOMAIN } from "../constants";

class Login extends Component {

    state = {
        email: '',
        password: '',
        valid_login: false,
        token:'',
        message:''
    }

    handleEmailChange = event => {
        this.setState({ email: event.target.value });
    }

    handlePasswordChange = event => {
        this.setState({ password: event.target.value });
    }

    
    handleSubmit = event => {
        event.preventDefault();
        const creds = {
            email: this.emailField.value,
            password: this.passwordField.value
        }
        axios.post(API_DOMAIN + ``, creds)
        .then(res => {
            const data = res.data
            console.log(data)
            this.setState({message: data.message, valid_login: data.valid_login})
            localStorage.setItem('token', data.token)
            if (data.valid_login) {
                console.log(data.info)
                this.emailField.value = ''
                this.passwordField.value =''
                localStorage.setItem('user_id', data.info.user_id)
                localStorage.setItem('first_name', data.info.first_name)
                localStorage.setItem('last_name', data.info.last_name)
                localStorage.setItem('is_staff', data.info.role_id !== 4)
                localStorage.setItem('is_parent', data.info.is_parent)
                localStorage.setItem('role',  data.info.role_value)
                localStorage.setItem('logged_in', data.valid_login)
                res.headers['Authorization'] = `Token ${localStorage.getItem('token')}`;
                window.location.reload()
            } 
            else {
                this.passwordField.value = '';
                this.setState({password: ''})
            }
            // console.log(localStorage.getItem('token'))
        })
    }   
    
    render() {
        if (JSON.parse(localStorage.getItem('logged_in')) && JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        else if (JSON.parse(localStorage.getItem('logged_in')) && !JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        return (
            <body className="overflow-hidden">
                <div className="container-fluid mx-0 px-0">
                    <div className="row flex-wrap">
                        <UnauthenticatedSidebarMenu />
                        <div className="col mx-0 px-0 bg-gray w-100 min-vh-100">
                            <UnauthenticatedHeaderMenu />
                            <div className="container mt-4 mx-4 mx-md-2">
                                <div className="row">
                                    <div className="col-md-6 col-10">
                                        <h2 className="pb-3">Log In</h2>
                                        {(!this.state.valid_login && this.state.message !== "") ? 
                                            (<div>
                                                <div class="alert alert-danger mb-4" role="alert">
                                                    {this.state.message}
                                                </div>
                                            </div>) : ""
                                        }
                                        <form action="" method="post" onSubmit={this.handleSubmit}>
                                            <div className="form-group pb-3">
                                                <label for="exampleInputEmail1" className="pb-2">Email</label>
                                                <input type="email" className="form-control pb-2" name="email" id="exampleInputEmail1" aria-describedby="emailHelp"
                                                    placeholder="Enter email" ref={el => this.emailField = el}  onChange={this.handleEmailChange}></input>
                                                <small id="emailHelp" className="form-text text-muted pb-2">We'll never share your email with anyone else.</small>
                                            </div>
                                            <div className="form-group pb-3 mb-2">
                                                <label for="exampleInputPassword1" className="pb-2">Password</label>
                                                <input type="password" className="form-control pb-2 mb-2" name="password" id="exampleInputPassword1" 
                                                placeholder="Password" ref={el => this.passwordField = el} onChange={this.handlePasswordChange}></input>
                                                <a href="/email-reset" className="mt-0">Forgot your password?</a>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Log In</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        );
    }
}

export default Login;