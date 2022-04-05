import React, { Component, useEffect } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import RouteMap from '../routes/route-map';
import { TransitStatusTable } from "../tables/transit-status-table";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { GOOGLE_MAP_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, ROUTES_URL } from "../../constants";

class SchoolsTransitStatus extends Component {
    state = {
        route: [],
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
        // students_page: [],
        // students_table: {
        //     pageIndex: 1,
        //     canPreviousPage: null,
        //     canNextPage: null,
        //     totalPages: null,
        // },
        map_redirect_pickup: [],
        map_redirect_dropoff: [],
        buses: [],
        bus_tooltip: {}
    }

    interval_id = null

    componentDidMount() {
        // this.getStopsPage(this.state.stops_table.pageIndex, null, '')
        this.getRouteDetail()
        this.getStops()
        this.periodicCall()
    }

    componentWillUnmount() {
        clearInterval(this.interval_id)
    }

    periodicCall = () => {
        this.interval_id = setInterval(async () => {
            // @jessica update with correct api 
            api.get(`transit`)
            .then(res => {
                console.log(res.data.buses)
                let bus_tooltip = {}
                bus_tooltip = res.data.buses.reduce(
                    (bus_tooltip, element, index) => (bus_tooltip[element.bus_number] = false, bus_tooltip), 
                    {})

                console.log(bus_tooltip)
                this.setState({
                    buses: res.data.buses,
                    bus_tooltip: bus_tooltip
                })
            })
        }, 1000)

        // api.get(`transit`)
        // .then(res => {
        //     console.log(res.data)
        //     this.setState({
        //         buses: res.data.buses
        //     })
        // })
    }

    getRouteDetail = () => {
        api.get(`routes/detail?id=1`)
            .then(res => {
            const data = res.data;

            console.log(data)
            const route = data.route;
            const school = route.school;
            const users = data.users;
            
            this.setState({ 
                users: users,
                route: route, 
                school: school, 
                center: { 
                    lat: school.location.lat, 
                    lng: school.location.lng 
                }
            });        
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

    getStops = () => {     
        getPage({ url: 'stops', pageIndex: 0, sortOptions: null, searchValue: '', additionalParams: `&id=${this.props.params.id}`, only_pagination: true })
        .then(res => {
            const data = res.data;
            this.setState({ stops: data.stops })
        })
        .catch (error => {
            if (error.response.status !== 200) {
                // console.log(error.response.data)
                this.setState({ error_status: true });
                this.setState({ error_code: error.response.status });
            }
        })
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
        console.log(this.state.buses)
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="schools" />

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
                                        {this.state.buses ? 
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={this.state.assign_mode} 
                                            active_route={this.props.params.id} 
                                            center={this.state.center}
                                            bus_tooltip={this.state.bus_tooltip}
                                            existingStops={this.state.stops}
                                            buses={this.state.buses}
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