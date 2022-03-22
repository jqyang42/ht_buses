import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import UnauthenticatedHeaderMenu from "../components/unauthenticated-header-menu";
import UnauthenticatedSidebarMenu from "../components/unauthenticated-sidebar-menu";
import api from "../components/api";
import EmailConfirmation from "./email-confirmation";
import { STUDENTS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class EmailReset extends Component {
    state = {
        redirect: false,
        valid_email: 0,
        email: "",
        message_sent: 0

    }

    componentDidMount() {
        this.setState({ valid_email: 0 })
        this.setState({ message_sent: 0 })
        this.setState({ email: '' })
    }

    validate_email = async () => { 
        const data = {
            user: {
                email: this.state.email
            }
        }
        const res = await api.post(`email_exists`, data)
        const valid_email = res.data.user_email_exists ? 1 : -1
        this.setState({ valid_email: valid_email })
        console.log(valid_email)
        return res.data.user_email_exists
    }

    send_email = async () => {
        const data = {
            email: this.state.email
        }
        const res = await api.post(`send-reset-password-email`, data)
        this.setState({ message_sent: res.data.success ? 1 : -1 })
        return res.data.success
    }

    handleEmailChange = event => {
        const email = event.target.value
        this.setState({ email: email })
        this.setState({ valid_email: 0 })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.validate_email().then(valid_email => {
            if (valid_email) {
                this.send_email()
            }
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
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <UnauthenticatedSidebarMenu />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <UnauthenticatedHeaderMenu />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            {
                                this.state.message_sent === 1 ? 
                                <EmailConfirmation /> :
                                <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                    <div className="row">
                                        <div className="col">
                                            <h5>Reset Password</h5>
                                        </div>
                                    </div>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="row">
                                            <div className="col">
                                                <p className="w-75 mb-4">Enter the email associated with your account and we'll send you a link to reset your password.</p>
                                                {(this.state.valid_email === -1) ? 
                                                    (<div class="alert alert-danger mt-2 mb-3 form-col" role="alert">
                                                        We could not find an account associated with this email. Please input a different email.
                                                    </div>) : ""
                                                }
                                                <div className="form-group required pb-3 form-col">
                                                    <label for="email" className="control-label pb-2">Email</label>
                                                    <input type="email" className="form-control pb-2" id="email" 
                                                    placeholder="Enter email" required onChange={this.handleEmailChange}></input>
                                                    {/* {(!this.passwordValidation() && this.state.password !== "") ? 
                                                        (<div class="alert alert-danger mt-3 mb-0" role="alert">
                                                            Invalid email.
                                                        </div>) : ""
                                                    } */}
                                                </div>
                                                <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 form-col">
                                                    <Link to={"/login"} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                        <span className="btn-text">
                                                            Cancel
                                                        </span>
                                                    </Link>
                                                    <button type="submit" className="btn btn-primary w-auto justify-content-end">Send Instructions</button>
                                                </div>
                                            </div>
                                            <div className="col mt-2 extra-col">
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