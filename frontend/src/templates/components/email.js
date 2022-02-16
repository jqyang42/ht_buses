import React, { Component } from "react";
import { Navigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";
import axios from "axios";
import { API_DOMAIN } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class Email extends Component {
    state = {
        name: '',
        subject: '',
        body: '',
        error_status: false,
        message_sent: 0,
        error_code: 200
    }

    handleSubjectChange = (input) => {
        const subject = input.target?.value 
        this.setState({ subject: subject});
        this.setState({ message_sent: 0 })
    }

    handleBodyChange = (input) => {
        const body = input.target?.value 
        this.setState({ body: body});
        this.setState({ message_sent: 0 })
    }

    handleSubmit = event => {
        event.preventDefault();
        if (this.state.body === "" || this.state.subject === "") {
            this.setState({ message_sent: -1 })
            return
        }
        // var self = this
        const data = {
            email: {
                subject: this.state.subject,
                body: this.state.body
            },
            include_route_info: false
        }
        const id_param_string = this.props.source.toLowerCase() === 'users' ? '' : (`?id=` + this.props.params.id)

        api.post(API_DOMAIN + 'announcement/' + this.props.source.toLowerCase() + id_param_string, data)
        .then(res => {
            this.setState({ message_sent: res.data.success ? 1 : -1 })
            this.bodyField.value = ''
            this.subjectField.value = ''
            this.setState({ subject: ''})
            this.setState({ body: ''})
    
        }).catch (error => {
            if (error.response.status !== 200) {
                this.setState({ error_status: true });
                this.setState({ error_code: error.response.status });
                this.setState({ message_sent: -1 })
            }
        } 
        )
    }

    componentDidMount() {
        api.get(`${this.props.source.toLowerCase()}/detail?id=${this.props.params.id}`).then(res => {
            const details = res.data;
            const name = this.props.source === "Routes" ? details.route.name : (this.props.source === "Schools" ? details.school.name : "")
            this.setState({ name: name })
        })
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
                        <HeaderMenu root={root} isRoot={false} isSecond={this.props.source === "Users"} id={this.props.source !== "Users" ? this.props.params.id : ""} name={name} page="Send Announcement" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Send Announcement</h5>
                                    </div>
                                </div>
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.message_sent === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to send announcement. Please correct all errors before sending.
                                        </div>) : ""
                                    }
                                    {(this.state.message_sent === 1) ? 
                                        (<div class="alert alert-success mt-2 mb-2 w-75" role="alert">
                                            Your message was sent.
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
                                                <input type="text" className="form-control pb-2"   ref={el => this.subjectField = el}  onChange={this.handleSubjectChange} id="subject" 
                                                placeholder="Add a subject" required></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="email-body" className="control-label pb-2">Message</label>
                                                <textarea type="text" className="form-control textarea-autosize pb-2"  ref={el => this.bodyField = el}  onChange={this.handleBodyChange} id="email-body"></textarea>
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