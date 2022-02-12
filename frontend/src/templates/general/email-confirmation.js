import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import UnauthenticatedHeaderMenu from "../components/unauthenticated-header-menu";
import UnauthenticatedSidebarMenu from "../components/unauthenticated-sidebar-menu";
import api from "../components/api";
import { HT_LOGO } from "../../constants";

class EmailConfirmation extends Component {
    state = {
        redirect: false,
        email_success: 0
    }

    validEmail = false;

    componentDidMount() {
        console.log(sessionStorage.getItem('is_staff'))
    }

    handleSubmit = event => {
        
        event.preventDefault();

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
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col w-50">
                                        <h5>Check Your Mail</h5>
                                        <p className="mb-3">We have sent a password recovery link to your email.</p>
                                        <Link to={"/login"} className="btn btn-primary w-auto me-3 mb-3" role="button">
                                            <span className="btn-text">
                                                Return to Login
                                            </span>
                                        </Link>
                                        <p className="w-75 mt-2 mb-0 gray-600">
                                            Did not receive an email? Check your spam folder or <a href="/email-reset">try another email address</a>
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
    <EmailConfirmation
        {...props}
        params={useParams()}
    />
);