import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { RouteStudentsTable } from "../tables/route-students-table";
import { StopsTable } from "../tables/stops-table";
import RouteMap from './route-map';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { GOOGLE_MAP_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, ROUTES_URL } from "../../constants";
import pdfRender from "../components/export-route";

class BusRoutesDetail extends Component {
    state = {
        route : [],
        students : [],
        users: [],
        school : [],
        stops: null,
        center: {},
        markers: null,
        assign_mode: false,
        active_route: 0,
        redirect: false,
        delete_success: 0,
        students_show_all: false,
        stops_show_all: false,
        error_status: false,
        error_code: 200,
        students_page: [],
        students_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
            // sortOptions: {
            //     accessor: '',
            //     sortDirection: 'none'
            // },
            // searchValue: ''
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
        // this.getStops()
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
                // sortOptions: sortOptions,
                // searchValue: search
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
                // sortOptions: sortOptions,
                // searchValue: search
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

            console.log(students)
            
            this.setState({ 
                students: students,
                users: users,
                route: route, 
                school: school, 
                center: { 
                    lat: school.location.lat, 
                    lng: school.location.lng 
                }, 
            }, console.log(this.state.center));

            this.setMarkers(users)            
        })
        .catch(error => {
            // console.log(error.response)
            if (error.response.status !== 200) {
                // console.log(error.response.data)
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
            // this.setState(prevState => ({
            //     markers: [...prevState.markers, {
            //         position: {
            //             lat: user.location.lat,
            //             lng: user.location.lng
            //         },
            //         id: user.id,
            //         studentIDs: studentIDs,
            //         studentNames: studentNames,
            //         routeID: this.props.params.id 
            //     }]
            // }));
        });
        this.setState({ markers: markers })
    }

    getStops = () => {
        api.get(`stops?id=${this.props.params.id}`)
        .then(res => {
            const data = res.data;
            this.setState({ stops: data.stops })
            console.log(this.state.center)
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
            console.log(i)
            let map_redirect_pickup = GOOGLE_MAP_URL
            map_redirect_pickup += '&waypoints='
            let j;
            for (j = i; j < i + 9 && j < stops.length; j+=1) {
                console.log(stops[j])
                map_redirect_pickup += stops[j].location.lat + ',' + stops[j].location.lng +'|'
            }
            if (j == stops.length) {
                map_redirect_pickup += '&destination=' + this.state.center.lat + ',' + this.state.center.lng 
            } else {
                map_redirect_pickup += '&destination=' + stops[j].location.lat + ',' + stops[j].location.lng
            }
            console.log(map_redirect_pickup)
            arrivingLinks.push(map_redirect_pickup)
        }
        console.log(arrivingLinks)
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
                console.log(i)
                if (i == 0) {
                    map_redirect_dropoff += 'origin=' + this.state.center.lat + ',' + this.state.center.lng 
                }
                map_redirect_dropoff +=  '&waypoints=';
                let j;
                for (j = i; j < i + 9 && j < stops.length-1; j+=1) {
                    console.log(reversed_stops)
                    map_redirect_dropoff += reversed_stops[j].location.lat + ',' + reversed_stops[j].location.lng +'|'
                }
                //Think about cases where this could be in its own link
                map_redirect_dropoff += '&destination=' + reversed_stops[j].location.lat + ',' + reversed_stops[j].location.lng
                departingLinks.push(map_redirect_dropoff)
            }
        }
        console.log(departingLinks)
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
                    // console.log(this.state.redirect)
                } else {
                    this.setState({ delete_success: -1})
                }
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
        console.log(this.state.students)
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Bus Routes" isRoot={false} isSecond={true} name={this.state.route.name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5 className="align-top">{this.state.route.name}
                                            { this.state.route.is_complete ? "" :
                                                <span className="badge bg-red ms-2">Incomplete</span>
                                            }
                                        </h5>
                                        <p className="mb-2"><a href={"/schools/" + this.state.school.id}>{this.state.school.name}</a></p>
                                        {/* <span className="badge bg-red mt-0">Incomplete</span> */}
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            {
                                                localStorage.getItem('is_staff') && (localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') ?
                                                <Link to={"/routes/" + this.props.params.id + "/email"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                    <span className="btn-text">
                                                        <i className="bi bi-envelope me-2"></i>
                                                        Send Announcement
                                                    </span>
                                                </Link> : ""
                                            }
                                            <button type="button" className="btn btn-primary float-end w-auto me-3"  onClick={() => this.state.route.length !== 0 ? pdfRender(this.state.route, this.state.users) : ""}>
                                                <i className="bi bi-download me-2"></i>
                                                Export
                                            </button>
                                            {
                                                localStorage.getItem('is_staff') && (localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') ?
                                                <>
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
                                                </> : ""
                                            }
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
                                    <div className="col-md-7 me-4">
                                        <h6>Description</h6>
                                        <p>
                                            {this.state.route.description}
                                        </p>
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
                                        { this.state.map_redirect_dropoff.length !== 0 ?
                                            <div className="mt-3"> 
                                            <h7 className="text-muted text-small track-wide">MAP DIRECTIONS</h7>
                                            {this.state.map_redirect_dropoff?.map((value, index) => {
                                                let num = index + 1
                                                return  <div className="row d-flex align-items-center align-middle mt-2">
                                                            <div className="col-auto align-items-center">
                                                                <p className="align-self-center align-text-center align-middle my-auto">{"Leg " + num + " Departure"}</p>
                                                            </div>
                                                            <div className="col-auto align-items-center">
                                                                <a className="btn btn-primary" href={this.state.map_redirect_dropoff[index]} target="_blank" rel="noreferrer">
                                                                    <span>
                                                                        Open in Google Maps
                                                                        <i className="bi bi-box-arrow-up-right ms-2"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                            })}
                                            {this.state.map_redirect_pickup?.map((value, index) => {
                                                let num = index + 1
                                                return  <div className="row d-flex align-items-center align-middle mt-2">
                                                            <div className="col-auto align-items-center">
                                                                <p className="align-self-center align-text-center align-middle my-auto">{"Leg " + num + " Arrival"}</p>
                                                            </div>
                                                            <div className="col-auto align-items-center">
                                                                <a className="btn btn-primary" href={this.state.map_redirect_pickup[index]} target="_blank" rel="noreferrer">
                                                                    <span>
                                                                        Open in Google Maps
                                                                        <i className="bi bi-box-arrow-up-right ms-2"></i>
                                                                    </span>
                                                                </a>
                                                            </div>
                                                        </div>
                                            })}
                                            </div> : ""
                                        }
                                    </div>
                                    <div className="col">
                                        <h7>STUDENTS</h7>
                                        <RouteStudentsTable 
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
                                            this.state.stops_page ?
                                            <>
                                                <div className="row d-flex justify-content-between align-items-center mb-2">
                                                    <h7 className="col w-auto">STOPS</h7>
                                                </div>
                                                <StopsTable
                                                data={this.state.stops_page}
                                                showAll={this.state.stops_show_all} 
                                                pageIndex={this.state.stops_table.pageIndex}
                                                canPreviousPage={this.state.stops_table.canPreviousPage}
                                                canNextPage={this.state.stops_table.canNextPage}
                                                updatePageCount={this.getStopsPage}
                                                pageSize={10}
                                                totalPages={this.state.stops_table.totalPages}
                                                searchValue={''}
                                                dnd={false} 
                                                handleReorder={() => {}}/>
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

export default (props) => (
    <BusRoutesDetail
        {...props}
        params={useParams()}
    />
);