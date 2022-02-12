import React, { Component } from "react";
import { Link } from "react-router-dom";

class EmailConfirmation extends Component {

    render() {
        return (
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
        );
    }
}

export default React.memo(EmailConfirmation)