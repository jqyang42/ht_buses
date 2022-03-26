import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RouteStudentsTable } from "../tables/route-students-table";
import { StopsTable } from "../tables/stops-table";
import RouteMap from '../routes/route-map';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { GOOGLE_MAP_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, ROUTES_URL } from "../../constants";
import { TransitStatusTable } from "../tables/transit-status-table";

class SchoolsTransitStatus extends Component {
    state = {
        route : [],
        students : [],
        users: [],
        school : [],
        stops: [],
        center: {},
        markers: null,
        assign_mode: false,
        active_route: 0,
        redirect: false,
        delete_success: 0,
        routes_show_all: false,
        stops_show_all: false,
        error_status: false,
        error_code: 200,
        students_page: [],
        students_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
        },
        stops_page:[],
        stops_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
        },
        map_redirect_pickup: [],
        map_redirect_dropoff: [],
    }

    componentDidMount() {
        this.getStudentsPage(this.state.students_table.pageIndex, null, '')
        this.getStopsPage(this.state.stops_table.pageIndex, null, '')
        this.getRouteDetail()
        this.getStops()
    }

    // pagination
    getStudentsPage = (page, sortOptions, search) => {
        getPage({ url: `students/route`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}`, only_pagination: true })
        .then(res => {
            const students_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
            }
            this.setState({
                students_page: res.data.students,
                students_table: students_table
            })
        })
    }

    getStopsPage = (page, sortOptions, search) => {
        getPage({ url: `stops`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}`, only_pagination: true })
        .then(res => {
            const stops_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
            }
            this.setState({
                stops_page: res.data.stops,
                stops_table: stops_table
            })
        })
    }

    getRouteDetail = () => {
        api.get(`routes/detail?id=${this.props.params.id}`)
            .then(res => {
            const data = res.data;
            const route = data.route;
            const school = route.school;
            const users = data.users;
            const students = this.getStudentsFromUser(users)
            
            this.setState({ 
                students: students,
                users: users,
                route: route, 
                school: school, 
                center: { 
                    lat: school.location.lat, 
                    lng: school.location.lng 
                }, 
            });
            
            this.redirectToGoogleMapsPickup(this.state.stops)
            this.redirectToGoogleMapsDropoff(this.state.stops)
            this.setMarkers(users)            
        })
        .catch(error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status 
                });
            }
        })
    }

    getStudentsFromUser = (users) => {
        const students = users?.map(user => {
            return user.students.map(student => {
                return {
                    student_school_id: student.student_school_id,
                    id: student.id,
                    first_name: student.first_name,
                    last_name: student.last_name,
                    in_range: student.in_range
                }
            })
        })
        return [].concat.apply([], students)
    }

    setMarkers = (users) => {
        const markers = []
        users.map((user) => {
            const studentIDs = [];
            const studentNames = [];
            user.students.map((student) => {
                studentIDs.push(student.id);
                const fullName = student.first_name + ' ' + student.last_name;
                studentNames.push(fullName);
            });
            markers.push({
                location: {
                    lat: user.location.lat,
                    lng: user.location.lng
                },
                id: user.id,
                studentIDs: studentIDs,
                studentNames: studentNames,
                routeID: this.props.params.id   //TODO: change markers to create per student
            })
        });
        this.setState({ markers: markers })
    }

    getStops = () => {     
        getPage({ url: 'stops', pageIndex: 0, sortOptions: null, searchValue: '', additionalParams: `&id=${this.props.params.id}`, only_pagination: true })
        .then(res => {
            const data = res.data;
            this.setState({ stops: data.stops })
            // console.log(data.stops)
            // console.log(this.state.center)
            this.redirectToGoogleMapsPickup(this.state.stops)
            this.redirectToGoogleMapsDropoff(this.state.stops)
        })
        .catch (error => {
            if (error.response.status !== 200) {
                // console.log(error.response.data)
                this.setState({ error_status: true });
                this.setState({ error_code: error.response.status });
            }
        })
    }
    
    // TODO: Fix undefined, undefined center starting error after refreshing
    redirectToGoogleMapsPickup = (stops) => {
        this.setState({map_redirect_pickup: []})
        let arrivingLinks = []
        for (let i=0; i < stops.length; i+=10 ) {
            // console.log(i)
            let map_redirect_pickup = GOOGLE_MAP_URL
            map_redirect_pickup += '&waypoints='
            let j;
            for (j = i; j < i + 9 && j < stops.length; j+=1) {
                // console.log(stops[j])
                map_redirect_pickup += stops[j].location.lat + ',' + stops[j].location.lng +'|'
            }
            if (j == stops.length) {
                map_redirect_pickup += '&destination=' + this.state.center.lat + ',' + this.state.center.lng 
            } else {
                map_redirect_pickup += '&destination=' + stops[j].location.lat + ',' + stops[j].location.lng
            }
            // console.log(map_redirect_pickup)
            arrivingLinks.push(map_redirect_pickup)
        }
        // console.log(arrivingLinks)
        this.setState({
            map_redirect_pickup: arrivingLinks
        })
    }

    redirectToGoogleMapsDropoff = (stops) => {
        let reversed_stops = stops.slice().reverse();
        let departingLinks = []
        let i;
        if (reversed_stops.length == 1) {
            let map_redirect_dropoff = GOOGLE_MAP_URL
            map_redirect_dropoff += 'origin=' + this.state.center.lat + ',' + this.state.center.lng
            map_redirect_dropoff += '&destination=' + reversed_stops[0].location.lat + ',' + reversed_stops[0].location.lng
            departingLinks.push(map_redirect_dropoff) 
        } else {
            for (i = 0; i < reversed_stops.length-1; i+=10 ) {
                let map_redirect_dropoff = GOOGLE_MAP_URL 
                // console.log(i)
                if (i == 0) {
                    map_redirect_dropoff += 'origin=' + this.state.center.lat + ',' + this.state.center.lng 
                }
                map_redirect_dropoff +=  '&waypoints=';
                let j;
                for (j = i; j < i + 9 && j < stops.length-1; j+=1) {
                    // console.log(reversed_stops)
                    map_redirect_dropoff += reversed_stops[j].location.lat + ',' + reversed_stops[j].location.lng +'|'
                }
                //Think about cases where this could be in its own link
                map_redirect_dropoff += '&destination=' + reversed_stops[j].location.lat + ',' + reversed_stops[j].location.lng
                departingLinks.push(map_redirect_dropoff)
            }
        }
        // console.log(departingLinks)
        this.setState({map_redirect_dropoff: departingLinks})
    }

    // handlers
    handleDelete = (event) => {
        event.preventDefault()

        api.delete(`routes/delete?id=${this.props.params.id}`)
            .then(res => {
                // console.log("hello")
                const success = res.data.success
                // console.log(res.data)
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

    handleRoutesShowAll = () => {
        this.setState(prevState => ({
            routes_show_all: !prevState.routes_show_all
        }), () => {
            this.getStudentsPage(this.state.routes_show_all ? 0 : 1, null, '')
        })
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
          }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={ ROUTES_URL }/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        // console.log(this.state.students)
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Schools" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.school.name} page="Transit Status"/>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col-auto">
                                        <h5 className="align-top">Transit Status</h5>
                                    </div>
                                </div>
                                {(this.state.delete_success === -1) ? 
                                    (<div class="alert alert-danger mt-2 mb-2" role="alert">
                                        Unable to delete route. Please correct all errors before deleting.
                                    </div>) : ""
                                }
                                <div className="row mt-4">
                                    <div className="col-md-7 me-4">
                                        <h6 className="mb-3">Buses in Transit</h6>
                                        <div className="bg-gray rounded mb-4">
                                        {this.state.markers ? 
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={this.state.assign_mode} 
                                            active_route={this.props.params.id} 
                                            center={this.state.center}
                                            students={this.state.markers}
                                            existingStops={this.state.stops}
                                        />
                                        : "" }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h7>ROUTES</h7>
                                        {/* <TransitStatusTable 
                                        data={this.state.students_page} 
                                        showAll={this.state.routes_show_all}
                                        pageIndex={this.state.students_table.pageIndex}
                                        canPreviousPage={this.state.students_table.canPreviousPage}
                                        canNextPage={this.state.students_table.canNextPage}
                                        updatePageCount={this.getStudentsPage}
                                        pageSize={10}
                                        totalPages={this.state.students_table.totalPages}
                                        searchValue={''} 
                                        /> */}
                                        <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleStudentsShowAll}>
                                            { !this.state.routes_show_all ?
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
    <SchoolsTransitStatus
        {...props}
        params={useParams()}
    />
);