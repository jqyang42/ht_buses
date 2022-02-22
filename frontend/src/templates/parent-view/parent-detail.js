import React, { Component } from "react";
import { Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import RouteMap from "../routes/route-map";
import { StopsTable } from "../tables/stops-table";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";

class ParentDetail extends Component {
    state = {
        student: {},
        center: {},
        stops: {},
        active_route: 1,
        error_status: false,
        error_code: 200,
        stops_show_all: false
    }

    componentDidMount() {
        this.getParentStudentDetail()
    }

    // api calls
    getParentStudentDetail = () => {
        api.get(`dashboard/students/detail?id=${this.props.params.id}`)
        .then(res => {
            console.log(res.data.student)
            const student = res.data.student
            this.setState({ 
                stops: student.stops,
                active_route: student.route.id,
                center: {
                    lat: student.location.lat,
                    lng: student.location.long
                },
                student: student,
             })
             
            console.log(this.state.student)
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
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        if (this.state.error_status) {
            // console.log("reached")
            return <ErrorPage code={this.state.error_code} />
        }
        if (Object.keys(this.state.student).length) {
            console.log(this.state.active_route)
            console.log(this.state.center)
            console.log(this.state.stops)
        } else {
            console.log("theres nothing woahhhhhhh")
        }
        return (
            <div className="overflow-hidden container-fluid mx-0 px-0">
                <div className="row flex-nowrap">
                    <ParentSidebarMenu activeTab="Dashboard"/>

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
                                <div className="row mt-4">
                                    <div className="col-1">
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
                                    <div className="col-7 me-4">
                                        <div className="bg-gray rounded mb-4">
                                        {Object.keys(this.state.student).length ? 
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={false}
                                            active_route={this.state.active_route} 
                                            center={this.state.center}
                                            existingStops={this.state.stops}
                                        />
                                        : "" }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h7>STOPS</h7>
                                            <StopsTable data={this.state.student.stops || []} showAll={this.state.stops_show_all} dnd={false} handleReorder={() => {}}/>
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