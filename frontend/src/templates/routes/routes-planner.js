import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import RouteMap from './route-map';
import { SchoolStudentsTable } from "../tables/school-students-table";
import Geocode from "react-geocode";
import { Navigate } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";

import { GOOGLE_API_KEY } from "../../constants";
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
            active_route: 0,
            error_status: false,
            error_code: 200
        }
    }

    // handleLogout = event => {
    //     event.preventDefault();
    //     const creds = {
    //         user_id: sessionStorage.getItem('user_id')
    //     }

    //     axios.post(API_DOMAIN + `logout`, creds)
    //     .then(res => {
    //         this.setState({token: '', message: res.data.message})
    //         sessionStorage.setItem('token', '')
    //         sessionStorage.setItem('user_id', '')
    //         sessionStorage.setItem('first_name', '')
    //         sessionStorage.setItem('last_name', '')
    //         sessionStorage.setItem('is_staff', false)
    //         sessionStorage.setItem('logged_in', false)
    //         // console.log(sessionStorage.getItem('logged_in'))
    //         // console.log(sessionStorage.getItem('token'))
    //         window.location.reload()
    //     })
    // }


    componentDidMount() {
        this.handleTableGet();       
        this.handleLocationsGet();     
    }

    handleTableGet = () => {
        var self = this
        
        api.get(`schools/detail?id=${this.props.params.id}`)
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
                            return {
                                id: route.id, 
                                name: route.name
                            }
                        })
                        this.setState({ route_dropdown: routes })
                    })
                }                                
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
    handleLocationsGet = () => {
        var self = this

        api.get(`routeplanner?id=${this.props.params.id}`)
            .then(res => {
                const locations = res.data;
                // console.log(locations)
                this.setState({ 
                    center: { 
                        lat: locations.lat, 
                        lng: locations.long 
                    }
                 });
                locations.parents.map((parent, index) => {
                    const studentIDs = [];
                    const studentNames = [];
                    parent.students.map((student, index) => {
                        studentIDs.push(student.id);
                        const fullName = student.first_name + ' ' + student.last_name;
                        studentNames.push(fullName);
                    });
                    this.setState(prevState => ({
                        markers: [...prevState.markers, {
                            position: {
                                lat: parent.lat,
                                lng: parent.long
                            },
                            id: parent.parent_id,
                            studentIDs: studentIDs,
                            studentNames: studentNames,
                            routeID: parent.students[0].route_id //TODO: change markers to create per student
                        }]
                    }));
                });
            }).catch (function(error) {
                // console.log(error.response)
                if (error.response.status === 404) {
                    // console.log(error.response.data)
                    self.setState({ error_status: true });
                }
            } 
            );
    }

    handleAssignMode = event => {
        this.setState(prevState => ({ 
            assign_mode: !prevState.assign_mode
        }));
        // console.log(this.state.assign_mode);
    }
    
    handleRouteSelection = event => {
        this.setState({ active_route: parseInt(event.target.value) })
        console.log(this.state.active_route)
        console.log(this.state.route_dropdown)
        // this.setState({ active_route: event.target.value }, () => // console.log("onHandleRouteSelection active_route: " + this.state.active_route))
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
        api.post(`routes/create`, route)
            .then(res => {
                const new_route = res.data.data.route
                // // console.log(new_route)
                this.setState({ route_dropdown: [...this.state.routes, {
                    id: new_route.id,
                    name: new_route.name
                }]})
                this.handleLocationsGet()
            })
    }


    
    students = {"students":[]};

    handleRouteIDChange = (students) => {
      this.students["students"] = students
      // console.log(this.students)
    }

    handleRouteAssignSubmit = event => {
        this.setState({
            assign_mode: false
        })

        api.put('routeplanner/edit', this.students)
        .then(res => {
            // console.log(res.data);
            this.students = {"students":[]};
            this.setState({markers: []})
            this.handleTableGet() 
            this.handleLocationsGet()
        })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
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
                                                                        <option value="" disabled selected>Select a School</option>
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
                                                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Create</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TODO: Ensure that this dropdown is consistent with the dropdown in the assign mode ON div */}
                                            <div className="col justify-content-end">
                                                <select className="w-50 form-select float-end" placeholder="Select a Route" aria-label="Select a Route" onChange={this.handleRouteSelection}>
                                                    <option selected value={0}>Select a route to assign</option>
                                                    <option value={0}>No Route</option>
                                                    {this.state.route_dropdown.map(route => 
                                                        <option value={route.id}>{route.name}</option>
                                                    )}
                                                </select>
                                            </div>

                                            {/* Assign button */}
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-primary" onClick={this.handleAssignMode}>Switch to Assign Mode</button>
                                            </div>
                                        </div>
                                        :
                                        <div className="row d-flex align-items-center align-middle mt-2">
                                            {/* Assign mode on label */}
                                            <div className="col float-start align-items-center align-text-center">
                                                <p className="align-self-center align-text-center align-middle my-auto yellow-600 ">Assign mode on</p>
                                            </div>

                                            {/* TODO: Ensure that this dropdown still reads the same content as the dropdown in the assign mode OFF div  */}
                                            <div className="col justify-content-end align-self-center">
                                                <select className="form-select float-end me-1" placeholder="Select a Route" aria-label="Select a Route" onChange={this.handleRouteSelection} disabled>
                                                    <option selected value={0}>No Route</option>
                                                    <option selected value={0}>No Route</option>
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

                                        {(this.state.assign_mode) ? 
                                            (<div>
                                                <div class="alert alert-primary mt-3 mb-2" role="alert">
                                                    <i className="bi bi-info-circle-fill me-2"></i>
                                                    Click on a location marker to add it to this route!
                                                </div>
                                            </div>) : ""
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
                                        {
                                            this.state.active_route === 0 ? "" :
                                            <>
                                                <h7>STOPS</h7>
                                                <div></div>
                                                {/* <StopsTable data={this.state.stops} showAll={this.state.stops_show_all}/> */}
                                                <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleStopsShowAll}>
                                                    { !this.state.stops_show_all ?
                                                        "Show All" : "Show Pages"
                                                    }
                                                </button>
                                                <div></div>
                                            </>
                                        }
                                        
                                        <h7>STUDENTS</h7>
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
    this.setState({ route_dropdown: routes })
}

export default (props) => (
    <BusRoutesPlanner
        {...props}
        params={useParams()}
    />
);
// export default BusRoutesPlanner;