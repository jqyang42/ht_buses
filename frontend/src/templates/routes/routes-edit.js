import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navigate } from "react-router";
import { useParams } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class BusRoutesEdit extends Component {
    state = {
        route_name: '',
        route_description: '',
        school_id: '',
        route: [],
        redirect: false,
        edit_success: 0,
        error_status: false,
        error_code: 200
    }

    handleRouteNameChange = event => {
        this.setState({ route_name: event.target.value });
    }

    handleDescriptionChange = event => {
        this.setState({ route_description: event.target.value });
    }

    handleSubmit = event => {
        event.preventDefault();

        const route = {
            route: {
                name: this.state.route_name,
                description: this.state.route_description,
            }
        }
        
        api.put(`routes/edit?id=${this.props.params.id}`, route)  // TODO: use onclick id value
            .then(res => {
                const success = res.data.success
                this.setState({ edit_success: success})
                if (success) {
                    this.setState({ redirect: true });
                }
            })
        
    }

    componentDidMount() {
        var self = this
        
        api.get(`routes/detail?id=${this.props.params.id}`)  // TODO: use onclick id values
        .then(res => {
            const route = res.data.route;
            this.setState({ 
                route: route, 
                route_description: route.description, 
                route_name: route.name,
                school_id: route.school.id,
                edit_success: 0
            });
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
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = ROUTES_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
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
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to edit route details. Please correct all errors before submitting.
                                        </div>) : ""
                                    }
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