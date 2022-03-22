import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { STUDENTS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";


class EmailConfirmation extends Component {

    render() {
        if (JSON.parse(localStorage.getItem('logged_in')) && JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        else if (JSON.parse(localStorage.getItem('logged_in')) && !JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        return (
            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                <div className="row">
                    <div className="col w-50">
                        <h5>Password Recovery</h5>
                        <p className="mb-3">We have sent a password recovery link to your email.</p>
                        <Link to={"/login"} className="btn btn-primary w-auto me-3 mb-3" role="button">
                            <span className="btn-text">
                                Return to Login
                            </span>
                        </Link>
                        <p className="form-col mt-2 mb-0 gray-600">
                            Did not receive an email? Check your spam folder or <a href="/email-reset">try another email address</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default React.memo(EmailConfirmation)