import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { passwordRegex } from "../regex/input-validation";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";

import { LOGIN_URL } from "../../constants";
import { USERS_URL } from "../../constants";
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
    edit_success = 0;
    
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

    handleSubmit = event => {
        if (!this.validPassword || (this.state.password !== this.state.confirm_password)) {
            this.edit_success = -1  //TODO ERROR: use edit_success???? tricky timing when redirect is true
            console.log(this.state)
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
                const msg = res.data.data.message
                if (msg == 'User password updated successfully') {
                    this.edit_success = 1     // TODO ERROR: edit_success?
                    console.log(this.edit_success)
                }
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
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Manage Users" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.user.first_name + " " + this.state.user.last_name} page="Change Password" />
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