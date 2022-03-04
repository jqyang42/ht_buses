import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import RouteMap from './route-map';
import { SchoolStudentsTable } from "../tables/school-students-table";
import Geocode from "react-geocode";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { GOOGLE_API_KEY } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { GOOGLE_MAP_URL } from "../../constants";
import { makeRoutesDropdown } from "../components/dropdown";
import { StopsTable }  from "../tables/stops-table";
import { getStopInfo } from "./route-time-calc";

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
            students_page: [],
            students_table: {
                pageIndex: 1,
                canPreviousPage: null,
                canNextPage: null,
                totalPages: null,
                // sortOptions: {},
                // searchValue: ''
            },
            modal_dismiss: false,
            route_complete: 0,
            map_redirect_arriving: [],
            map_redirect_departing: [],
        }
    }

    componentDidMount() {
        const reloadCount = localStorage.getItem('reloadCount');
        if(reloadCount < 2) {
        localStorage.setItem('reloadCount', String(reloadCount + 1));
        window.location.reload();
        } else {
        localStorage.removeItem('reloadCount');
        }
        this.handleTableGet();       
        this.handleLocationsGet();
        this.getStudentsPage(this.state.students_table.pageIndex, null, '') 
        
        if (this.state.active_route !== 0) { this.handleStopsGet() };
        
        makeRoutesDropdown({ school_id: this.props.params.id }).then(ret => {
            this.setState({ route_dropdown: ret })
        })
    }

    // pagination
    getStudentsPage = (page, sortOptions, search) => {
        getPage({ url: `students/school`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}` })
        .then(res => {
            const students_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
                // sortOptions: sortOptions,
                // searchValue: search
            }
            this.setState({
                students_page: res.data.students,
                students_table: students_table
            })
        })
    }

    handleStudentsShowAll = () => {
        this.setState(prevState => ({
            students_show_all: !prevState.students_show_all
        }), () => {
            this.getStudentsPage(this.state.students_show_all ? 0 : 1, null, '')
        })
    }

    handleStopsShowAll = () => {
        this.setState(prevState => ({
            stops_show_all: !prevState.stops_show_all
        }))
    }

    handleReorder = (new_order) => {
        console.log(new_order)
        this.setState({ stops_order: new_order })
    }

    switchStopsEditMode = () => {
        this.setState(prevState => ({
            stops_edit_mode: !prevState.stops_edit_mode
        }))
        this.setState(prevState => ({
            dnd: !prevState.dnd
        }))
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
        this.getStudentsPage(this.state.students_table.pageIndex, null, '') 
    }

    handleLocationsGet = () => {
        api.get(`routeplanner?id=${this.props.params.id}`)
            .then(res => {
                console.log(res.data)
                const school_location = res.data.school.location;
                this.setState({ 
                    center: { 
                        lat: school_location.lat, 
                        lng: school_location.lng 
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
                                lng: user.location.lng
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

    handleStopsGet = () => {
        api.get(`stops?id=${this.state.active_route}`)
            .then(res => {
            const stops = res.data.stops;
            const is_complete = res.data.route.is_complete
            if (stops.length !== 0) {
                console.log(stops)
                this.handleStopTimeCalc(stops)
                .then(res => {
                    this.editStops(res)
                    this.setState({ 
                        stops: res,
                        route_complete: is_complete ? 1 : -1
                     })
                     this.redirectToGoogleMapsArriving(this.state.stops)
                     this.redirectToGoogleMapsDeparting(this.state.stops)
                })
            } else {
                this.setState({ 
                    stops: stops,
                    route_complete: is_complete ? 1 : -1,
                })
            }
        })
        .catch (error => {
            if (error.response.status !== 200) {
                this.setState({ error_status: true,
                    error_code: error.response.status 
                });
            }
        } 
        )
        console.log(this.state.stops)
    }

    handleAssignMode = event => {
        this.setState({assign_mode_warning: false, add_route_success: false})
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
        if (this.state.assign_mode_warning) { 
            this.setState({ assign_mode_warning: false }) 
        };
        this.setState({ add_route_success: false})
        if (parseInt(event.target.value) !== 0) {
            this.setState({ active_route: parseInt(event.target.value) }, () => this.handleStopsGet())
        } else {
            this.setState({ route_complete: 0 })
        }
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

    handleRouteCreateSubmit = (event) => {
        
        if(this.state.create_route_name === "") {
            event.preventDefault();
            return 
        }
        else {
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
                this.setState({ add_route_success: true })

                makeRoutesDropdown({ school_id: this.props.params.id }).then(ret => {
                    this.setState({ route_dropdown: ret })
                })
                this.setState({ modal_dismiss: true})
                this.handleLocationsGet()
            })
        this.clearAddRouteForm()
        }
    }

    clearAddRouteForm = (event) => {
        
        document.getElementById("add-route-form").reset();
    }

    redirectToGoogleMapsArriving = (stops) => {
        this.setState({map_redirect_arriving: []})
        let arrivingLinks = []
        for (let i=0; i < stops.length; i+=10 ) {
            let map_redirect_arriving = GOOGLE_MAP_URL
            map_redirect_arriving += '&waypoints='
            let j;
            for (j = i; j < i + 9 && j < stops.length; j+=1) {
                console.log(stops[j])
                map_redirect_arriving += stops[j].location.lat + ',' + stops[j].location.lng +'|'
            }
            if (j == stops.length) {
                map_redirect_arriving += '&destination=' + this.state.center.lat + ',' + this.state.center.lng 
            } else {
                map_redirect_arriving += '&destination=' + stops[j].location.lat + ',' + stops[j].location.lng
            }
            console.log(map_redirect_arriving)
            arrivingLinks.push(map_redirect_arriving)
        }
        this.setState({
            map_redirect_arriving: arrivingLinks
        })
    }

    redirectToGoogleMapsDeparting = (stops) => {
        let reversed_stops = stops.slice().reverse();
        let departingLinks = []
        let i;
        for (i = 0; i < reversed_stops.length-1; i+=10 ) {
            let map_redirect_departing = GOOGLE_MAP_URL 
            if (i == 0) {
                map_redirect_departing += 'origin=' + this.state.center.lat + ',' + this.state.center.lng 
            }
            map_redirect_departing +=  '&waypoints=';
            let j;
            for (j = i; j < i + 9 && j < stops.length-1; j+=1) {
                console.log(reversed_stops)
                map_redirect_departing += reversed_stops[j].location.lat + ',' + reversed_stops[j].location.lng +'|'
            }
            //Think about cases where this could be in its own link
            map_redirect_departing += '&destination=' + reversed_stops[j].location.lat + ',' + reversed_stops[j].location.lng
            departingLinks.push(map_redirect_departing)
        }
        console.log(departingLinks)
        this.setState({map_redirect_departing: departingLinks})
    }

    students = {"students":[]};
    newStops = {"stops": []};
    editedStops = {"stops": []};
    handleRouteIDChange = (students) => {
      this.students["students"] = students;
    }

    handleNewStopsChange = (stops) => {
        this.newStops["stops"] = stops;
        console.log("new stops")
        console.log(this.newStops)
    }

    handleRouteStopModification = (stops) => {
        this.editedStops["stops"] = stops;
        console.log("edited stops")
        console.log(this.editedStops)
    }

    delete_orig_stop_ids = {'stops': []}
    handleOrigStopsDeletion = (stop_ids) => {
        const deletion_ids = stop_ids.map(id => {
            return { 'id': id }
        })
        console.log(deletion_ids)
        this.delete_orig_stop_ids["stops"] = deletion_ids;
    }

    handleAssignModeSave = event => {
        event.preventDefault();
        console.log("saved!")
        this.setState({
            assign_mode: false,
        })

        api.put('routeplanner/edit', this.students)
        .then(
            res => {
            this.students = {"students":[]};
            this.setState({markers: []})            
            api.put('stops/edit-name', this.editedStops)
            .then(res => {  
                console.log(this.editedStops)
                this.editedStops = {"stops":[]};
                api.post('stops/create', this.newStops)
                .then(res => {
                    this.newStops = {"stops":[]};
                    api.delete(`stops/delete`, { data: this.delete_orig_stop_ids })
                    .then(res => {
                        this.delete_orig_stop_ids = {'stops': []}
                        this.handleTableGet() 
                        this.handleLocationsGet()
                        this.handleStopsGet()
                    }).catch(error => {
                        console.log(error)
                    })
                })
            })
        })
    }

    submitStopsOrder = () => {
        this.switchStopsEditMode()
        const order = [...this.state.stops_order]
        const ordered_stops = this.state.stops.slice().map(stop => {
            return {
                ...stop,
                order_by: order.indexOf(stop.id)
            }
        })
        this.handleStopTimeCalc(ordered_stops)
        .then(res => {
            console.log(res)
            this.editStops(res)
            this.setState({ stops: res })
        })
    }

    editStops(stops) {
        const edit_body = {
            stops: stops.map(stop => {
                return {
                    id: stop.id,
                    route_id: this.state.active_route,
                    name: stop.name,
                    arrival: stop.arrival,
                    departure: stop.departure,
                    location: {
                        lat: stop.location.lat,
                        lng: stop.location.lng,
                        address: stop.location.address
                    }
                }
            }            
        )}

        // console.log(edit_body)
        api.put(`stops/edit`, edit_body)
        .then(res => {
            const success = res.data.success
            const new_stops = res.data.stops

            // this.setState({ stops: edit_body })
            // TODO ERROR HANDLING
        })
    }

    async handleStopTimeCalc(stops) {
        // console.log(stops)
        const school = this.state.school
        stops.sort((a, b) => a.order_by - b.order_by)
        // const stops_latlng = stops.map(stop => {
        //     return {
        //         location: { lat: stop.location.lat, lng: stop.location.lng }
        //     }
        // })
        console.log(stops)
        const stop_info = await getStopInfo({
            // first_stop: { lat: stops[0]?.location.lat, lng: stops[0]?.location.lng },
            school: {location : { lat: school.location.lat, lng: school.location.lng }},
            stops: stops,
            arrival_time: school.arrival,
            departure_time: school.departure
        })
        
        console.log(stop_info)
        const updated_stops = this.updateStopInfo(stop_info, stops)
        console.log(updated_stops)
        return updated_stops
    }

    updateStopInfo = (stop_info, orig_stops) => {
        const stop_times = stop_info.stop_times
        const stop_addresses = stop_info.stop_addresses
        console.log(stop_times[orig_stops])
        return orig_stops.map(stop => {
                return {
                ...stop,
                arrival: stop_times[orig_stops.indexOf(stop)].pickup,
                departure: stop_times[orig_stops.indexOf(stop)].dropoff,
                location: {
                    ...stop.location,
                    address: stop_addresses[orig_stops.indexOf(stop)]
                }                
            }
        })
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
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
                                                <div className="modal fade" id="staticBackdrop" show={!this.state.modal_dismiss} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                                                    <button type="submit" className="btn btn-primary" data-bs-dismiss={this.state.modal_dismiss ? "modal" : ""}>Create</button>
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
                                            <div> 
                                            <a href={this.state.map_redirect_departing[1]} rel="noreferrer">
                                                Departing
                                            </a>
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

                                        {(this.state.route_complete === -1) ? 
                                            (<div>
                                                <div class="alert alert-warning mt-3 mb-2" role="alert">
                                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                                    This route is currently incomplete. All students assigned to this route must be within range of a bus stop in order for it to be considered complete.
                                                </div>
                                            </div>) : ""
                                        }

                                        {(this.state.assign_mode) ? 
                                            (<div>
                                                <div class="alert alert-primary mt-3 mb-2" role="alert">
                                                    <i className="bi bi-info-circle-fill me-2"></i>
                                                        Click on a location marker to add students to this route. Click any location on the map to add a new stop there.
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
                                            handleUpdateNewStops={this.handleNewStopsChange}
                                            handleDeleteOrigStops={this.handleOrigStopsDeletion}
                                            handleStopModification={this.handleRouteStopModification}
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h7>STUDENTS</h7>
                                        <SchoolStudentsTable 
                                        data={this.state.students_page} 
                                        showAll={this.state.students_show_all}
                                        pageIndex={this.state.students_table.pageIndex}
                                        canPreviousPage={this.state.students_table.canPreviousPage}
                                        canNextPage={this.state.students_table.canNextPage}
                                        updatePageCount={this.getStudentsPage}
                                        pageSize={10}
                                        totalPages={this.state.students_table.totalPages}
                                        searchValue={''}
                                        />
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