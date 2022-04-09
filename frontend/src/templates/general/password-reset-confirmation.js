import React, { Component } from "react";
import { Link } from "react-router-dom";
import { STUDENTS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { Navigate } from 'react-router-dom';

class PasswordResetConfirmation extends Component {

    render() {
        if (JSON.parse(localStorage.getItem('logged_in')) && JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        else if (JSON.parse(localStorage.getItem('logged_in')) && JSON.parse(localStorage.getItem('role') === "General")) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        else if (JSON.parse(localStorage.getItem('logged_in')) && JSON.parse(localStorage.getItem('role') === "Student")) {
            return <Navigate to={STUDENT_INFO_URL} />
        }
        return (
            <div className="container-fluid py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                <div className="row">
                    <div className="col w-50">
                        <h5>{this.props.type}</h5>
                        <p className="mb-3">Your password has been successfully updated. You can now try logging in with your new credentials.</p>
                        <Link to={"/login"} className="btn btn-primary w-auto me-3 mb-3" role="button">
                            <span className="btn-text">
                                Login
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default React.memo(PasswordResetConfirmation)

