import React, { Component } from "react";
import { Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import RouteMap from "../routes/route-map";
import { StopsTable } from "../tables/stops-table";
import api from "../components/api";
import SidebarMenu from '../components/sidebar-menu';
import { getPage } from "../tables/server-side-pagination";

import { MARKER_ICONS } from '../../constants';

import { LOGIN_URL } from "../../constants";
import { STUDENTS_URL, STUDENT_INFO_URL } from "../../constants";

class ParentDetail extends Component {
    state = {
        student: {},
        center: null,
        stops: {},
        buses: [],
        bus_tooltip: {},
        active_route: 1,
        error_status: false,
        error_code: 200,
        stops_show_all: false,
        stops_page:[],
        stops_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
        }
    }

    componentDidMount() {
        this.getParentStudentDetail()
        this.getStopsPage(this.state.stops_table.pageIndex, null, '')
    }

    // pagination
    getStopsPage = (page, sortOptions, search) => {
        getPage({ url: `dashboard/students/stops`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}`, only_pagination: true })
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

    // api calls
    getParentStudentDetail = () => {
        api.get(`dashboard/students/detail?id=${this.props.params.id}`)
        .then(res => {
            // console.log(res.data.student)
            const student = res.data.student
            this.setState({ 
                stops: student.stops,
                active_route: student.route.id,
                center: {
                    lat: student.location.lat,
                    lng: student.location.lng
                },
                student: student,
             })
             this.periodicCall(student.route.id)
        }).catch (error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status
                });
            }
        })
    }

    periodicCall = (route_id) => {
        this.interval_id = setInterval(async () => {
            api.get(`buses/route?id=${route_id}`)
            .then(res => {
                // console.log(res.data)
                let bus_tooltip = {}
                bus_tooltip = res.data.buses.reduce(
                    (bus_tooltip, element, index) => (bus_tooltip[element.bus_number] = false, bus_tooltip), 
                    {})
                // console.log(bus_tooltip)
                this.setState({
                    buses: res.data.buses,
                    bus_tooltip: bus_tooltip,
                })
            })
        }, 1000)
    }
    // render handler
    handleStopsShowAll = () => {
        this.setState(prevState => ({
            stops_show_all: !prevState.stops_show_all
        }))
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        if (JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        else if (JSON.parse(localStorage.getItem('role') === "Student")) {
            return <Navigate to={STUDENT_INFO_URL} />
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        if (Object.keys(this.state.student).length) {
            // console.log(this.state.active_route)
            // console.log(this.state.center)
            // console.log(this.state.stops)
        } else {
            // console.log("theres nothing woahhhhhhh")
        }
        console.log(this.state.student)
        return (
            <div className="overflow-hidden container-fluid mx-0 px-0">
                <div className="row flex-wrap">
                {(JSON.parse(localStorage.getItem('is_staff')) && JSON.parse(localStorage.getItem('is_parent'))) ?
                    <SidebarMenu activeTab="dashboard" />:
                    <ParentSidebarMenu activeTab="Dashboard"/>
                    }

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Dashboard" isRoot={false} isSecond={true} name={this.state.student.first_name + " " + this.state.student.last_name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>{this.state.student.first_name} {this.state.student.last_name}</h5>
                                        <h7>ID #{this.state.student.school_student_id}</h7>
                                    </div>
                                    <div className="col">
                                    </div>
                                </div>
                                {/* <div className="row mt-4">
                                    <div className="col-auto me-2">
                                        <p className="gray-600">
                                            School
                                        </p>
                                        <p className="gray-600">
                                            Route
                                        </p>
                                        <p className="gray-600">
                                            Route Description
                                        </p>
                                    </div>
                                    <div className="col-5 me-4">
                                        <p>
                                            {this.state.student.school_name}
                                        </p>
                                        <p>
                                            {this.state.student.route?.name}
                                        </p>
                                        <p>
                                            {this.state.student.route?.description}
                                        </p>
                                    </div>
                                </div> */}
                                <div className="row mt-4 flex-wrap">
                                    <div className="col">
                                        <div className="row flex-nowrap mb-4">
                                            <div className="col-auto me-2">
                                                <p className="gray-600">
                                                    Email
                                                </p>
                                                <p className="gray-600">
                                                    Phone
                                                </p>
                                                <p className="gray-600">
                                                    School
                                                </p>
                                                <p className="gray-600">
                                                    Route
                                                </p>
                                                <p className="gray-600">
                                                    Route Description
                                                </p>
                                                <p className="gray-600">
                                                    Bus Stops
                                                </p>
                                            </div>
                                            <div className="col me-6">
                                                <p>
                                                    {this.state.student.email ? this.state.student.email : "–"}
                                                </p>
                                                <p>
                                                    {this.state.student.phone_number ? this.state.student.phone_number : "–"}
                                                </p>
                                                <p>
                                                    {this.state.student.school_name}
                                                </p>
                                                {(this.state.student.route?.name === "Unassigned" || this.state.student.route?.name === "" ) ?
                                                    <>
                                                        <p className="unassigned"> {"Unassigned"}</p>
                                                        <p>–</p>
                                                    </> :
                                                    <>
                                                        <p>
                                                            {this.state.student.route?.name}
                                                        </p>
                                                        <p>
                                                            {this.state.student.route?.description === "" ? "–" : this.state.student.route?.description}
                                                        </p>
                                                    </>
                                                }
                                                {
                                                    (this.state.student.in_range ?
                                                        <p>
                                                            In Range
                                                        </p> :
                                                        <p className="unassigned"> {"Out of Range"}</p> 
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-md-7 me-4">
                                        <div className="bg-gray rounded mb-4">
                                        {Object.keys(this.state.student).length && this.state.center ? 
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={false}
                                            active_route={this.state.active_route} 
                                            center={this.state.center}
                                            existingStops={this.state.stops}
                                            centerIcon={MARKER_ICONS[this.state.active_route % MARKER_ICONS.length]}
                                            buses={this.state.buses}
                                            bus_tooltip={this.state.bus_tooltip}
                                        />
                                        : "" }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h7>STOPS</h7>
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
    <ParentDetail
        {...props}
        params={useParams()}
    />
);