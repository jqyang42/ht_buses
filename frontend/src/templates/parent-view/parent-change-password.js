import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { passwordRegex } from "../regex/input-validation";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";

class ParentPassword extends Component {
    state = {
        password: '',
        confirm_password: '',
        user: [],
        redirect: false,
        edit_success: 0
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
        this.samePassword  = this.state.password === this.password2
        this.validPassword = this.passwordValidation() && this.samePassword
    }

    handleSubmit = event => {
        
        event.preventDefault();

        if (!this.validPassword || (this.state.password !== this.state.confirm_password)) {
            this.setState({ edit_success: -1 })
            // console.log(this.state.edit_success)
            return 
        }

        const password = {
            password: this.state.password
        }
        
        api.put(`users/password-edit?id=${sessionStorage.getItem('user_id')}`, password) 
            .then(res => {
                const msg = res.data.data.message
                if (msg === 'User password updated successfully') {
                    this.setState({ edit_success: 1 })    // TODO ERROR: edit_success?
                    // console.log(this.state.edit_success)
                }
            })
        // this.setState({ redirect: true });
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
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
                    <ParentSidebarMenu />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Account" isRoot={false} isSecond={true} name="Change Password" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Change Password</h5>
                                    </div>
                                </div>
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to change password. Please correct all errors before submitting.
                                        </div>) : ""
                                    }
                                    {(this.state.edit_success === 1) ? 
                                        (<div class="alert alert-success mt-2 mb-2 w-75" role="alert">
                                            Password successfully changed.
                                        </div>) : ""
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
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
                                                <Link to={"/dashboard"} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
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
    <ParentPassword
        {...props}
        params={useParams()}
    />
);