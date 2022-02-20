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
import { makeRoutesDropdown } from "../components/dropdown";
import { StopsTable }  from "../tables/stops-table";
import { getStopTimes } from "./route-time-calc";

Geocode.setApiKey(GOOGLE_API_KEY);
class BusRoutesPlanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            school: [],
            students: [],
            routes: [],
            stops: null,
            create_route_name: '',
            create_school_name: '',
            create_route_description: '',
            route_dropdown: [],
            center: {},
            markers: [],
            assign_mode: false,
            assign_mode_warning: false,
            active_route: 0,
            add_route_success: false,
            error_status: false,
            error_code: 200,
            stops_edit_mode: false,
            dnd: false,
            stops_order: [],
        }
    }

    componentDidMount() {
        this.handleTableGet();       
        this.handleLocationsGet();     
        if (this.state.active_route !== 0) { this.handleStopsGet(this.state.active_route) };
        makeRoutesDropdown({ school_id: this.props.params.id }).then(ret => {
            this.setState({ route_dropdown: ret })
        })
    }

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

    switchStopsEditMode = () => {
        this.setState(prevState => ({
            stops_edit_mode: !prevState.stops_edit_mode
        }))
        this.setState(prevState => ({
            dnd: !prevState.dnd
        }))
    }

    handleReorder = (new_order) => {
        this.setState({ stops_order: new_order })
    }

    submitStopsOrder = () => {
        this.switchStopsEditMode()
        // TODO: add axios get for stops reordering @jessica
        
    }

    handleTableGet = () => {        
        api.get(`schools/detail?id=${this.props.params.id}`)
            .then(res => {
                const data = res.data
                console.log(data)
                this.setState({ 
                    school: data.school,
                    students: data.students,
                    routes: data.routes
                });         
            }).catch (error => {
                // console.log(error.response)
                if (error.response.status !== 200) {
                    // console.log(error.response.data)
                    this.setState({ error_status: true });
                    this.setState({ error_code: error.response.status });
                }
            } 
            )        
    }

    handleLocationsGet = () => {
        api.get(`routeplanner?id=${this.props.params.id}`)
            .then(res => {
                console.log(res.data)
                const school_location = res.data.school.location;
                this.setState({ 
                    center: { 
                        lat: school_location.lat, 
                        lng: school_location.long 
                    }
                 });
                const users = res.data.users
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
                            location: {
                                lat: user.location.lat,
                                lng: user.location.long
                            },
                            id: user.id,
                            studentIDs: studentIDs,
                            studentNames: studentNames,
                            routeID: user.students[0].route_id //TODO: change markers to create per student //TODO: Fix 
                        }]
                    }));
                });
            }).catch (error => {
                console.log(error.response)
                if (error.response.status === 404) {
                    this.setState({ error_status: true });
                }
            } 
            );
    }

    handleStopsGet = (active_route) => {
        api.get(`stops?id=${active_route}`)
        .then(res => {
            const data = res.data;
            this.setState({ stops: data.stops }, () => {
                if (data.stops.length !== 0) {
                    this.handleStopTimeCalc()
                }            
            })
        })
        .catch (error => {
            if (error.response.status !== 200) {
                this.setState({ error_status: true });
                this.setState({ error_code: error.response.status });
            }
        } 
        )
    }

    handleStopTimeCalc = () => {
        const school = this.state.school
        const stops = [...this.state.stops]
        stops.sort((a, b) => a.order_by - b.order_by)
        const stops_latlng = stops.filter(stop => stop.order_by !== 1).map(stop => {
            return {
                location: { lat: stop.location.lat, lng: stop.location.long }
            }
        })
        
        getStopTimes({
            first_stop: { lat: stops[0]?.location.lat, lng: stops[0]?.location.long },
            school: { lat: school.location.lat, lng: school.location.long },
            stops: stops_latlng,
            arrival_time: school.arrival,
            departure_time: school.departure
        }).then(res => this.updateStopTimes(res))
    }

    updateStopTimes = (stop_times) => {
        const stops = [...this.state.stops]
        const new_stops = stops.map(stop => {
            return {
                ...stop,
                arrival: stop_times[stop.order_by - 1].pickup,
                departure: stop_times[stop.order_by - 1].dropoff
            }
        })
        this.setState({ stops: new_stops }) // @jessica TODO update correct state to allow pushing to backend
    }

    handleAssignMode = event => {
        this.setState({assign_mode_warning: false})
        this.setState(prevState => ({ 
            assign_mode: !prevState.assign_mode
        }));
    }

    triggerAssignModeWarning = event => {
        this.setState({ 
            assign_mode_warning: true
        });
    }
    
    handleRouteSelection = event => {
        if (this.state.assign_mode_warning) { this.setState({ assign_mode_warning: false }) };
        this.setState({ active_route: parseInt(event.target.value) })
        this.handleStopsGet(parseInt(event.target.value))
    }

    handleRouteNameChange = event => {
        this.setState({ create_route_name: event.target.value });
    }

    handleRouteDescriptionChange = event => {
        this.setState({ create_route_description: event.target.value });
    }

    resetAddRouteSuccess = event => {
        this.setState({ add_route_success: false })
        this.clearAddRouteForm()
    }

    handleRouteCreateSubmit = event => {
        event.preventDefault();

        const route = {
            name: this.state.create_route_name,
            school_id: this.props.params.id,
            description: this.state.create_route_description,
            is_complete: false  // TODO ACTUALLY CALCULATE
        }
        const data = {
            'route': route
        }
        api.post(`routes/create`, data)
            .then(res => {
                const new_route = res.data.route
                this.setState({ add_route_success: true })

                makeRoutesDropdown({ school_id: this.props.params.id }).then(ret => {
                    this.setState({ route_dropdown: ret })
                })

                this.handleLocationsGet()
            })
        this.clearAddRouteForm()
    }

    clearAddRouteForm = (event) => {
        document.getElementById("add-route-form").reset();
    }

    students = {"students":[]};
    stops = {"stops": []};
    handleRouteIDChange = (students) => {
      this.students["students"] = students;
    }

    handleRouteStopChange = (stops) => {
        this.stops["stops"] = stops;
        console.log("new stops")
        console.log(this.stops)
    }

    handleAssignModeSave = event => {
        this.setState({
            assign_mode: false,
        })

        api.put('routeplanner/edit', this.students)
        .then(res => {
            this.students = {"students":[]};
            this.setState({markers: []})
            this.handleTableGet() 
            this.handleLocationsGet()
        })
        console.log("sent stops")
        console.log(this.stops)
        api.post('stops/create', this.stops)
        .then(res => {
            this.stops = {"stops":[]};
            this.handleTableGet() 
            this.handleLocationsGet()
            this.handleStopsGet(this.state.active_route)
        })

        // handle editting orig stops, creating new stops @jessica
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
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.resetAddRouteSuccess}></button>
                                                            </div>
                                                            <form id="add-route-form" onSubmit={this.handleRouteCreateSubmit}>
                                                                <div className="modal-body">
                                                                    <div className="form-group pb-3 required">
                                                                        <label for="route-name" className="control-label pb-2">Name</label>
                                                                        <input type="name" className="form-control" id="route-name" required defaultValue=""
                                                                        placeholder="Enter route name" onChange={this.handleRouteNameChange}></input>
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label for="route-description" className="control-label pb-2">Description</label>
                                                                        <textarea type="description" className="form-control textarea-autosize pb-2" id="route-description"  defaultValue="" placeholder="Enter route description" onChange={this.handleRouteDescriptionChange}></textarea>
                                                                    </div>   
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.resetAddRouteSuccess}>Cancel</button>
                                                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Create</button>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TODO: Ensure that this dropdown is consistent with the dropdown in the assign mode ON div */}
                                            <div className="col justify-content-end">
                                                <select className="w-50 form-select float-end" placeholder="Select a Route" aria-label="Select a Route" onChange={this.handleRouteSelection} required>
                                                    <option selected value={0}>Select a route to assign</option>
                                                    {/* <option value={0}>No Route</option> */}
                                                    {this.state.route_dropdown.map(route => 
                                                        <option value={route.value} id={route.display}>{route.display}</option>
                                                    )}
                                                </select>
                                            </div>

                                            {/* Assign button */}
                                            <div className="col-auto">
                                                <button type="button" className="btn btn-primary" onClick={this.state.active_route === 0 ? this.triggerAssignModeWarning : this.handleAssignMode}>Switch to Assign Mode</button>
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
                                                    {/* <option selected value={0}>No Route</option> */}
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
                                                    <button type="button" className="btn btn-primary float-end w-auto me-0" onClick={this.handleAssignModeSave}>
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

                                        {(this.state.add_route_success) ? 
                                            (<div>
                                                <div class="alert alert-success mt-3 mb-2" role="alert">
                                                    Route successfully added to {this.state.school.name}
                                                </div>
                                            </div>) : ""
                                        }

                                        {(this.state.assign_mode_warning) ? 
                                            (<div>
                                                <div class="alert alert-danger mt-3 mb-2" role="alert">
                                                    Please select a route before switching to assign mode.
                                                </div>
                                            </div>) : ""
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
                                            students={this.state.markers}
                                            existingStops={this.state.stops}
                                            onChange={this.handleRouteIDChange}
                                            handleStopCreation={this.handleRouteStopChange}/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h7>STUDENTS</h7>
                                        <SchoolStudentsTable data={this.state.students}/>
                                        <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleStudentsShowAll}>
                                            { !this.state.students_show_all ?
                                                "Show All" : "Show Pages"
                                            }
                                        </button>

                                        {
                                            this.state.active_route === 0 ? "" : this.state.stops ?
                                            <>
                                                <div className="row d-flex justify-content-between align-items-center mb-2">
                                                    <h7 className="col w-auto">STOPS</h7>
                                                    <div className="col float-end">
                                                        {
                                                            this.state.stops_edit_mode ?
                                                            <button className="btn btn-primary float-end w-auto" onClick={this.submitStopsOrder}>
                                                                <span className="btn-text">
                                                                    Save
                                                                </span>
                                                            </button>
                                                            :
                                                            <button className="btn btn-primary float-end w-auto" onClick={this.switchStopsEditMode}>
                                                                <span className="btn-text">
                                                                    <i className="bi bi-pencil-square me-2"></i>
                                                                    Edit
                                                                </span>
                                                            </button>
                                                        }
                                                    </div> 
                                                </div>
                                                <StopsTable data={this.state.stops || []} showAll={this.state.stops_show_all} dnd={this.state.dnd} handleReorder={this.handleReorder}/>
                                                <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleStopsShowAll}>
                                                    { !this.state.stops_show_all ?
                                                        "Show All" : "Show Pages"
                                                    }
                                                </button>
                                                <div></div>
                                            </> : ""
                                        }
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

// function RouteSelectDropdown() { 
//     let routes = this.state.routes(route => {
//         return {value: route.id, display: route.name}
//     })
//     this.setState({ route_dropdown: routes })
// }

export default (props) => (
    <BusRoutesPlanner
        {...props}
        params={useParams()}
    />
);
// export default BusRoutesPlanner;