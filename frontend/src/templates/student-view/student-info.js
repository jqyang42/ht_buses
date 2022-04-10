import React, { Component } from "react";
import { Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import StudentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import RouteMap from "../routes/route-map";
import { StopsTable } from "../tables/stops-table";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { MARKER_ICONS, PARENT_DASHBOARD_URL } from '../../constants';
import { LOGIN_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { Nav } from "react-bootstrap";

class StudentInfo extends Component {
    state = {
        student: {},
        center: {},
        stops: {},
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
        this.getStudentDetail()
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
    getStudentDetail = () => {
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
        }).catch (error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status
                });
            }
        })
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
        else if (JSON.parse(localStorage.getItem('role') === "General")) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        return (
            <div className="overflow-hidden container-fluid mx-0 px-0">
                <div className="row flex-wrap">
                    <StudentSidebarMenu activeTab="Info"/>

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Info" isRoot={true} />
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
                                <div className="row mt-4">
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
                                </div>
                                <div className="row mt-4">
                                    <div className="col-md-7 me-4">
                                        <div className="bg-gray rounded mb-4">
                                        {Object.keys(this.state.student).length ? 
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={false}
                                            active_route={this.state.active_route} 
                                            center={this.state.center}
                                            existingStops={this.state.stops}
                                            centerIcon={MARKER_ICONS[this.state.active_route % MARKER_ICONS.length]}
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
    <StudentInfo
        {...props}
        params={useParams()}
    />
);