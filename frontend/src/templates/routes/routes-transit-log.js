import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { TransitLogTable } from "../tables/transit-log-table";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL, ROUTES_URL } from "../../constants";

class BusRoutesTransitLog extends Component {
    state = {
        route: [],
        logsPage: [],
        logs_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
        },
        sortOptions: {
            accessor: 'name',
            sortDirection: 'ASC'
        },
        searchValue: '',
        logs_show_all: false,
        error_status: false,
        error_code: 200,
    }

    componentDidMount() {
        this.getTransitLogPage()
        this.getRouteDetail()
    }

    // pagination
    // TODO: @jessica change this to be for transit log instead of students
    getTransitLogPage = (page, sortOptions, search) => {
        getPage({ url: `logs`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}`, only_pagination: true })
        .then(res => {
            const log_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
            }
            this.setState({
                logsPage: res.data.logs,
                log_table: log_table
            })
        })
    }

    // TODO: @jessica change this to get transit log api not details page
    getRouteDetail = () => {
        api.get(`routes/detail?id=${this.props.params.id}`)
            .then(res => {
            const data = res.data;
            this.setState({ 
                route: data.route
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

    handleBusRunsShowAll = () => {
        this.setState(prevState => ({
            bus_runs_show_all: !prevState.bus_runs_show_all
        }), () => {
            this.getTransitLogPage(this.state.bus_runs_show_all ? 0 : 1, null, '')
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
        // console.log(this.state.students)
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        {/* TODO: @Kyra check that the route name is actually loading correctly */}
                        <HeaderMenu root="Bus Routes" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.route.name} page="Transit Log" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col-auto">
                                        <h5 className="align-top">Transit Log</h5>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <h7>BUS RUNS</h7>
                                    {/* <TransitLogTable 
                                    data={this.state.transit_log} 
                                    showAll={this.state.bus_runs_show_all}
                                    pageIndex={this.state.transit_log.pageIndex}
                                    canPreviousPage={this.state.transit_log.canPreviousPage}
                                    canNextPage={this.state.transit_log.canNextPage}
                                    updatePageCount={this.getTransitLog}
                                    pageSize={10}
                                    totalPages={this.state.transit_log.totalPages}
                                    searchValue={''} 
                                    /> */}
                                    <button className="btn btn-secondary align-self-center w-auto mb-4" onClick={this.handleBusRunsShowAll}>
                                        { !this.state.bus_runs_show_all ?
                                            "Show All" : "Show Pages"
                                        }
                                    </button>
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
    <BusRoutesTransitLog
        {...props}
        params={useParams()}
    />
);