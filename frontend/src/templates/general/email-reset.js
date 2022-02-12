import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import UnauthenticatedHeaderMenu from "../components/unauthenticated-header-menu";
import UnauthenticatedSidebarMenu from "../components/unauthenticated-sidebar-menu";
import api from "../components/api";
import EmailConfirmation from "./email-confirmation";

class EmailReset extends Component {
    state = {
        redirect: false,
        email_success: 0
    }

    validEmail = false;

    componentDidMount() {
        this.setState({email_success: 0})
        // console.log(sessionStorage.getItem('is_staff'))
    }

    handleEmailValidation = (event) => {
        // TODO: add email validation check for if email exists in DB
        
    }

    handleSubmit = (event) => {
        
        event.preventDefault();
        // console.log(this.state.email_success)
        // this.setState({email_success: 1})
        
        // if (!this.validPassword || (this.state.password !== this.state.confirm_password)) {
        //     this.setState({ email_success: -1 })
        //     // console.log(this.state.email_success)
        //     return 
        // }
        
        // api.put(`users/password-edit?id=${sessionStorage.getItem('user_id')}`, password) 
        //     .then(res => {
        //         const success = res.data.success
        //         if (success) {
        //             this.setState({ email_success: 1 })    // TODO ERROR: email_success?
        //             // console.log(this.state.email_success)
        //         }
        //     })
        // // this.setState({ redirect: true });
    }

    render() {
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <UnauthenticatedSidebarMenu />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <UnauthenticatedHeaderMenu />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            {
                                this.state.email_success == 1 ? 
                                <EmailConfirmation /> :
                                <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                    <div className="row">
                                        <div className="col w-50">
                                            <h5>Reset Password</h5>
                                        </div>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col">
                                                <p className="w-75 mb-4">Enter the email associated with your account and we'll send you a link to reset your password.</p>
                                                {(this.state.email_success === -1) ? 
                                                    (<div class="alert alert-danger mt-2 mb-3 w-75" role="alert">
                                                        We could not find an account associated with this email. Please input a different email.
                                                    </div>) : ""
                                                }
                                                <div className="form-group required pb-3 w-75">
                                                    <label for="email" className="control-label pb-2">Email</label>
                                                    <input type="email" className="form-control pb-2" id="email" 
                                                    placeholder="Enter email" required onChange={this.handleEmailValidation}></input>
                                                    {/* {(!this.passwordValidation() && this.state.password !== "") ? 
                                                        (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                            Invalid email.
                                                        </div>) : ""
                                                    } */}
                                                </div>
                                                <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                    <Link to={"/login"} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                        <span className="btn-text">
                                                            Cancel
                                                        </span>
                                                    </Link>
                                                    <button type="submit" className="btn btn-primary w-auto justify-content-end">Send Instructions</button>
                                                </div>
                                            </div>
                                            <div className="col mt-2">
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <EmailReset
        {...props}
        params={useParams()}
    />
);