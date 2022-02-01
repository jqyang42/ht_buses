import React, { Component } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import RouteMap from './route-map';
import { SchoolStudentsTable } from "../tables/school-students-table";
import Geocode from "react-geocode";
import { Navigate } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";

import { GOOGLE_API_KEY } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

Geocode.setApiKey(GOOGLE_API_KEY);
class BusRoutesPlanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            school: [],
            students: [],
            routes: [],
            create_route_name: '',
            create_school_name: '',
            create_route_description: '',
            route_dropdown: [],
            center: {},
            markers: [],
            assign_mode: false,
            active_route: 0
        }
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
        this.handleTableGet(config);       
        this.handleLocationsGet(config);        
    }

    handleTableGet = config => {
        axios.get(API_DOMAIN + `schools/detail?id=` + this.props.params.id, config)  // TODO: use onclick id values
            .then(res => {
                const school = res.data;
                this.setState({ school: school });
                
                if (school.students == null) {
                    this.setState({ students: []}) 
                } else {
                    this.setState({ students: school.students })
                }

                if (school.routes == null) {
                    this.setState({ routes: []})
                } else {
                    this.setState({ routes: school.routes }, () => {
                        let routes = this.state.routes.map(route => {
                            return {value: route.id, display: route.name}
                        })
                        this.setState({ route_dropdown: routes })
                    })
                }                                
            })        
    }
    handleLocationsGet = config => {
        axios.get(API_DOMAIN + `routeplanner?id=` + this.props.params.id, config)
            .then(res => {
                const locations = res.data;
                console.log(locations)
                this.setState({ 
                    center: { 
                        lat: locations.lat, 
                        lng: locations.long 
                    }
                 });
                locations.parents.map((parent, index) => {
                    const studentIDs = [];
                    parent.students.map((student, index) => {
                        studentIDs.push(student.id);
                    });
                    this.setState(prevState => ({
                        markers: [...prevState.markers, {
                            position: {
                                lat: parent.lat,
                                lng: parent.long
                            },
                            id: parent.parent_id,
                            studentIDs: studentIDs,
                            routeID: parent.students[0].route_id //TODO: change markers to create per student
                        }]
                    }));
                });
            });
    }

    handleAssignMode = event => {
        this.setState(prevState => ({ 
            assign_mode: !prevState.assign_mode
        }));
        console.log(this.state.assign_mode);
    }
    
    handleRouteSelection = event => {
        this.setState({ active_route: event.target.value })
        console.log(this.state.active_route)
    }

    handleRouteNameChange = event => {
        this.setState({ create_route_name: event.target.value });
    }

    // handleSchoolNameChange = event => {
    //     this.setState({ create: { school_name: event.target.value }});
    // }

    handleRouteDescriptionChange = event => {
        this.setState({ create_route_description: event.target.value });
    }

    handleRouteCreateSubmit = event => {
        event.preventDefault();

        const route = {
            route_name: this.state.create_route_name,
            school_name: this.state.school.name,
            route_description: this.state.create_route_description
        }
        
        console.log(route)

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.post(API_DOMAIN + 'routes/create', route, config)
            .then(res => {
                // TODO: UPDATE WITH RES
                this.setState({ route_dropdown: [...this.state.routes, {
                    value: route.id,
                    display: route.route_name
                }]}, this.updateDropdown)
            })
    }
    
    students = {"students":[]};

    handleRouteIDChange = (students) => {
      this.students["students"] = students
      console.log(this.students)
    }

    handleRouteAssignSubmit = event => {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        this.setState({
            assign_mode: false
        })
        axios.put(API_DOMAIN + 'routeplanner/edit', this.students, config)
        .then(res => {
            console.log(res.data);
            this.students = {"students":[]};
            this.handleTableGet(config) 
            this.handleLocationsGet(config)
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
                        <HeaderMenu root="Schools" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.school.name} page="Route Planner" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <h5>{this.state.school.name}</h5>
                                    <p>{this.state.school.address}</p>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-7 me-4">
                                        <h7 className="text-muted text-small track-wide">PLAN ROUTES</h7>
                                        {!this.state.assign_mode ? 
                                        <div className="row d-flex mt-2 align-items-center align-middle">
                                            <div className="col-auto float-start my-auto align-self-center">
                                                {/* Add Route button */}
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                    Add Route
                                                </button>

                                                {/* Modal for Add Route form */}
                                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Add Route</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <form onSubmit={this.handleRouteCreateSubmit}>
                                                                <div className="modal-body">
                                                                    <div className="form-group pb-3 required">
                                                                        <label for="route-name" className="control-label pb-2">Name</label>
                                                                        <input type="name" className="form-control" id="route-name" required
                                                                        placeholder="Enter route name" onChange={this.handleRouteNameChange}></input>
                                                                    </div>
                                                                    <div className="form-group pb-3 required">
                                                                        <label for="route-school" className="control-label pb-2">School</label>
                                                                        <select className="form-select" id="route-school" placeholder="Select a School" aria-label="Select a School" disabled>
                                                                            <option>Select a School</option>
                                                                            <option selected value="1">{this.state.school.name}</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label for="route-description" className="control-label pb-2">Description</label>
                                                                        <textarea type="description" className="form-control textarea-autosize pb-2" id="route-description" placeholder="Enter route description" onChange={this.handleRouteDescriptionChange}></textarea>
                                                                    </div>   
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                    <button type="submit" className="btn btn-primary">Create</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TODO: Ensure that this dropdown is consistent with the dropdown in the assign mode ON div */}
                                            <div className="col justify-content-end">
                                                <select className="w-50 form-select float-end" placeholder="Select a Route" aria-label="Select a Route" onChange={this.handleRouteSelection}>
                                                    <option selected value={0}>Select a Route</option>
                                                    <option selected value={0}>Unassign Student</option>
                                                    {this.state.route_dropdown.map(route => 
                                                        <option value={route.value} id={route.display}>{route.display}</option>
                                                    )}
                                                </select>
                                            </div>

                                            {/* Assign button */}
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-primary" onClick={this.handleAssignMode}>Assign</button>
                                            </div>
                                        </div>
                                        :
                                        <div className="row d-flex align-items-center align-middle mt-2">
                                            {/* Assign mode on label */}
                                            <div className="col float-start align-items-center align-text-center">
                                                <p className="align-self-center align-text-center align-middle my-auto">Assign mode on</p>
                                            </div>

                                            {/* TODO: Ensure that this dropdown still reads the same content as the dropdown in the assign mode OFF div  */}
                                            <div className="col justify-content-end align-self-center">
                                                <select className="form-select float-end me-1" placeholder="Select a Route" aria-label="Select a Route" onChange={this.handleRouteSelection} disabled>
                                                    <option selected value={0}>Select a Route</option>
                                                    <option selected value={0}>Unassign Student</option>
                                                    {this.state.route_dropdown.map(route => 
                                                        <option value={route.value} id={route.display}>{route.display}</option>
                                                    )}
                                                </select>
                                            </div>
                                            <div className="col-auto align-self-center">
                                                
                                                <div className="row d-flex float-end me-0">
                                                    {/* <select className="w-50 form-select float-end me-3" placeholder="Select a Route" aria-label="Select a Route" onChange={this.handleRouteSelection}>
                                                        <option selected value={0}>Select a Route</option>
                                                        <option selected value={0}>Unassign Student</option>
                                                        {this.state.route_dropdown.map(route => 
                                                            <option value={route.value} id={route.display}>{route.display}</option>
                                                        )}
                                                    </select> */}
                                                    {/* TODO: Change onClick handler to dismiss */}
                                                    <button type="button" className="btn btn-secondary w-auto me-3" onClick={this.handleAssignMode}>Cancel</button>
                                                    {/* TODO: Change onClick handler to save changes */}
                                                    <button type="button" className="btn btn-primary float-end w-auto me-0" onClick={this.handleRouteAssignSubmit}>
                                                        Save
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Cancel and Save buttons */}
                                            {/* <div className="col-auto">
                                                <div className="row d-inline-flex"> */}
                                                    {/* TODO: Change onClick handler to dismiss */}
                                                    {/* <button type="button" className="btn btn-secondary" onClick={this.handleAssignMode}>Cancel</button> */}
                                                    {/* TODO: Change onClick handler to save changes */}
                                                    {/* <button type="button" className="btn btn-primary float-end w-auto me-3" onClick={this.handleRouteAssignSubmit}> */}
                                                        {/* Save
                                                    </button>
                                                </div>
                                            </div> */}
                                        </div>
                                        }

                                        {/* Map Interface */}
                                        <div className="bg-gray rounded mt-3">
                                            <RouteMap
                                            assign_mode={this.state.assign_mode} 
                                            key={this.state.assign_mode} 
                                            active_route={this.state.active_route} 
                                            center={this.state.center}
                                            markers={this.state.markers}
                                            onChange={this.handleRouteIDChange}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <SchoolStudentsTable data={this.state.students}/>
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

function RouteSelectDropdown() { 
    let routes = this.state.routes(route => {
        return {value: route.id, display: route.name}
    })
    console.log(routes)
    this.setState({ route_dropdown: routes })
}

export default (props) => (
    <BusRoutesPlanner
        {...props}
        params={useParams()}
    />
);
// export default BusRoutesPlanner;