import axios from 'axios';
import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { SchoolsTable } from '../tables/schools-table';
import { API_DOMAIN } from "../../constants";
import SidebarMenu from '../components/sidebar-menu';

import { LOGIN_URL } from '../../constants';
import { SCHOOLS_CREATE_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class Schools extends Component {

    state = {
        schools : []
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + `schools`, config)
            .then(res => {
            const schools = res.data.schools;
            this.setState({ schools });
        })
    }
    
    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="schools" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2 px-2 ps-3">
                                    <h5>Schools</h5>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                    <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <div className="row d-inline-flex float-end">
                                        <Link to={SCHOOLS_CREATE_URL} className="btn btn-primary float-end w-auto me-3" role="button">
                                            <span className="btn-text">
                                                <i className="bi bi-person-plus-fill me-2"></i>
                                                Create
                                            </span>
                                        </Link>
                                    </div>
                                    <SchoolsTable data={this.state.schools} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schools;