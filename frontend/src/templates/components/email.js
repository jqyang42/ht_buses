import React, { Component } from "react";
import { Navigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import axios from "axios";
import { API_DOMAIN } from "../../constants";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class Email extends Component {
    state = {
        name: '',
        edit_success: 0,
        error_status: false,
        error_code: 200
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        var self = this

        axios.get(API_DOMAIN + this.props.source.toLowerCase() + `/detail?id=` + this.props.params.id, config)
        .then(res => {
            const details = res.data;
            const name = this.props.source === "Routes" ? details.route.name : (this.props.source === "Schools" ? details.school.name : "")
            this.setState({ name: name });
            this.setState({ edit_success: 0 })
        }).catch (function(error) {
            // console.log(error.response)
            if (error.response.status !== 200) {
                // console.log(error.response.data)
                self.setState({ error_status: true });
                self.setState({ error_code: error.response.status });
            }
        } 
        )
    }
    
    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }

        var root = (this.props.source === "Users") ? "Manage Users" : (this.props.source === "Routes" ? "Bus Routes" : this.props.source)
        var name = (this.props.source === "Users") ? "Send Announcement" : this.state.name

        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab={this.props.source.toLowerCase()} />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root={root} isRoot={false} isSecond={this.props.source === "Users" ? true : false} id={this.props.source === "Routes" ? this.props.params.id : ""} name={name} page="Send Announcement" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Send Announcement</h5>
                                    </div>
                                </div>
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to send announcement. Please correct all errors before sending.
                                        </div>) : ""
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div  className="form-group required pb-3 w-75">
                                                <div>
                                                    <label for="announcementType" className="control-label pb-2">Announcement Type</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="announcementType" id="general" value="general"></input>
                                                    <label className="form-check-label" for="general">General</label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="announcementType" id="route" value="route" ></input>
                                                    <label className="form-check-label" for="route">Route</label>
                                                </div>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="subject" className="control-label pb-2">Subject</label>
                                                <input type="text" className="form-control pb-2" id="subject" 
                                                placeholder="Add a subject" required></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="email-body" className="control-label pb-2">Message</label>
                                                <textarea type="text" className="form-control textarea-autosize pb-2" id="email-body"></textarea>
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                <Link to={"/" + this.props.source + "/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
                                                <button type="submit" className="btn btn-primary w-auto me-0 justify-content-end">Send</button>
                                            </div>
                                        </div>
                                        <div className="col mt-2"></div>
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
    <Email
        {...props}
        params={useParams()}
    />
);