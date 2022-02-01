import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";

import { LOGIN_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class BusRoutesEdit extends Component {
    state = {
        route_name: '',
        route_description: '',
        school_id: '',
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

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        
        axios.get(API_DOMAIN + `routes/detail?id=` + this.props.params.id, config)  // TODO: use onclick id values
        .then(res => {
            const route = res.data;
            this.setState({ 
                route: route, 
                route_description: route.description, 
                route_name: route.name,
                school_id: route.school.id
            });
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
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Bus Routes" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.route.name} page="Edit Route" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit Route</h5>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">

                                            {/* TODO: change this.props.params.id to SCHOOL id, not ROUTE id */}
                                            <Link to={"/schools/" + this.state.school_id + "/routes-planner"} className="btn btn-primary float-end w-auto me-3" role="button">
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