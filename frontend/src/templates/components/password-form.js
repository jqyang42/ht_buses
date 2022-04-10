import React, { Component } from 'react'
import { passwordRegex } from "../regex/input-validation";
import api from './api';
import { Link } from 'react-router-dom';
import PasswordResetConfirmation from "../general/password-reset-confirmation";

class PasswordForm extends Component {
    state = {
        password: '',
        confirm_password: '',
        redirect: false,
        edit_success: 0
    }
    password2 = '';
    validEmail = false;
    validPassword = false;
    samePassword = false;

    componentDidMount() {
        this.setState({ edit_success: 0 })
    }
    
    passwordValidation() {
        return (passwordRegex.test(this.state.password))
    }

    handlePasswordChange = (event) => {
        this.password2 = '';
        this.password2Field.value = '';
        this.samePassword = false;
        this.setState({ password: event.target.value});
    }
    
    handleConfirmPasswordChange = (event) => {
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
            return 
        }
        this.props.checkURL()
        const data = {
            user: {
                password: this.state.password
            }
        }
        this.props.sendApiRequest(data).then(password_changed => {
            this.setState({ edit_success: password_changed ? 1 : -1 })
            if (password_changed) {
               document.getElementById("password-form").reset()
            }
        })
    }

    render() {
        return (
             <div className="container my-4 mx-0 w-100 mw-100">
            {this.state.edit_success === 1 && this.props.source !== "ChangePassword" ? 
            <PasswordResetConfirmation type={this.props.type}/> : 
            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                <div className="row">
                    <div className="col">
                        <h5>{this.props.type}</h5>
                    </div>
                </div>
                <div className="w-50 pe-2 me-2">
                    {(this.state.edit_success === -1) ? 
                        (<div class="alert alert-danger mt-2 mb-2 form-col" role="alert">
                            Unable to change password. Please correct all errors before submitting.
                        </div>) : ""
                    }
                    {(this.state.edit_success === 1) ? 
                        (<div class="alert alert-success mt-2 mb-2 form-col" role="alert">
                            Password successfully changed.
                        </div>) : ""
                    }
                </div>
                <form id="password-form" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="col mt-2">
                            <div className="form-group required pb-3 form-col">
                                <label for="exampleInputPassword2" className="control-label pb-2">New Password</label>
                                <input type="password" className="form-control pb-2" id="exampleInputPassword2" 
                                placeholder="Enter new password" required ref={el => this.password1Field = el} onClick={this.props.checkURL} onChange={this.handlePasswordChange}></input>
                                {(!this.passwordValidation() && this.state.password !== "") ? 
                                    (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                        Your password is too weak. Password must contain at least 8 characters, including a combination of uppercase letters, lowercase letters, and numbers.
                                    </div>) : ""
                                }
                            </div>
                            <div className="form-group required pb-3 form-col">
                                <label for="exampleInputPassword3" className="control-label pb-2">Confirm New Password</label>
                                <input type="password" className="form-control pb-2" id="exampleInputPassword3" 
                                placeholder="Re-enter password" required ref={el => this.password2Field = el} onClick={this.props.checkURL} onChange={this.handleConfirmPasswordChange}></input>
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
                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 form-col">
                                <Link to={"/dashboard"} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                    <span className="btn-text">
                                        Cancel
                                    </span>
                                </Link>
                                <button type="submit" className="btn btn-primary w-auto justify-content-end">Update</button>
                            </div>
                        </div>
                        <div className="col mt-2 extra-col"></div>
                    </div>
                </form>
                </div>
                }
             </div>        
        );     
    }
}

export default React.memo(PasswordForm)
