import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { RouteStudentsTable } from "../tables/route-students-table";
import { StopsTable } from "../tables/stops-table";
import RouteMap from './route-map';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, ROUTES_URL } from "../../constants";
import { studentsFromUsers } from "../components/table-processing";

class BusRoutesDetail extends Component {
    state = {
        route : {},
        students : [],
        center: {},
        markers: [],
        assign_mode: false,
        active_route: 0,
        redirect: false,
        delete_success: 0,
        students_show_all: false,
        stops_show_all: false,
        error_status: false,
        error_code: 200
    }

    componentDidMount() {
       this.getRouteDetails()
        
    }

    // api calls
    getRouteDetails = () => {
        api.get(`routes/detail?id=${this.props.params.id}`)
        .then(res => {
            const data = res.data;
            const route = data.route;
            const users = data.users;
            const students = studentsFromUsers({ users_data: users })
            
            this.setState({ 
                students: students,
                route: route, 
                center: { 
                    lat: route.school.location.lat, 
                    lng: route.school.location.long 
                }, 
            });       
            
            this.setMarkers(users)
        })
        .catch (error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status 
                });
            }
        })
    }

    deleteRoute = () => {
        api.delete(`routes/delete?id=${this.props.params.id}`)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    delete_success: 1,
                    redirect: true
                })
            } else {
                this.setState({ delete_success: -1})
            }
        }) 
    }

    // render handlers
    handleStudentsShowAll = () => {
        this.setState(prevState => ({
            students_show_all: !prevState.students_show_all
        }))
    }

    handleStopsShowAll = () => {
        this.setState(prevState => ({
            stops_show_all: !prevState.stops_show_all
        }))
    }

    handleDelete = (event) => {
        event.preventDefault()
        this.deleteRoute()
    }

    setMarkers = (users) => {
        users.map((user) => {
            const studentIDs = [];
            const studentNames = [];
            user.students.map((student) => {
                studentIDs.push(student.id);
                const fullName = student.first_name + ' ' + student.last_name;
                studentNames.push(fullName);
            });
            this.setState(prevState => ({
                markers: [...prevState.markers, {
                    position: {
                        lat: user.location.lat,
                        lng: user.location.long
                    },
                    id: user.id,
                    studentIDs: studentIDs,
                    studentNames: studentNames,
                    routeID: this.props.params.id //TODO: change markers to create per student
                }]
            }));
        }); 
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
          }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={ ROUTES_URL }/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Bus Routes" isRoot={false} isSecond={true} name={this.state.route.name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="align-top">{this.state.route.name}
                                            {/* TODO: Add conditional statement here for if route status is incomplete */}
                                            {/* <span className="badge bg-red ms-2">Incomplete</span> */}
                                        </h5>
                                        <p className="mb-2"><a href={"/schools/" + this.state.route.school?.id}>{this.state.route.school?.name}</a></p>
                                        {/* <span className="badge bg-red mt-0">Incomplete</span> */}
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            <Link to={"/routes/" + this.props.params.id + "/email"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-envelope me-2"></i>
                                                    Send Announcement
                                                </span>
                                            </Link>
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
                                                        <form onSubmit={this.handleDelete}>
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
                                                                <button type="submit" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(this.state.delete_success === -1) ? 
                                    (<div class="alert alert-danger mt-2 mb-2" role="alert">
                                        Unable to delete route. Please correct all errors before deleting.
                                    </div>) : ""
                                }
                                <div className="row mt-4">
                                    <div className="col-7 me-4">
                                        <div className="bg-gray rounded mb-4">
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={this.state.assign_mode} 
                                            active_route={this.props.params.id} 
                                            center={this.state.center}
                                            markers={this.state.markers}/>
                                        </div>
                                        <h6>Description</h6>
                                        <p>
                                            {this.state.route.description}
                                        </p>
                                    </div>
                                    <div className="col">
                                        <h7>STOPS</h7>
                                        {/* <StopsTable data={this.state.stops} showAll={this.state.stops_show_all}/> */}
                                        <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleStopsShowAll}>
                                            { !this.state.stops_show_all ?
                                                "Show All" : "Show Pages"
                                            }
                                        </button>
                                        <div></div>
                                        <h7>STUDENTS</h7>
                                        <RouteStudentsTable data={this.state.students} showAll={this.state.students_show_all}/>
                                        <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleStudentsShowAll}>
                                            { !this.state.students_show_all ?
                                                "Show All" : "Show Pages"
                                            }
                                        </button>
                                        
                                        
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