import axios from "axios";
import React, { Component } from "react";
import { HT_LOGO } from "../../constants";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";

import { INDEX_URL } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class BusRoutesEdit extends Component {
    state = {
        route_name: '',
        route_description: '',
        route: [],
        redirect: false,
    }
    // 0 = not submitted, 1 = success, -1 = failure
    edit_success = 0

    handleRouteNameChange = event => {
        this.setState({ route_name: event.target.value });
    }

    handleDescriptionChange = event => {
        this.setState({ route_description: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        const route = {
            route_name: this.state.route_name,
            route_description: this.state.route_description,
        }
        
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        
        console.log(route)

        axios.put(API_DOMAIN + `routes/edit?id=` + this.props.params.id, route, config)  // TODO: use onclick id value
            .then(res => {
                const msg = res.data.data.message
                if (msg == 'route updated successfully') {
                    this.edit_success = 1     // TODO ERROR: edit_success?
                    console.log(this.edit_success)
                } else {
                    this.edit_success = -1      // TODO ERROR
                }
            })
        this.setState({ redirect: true });
    }

    handleLogout = event => {
        event.preventDefault();
        const creds = {
            user_id: sessionStorage.getItem('user_id')
        }
        
        axios.post(API_DOMAIN + `logout`, creds)
        .then(res => {
            this.setState({token: '', message: res.data.message})
            sessionStorage.setItem('token', '')
            sessionStorage.setItem('user_id', '')
            sessionStorage.setItem('first_name', '')
            sessionStorage.setItem('last_name', '')
            sessionStorage.setItem('is_staff', false)
            sessionStorage.setItem('logged_in', false)
            console.log(sessionStorage.getItem('logged_in'))
            console.log(sessionStorage.getItem('token'))
            window.location.reload()
        })
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
            this.setState({ route: route, route_description: route.description, route_name: route.name });
        })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = ROUTES_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                            <a href={INDEX_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                            </a>

                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                <li className="nav-item">
                                    <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-list-ul me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Students</span>
                                    </a>
                                </li>
                                <li className="nav-item active">
                                    <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-building me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Schools</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-people me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="w-100 px-auto pb-1 d-flex justify-content-around">
                                <button className="btn btn-primary w-75 mb-4 mx-auto" role="button" onClick={this.handleLogout}>
                                    Log Out
                                </button> 
                            </div>
                        </div>
                    </div>

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
                                            <a href={"/routes/" + this.props.params.id}><h5>{this.state.route.name}</h5></a>
                                            {/* TODO: change href to refer to specific route url */}
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>Edit Route</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                    <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
                                </div>
                            </div>
                        </div>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit Route</h5>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">

                                            {/* TODO: change this.props.params.id to SCHOOL id, not ROUTE id */}
                                            <Link to={"/schools/" + this.props.params.id + "/routes-planner"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                                    Route Planner
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputName1" className="control-label pb-2">Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputName1"
                                                    defaultValue={this.state.route.name} placeholder="Enter route name" required
                                                    onChange={this.handleRouteNameChange}></input>
                                            </div>
                                            {/* DELETE WITH VARIANCE REQUEST
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School">
                                                    <option>Select a School</option>
                                                    <option selected value="1">Test School</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>  */}
                                            <div className="form-group pb-3 w-75">
                                                <label for="exampleInputDescription1" className="control-label pb-2">Description</label>
                                                <textarea type="description" className="form-control textarea-autosize pb-2" 
                                                id="exampleInputDescription1" defaultValue={this.state.route.description}
                                                placeholder="Enter route description" 
                                                onChange={this.handleDescriptionChange}></textarea>
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                {/* <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button> */}
                                                <Link to={"/routes/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
                                                <button type="submit" className="btn btn-primary w-auto me-0 justify-content-end">Update</button>
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
    <BusRoutesEdit
        {...props}
        params={useParams()}
    />
);