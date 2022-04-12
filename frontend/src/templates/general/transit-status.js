import React, { Component, useEffect } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import RouteMap from '../routes/route-map';
import { GlobalTransitStatusTable } from "../tables/global-transit-status-table";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { GOOGLE_MAP_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, ROUTES_URL, STUDENT_INFO_URL } from "../../constants";

class GlobalTransitStatus extends Component {
    state = {
        schools : [],
        center: null,
        markers: null,
        redirect: false,
        error_status: false,
        error_code: 200,
        buses_page: [],
        buses_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
        },
        buses: [],
        bus_tooltip: {}
    }

    interval_id = null

    componentDidMount() {
        this.getSchools()
        this.periodicCall()
        this.getActiveBuses(this.state.buses_table.pageIndex, null, '')
    }

    componentWillUnmount() {
        clearInterval(this.interval_id)
    }

    getSchools = () => {
        api.get(`buses/all-schools`)
        .then(res => {
            const data = res.data
            console.log(data)
            this.setState({
                schools: data.schools,
                center: data.center
            })
        })
    }

    periodicCall = () => {
        this.interval_id = setInterval(async () => {
            api.get(`buses/all-schools`)
            .then(res => {
                console.log(res.data)
                let bus_tooltip = {}
                bus_tooltip = res.data.buses.reduce(
                    (bus_tooltip, element, index) => (bus_tooltip[element.bus_number] = false, bus_tooltip), 
                    {})
                console.log(bus_tooltip)
                this.setState({
                    buses: res.data.buses,
                    bus_tooltip: bus_tooltip,
                })
            })
            this.getActiveBuses(this.state.buses_table.pageIndex, null, '')
        }, 1000)
    }

    getActiveBuses = (page, sortOptions, search) => {
        getPage({ url: `logs`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&active=true` })
        .then(res => {
            const buses_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages
            }
            this.setState({
                buses_page: res.data.logs,
                buses_table: buses_table
            })
        })
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
          }
        else if (JSON.parse(localStorage.getItem('role') === "General")) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        else if (JSON.parse(localStorage.getItem('role') === "Student")) {
            return <Navigate to={STUDENT_INFO_URL} />
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
                    <SidebarMenu activeTab="transit status" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Transit Status" isRoot={true}/>
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
                                        {this.state.buses && this.state.schools && this.state.center ? 
                                        <RouteMap 
                                            assign_mode={false} 
                                            key={this.state.assign_mode} 
                                            // active_route={this.props.params.id} 
                                            center={this.state.center}
                                            bus_tooltip={this.state.bus_tooltip}
                                            // existingStops={this.state.stops}                                            
                                            buses={this.state.buses}
                                            school_tooltips={this.state.schools}
                                            zoom={5}
                                        />
                                        : "" }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h7>BUS RUNS</h7>
                                        <GlobalTransitStatusTable 
                                        data={this.state.buses_page} 
                                        showAll={this.state.routes_show_all}
                                        pageIndex={this.state.buses_table.pageIndex}
                                        canPreviousPage={this.state.buses_table.canPreviousPage}
                                        canNextPage={this.state.buses_table.canNextPage}
                                        updatePageCount={this.getActiveBuses}
                                        pageSize={10}
                                        totalPages={this.state.buses_table.totalPages}
                                        searchValue={''} 
                                        />
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
    <GlobalTransitStatus/>
);