import axios from "axios";
import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { RouteStudentsTable } from "../tables/route-students-table";
import RouteMap from './route-map';
import SidebarMenu from '../components/sidebar-menu';

import { LOGIN_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class BusRoutesDetail extends Component {
    state = {
        route : [],
        students : [],
        school : [],
        uppercaseSchool : ''
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + `routes/detail?id=` + this.props.params.id, config)  // TODO: use onclick id values
            .then(res => {
            const route = res.data;
            const school = route.school;
            
            if (route.students == null) {
                this.setState({ students: [] })
            } else {
                this.setState({ students: route.students })
            }
            this.setState({ route: route, school: school, uppercaseSchool: school.name.toUpperCase() });
            })
    }

    // uppercaseSchool = text.toUpperCase()

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
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2">
                                    <div className="row d-flex align-middle">
                                        <div className="w-auto px-2 ps-3">
                                            <a href={ROUTES_URL}><h5>Bus Routes</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>{this.state.route.name}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                    <p className="text-muted text-small">Administrator</p>
                                </div>
                            </div>
                        </div>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>{this.state.route.name}</h5>
                                        <h7><a href={"/schools/" + this.state.school.id}>{this.state.uppercaseSchool}</a></h7>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            <Link to={"/routes/" + this.props.params.id + "/edit"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Edit
                                                </span>
                                            </Link>
                                            <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                <i className="bi bi-trash me-2"></i>
                                                Delete
                                            </button>

                                            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="staticBackdropLabel">Delete Bus Route</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            Are you sure you want to delete this bus route?
                                                            Note: All associated students will revert to having no bus route.
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                            <button type="button" className="btn btn-danger">Delete</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-7 me-4">
                                        <div className="bg-gray rounded mb-4">
                                            <RouteMap />
                                        </div>
                                        <h6>Description</h6>
                                        <p>
                                            {this.state.route.description}
                                        </p>
                                    </div>
                                    <div className="col">
                                        <h7>STUDENTS</h7>
                                        <RouteStudentsTable data={this.state.students} />
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
    <BusRoutesDetail
        {...props}
        params={useParams()}
    />
);