import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { RoutesTable } from "../tables/routes-table";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class BusRoutes extends Component {
    state = {
        routes : [],
        show_all: false,
        pageIndex: 1,
        canPreviousPage: null,
        canNextPage: null,
        totalPages: null,
        sortOptions: {
            accessor: 'name',
            sortDirection: 'asc'
        },
        searchValue: ''
    }

    componentDidMount() {
        this.getRoutesPage(this.state.pageIndex, this.state.sortOptions, this.state.searchValue)
    }

    // pagination
    getRoutesPage = (page, sortOptions, search) => {
        getPage({ url: 'routes', pageIndex: page, sortOptions: sortOptions, searchValue: search })
        .then(res => {
            // console.log(res)
            // console.log(res.data.routes)
            this.setState({
                routes: res.data.routes,
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
                sortOptions: sortOptions,
                searchValue: search
            })
        })
    }

    // render handlers
    handleShowAll = () => {
        this.setState(prevState => ({
            show_all: !prevState.show_all
        }), () => {
            this.getRoutesPage(this.state.show_all ? 0 : 1, this.state.sortOptions, this.state.searchValue)
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
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="routes" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Bus Routes" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <RoutesTable 
                                    data={this.state.routes} 
                                    showAll={this.state.show_all}
                                    pageIndex={this.state.pageIndex}
                                    canPreviousPage={this.state.canPreviousPage}
                                    canNextPage={this.state.canNextPage}
                                    updatePageCount={this.getRoutesPage}
                                    pageSize={10}
                                    totalPages={this.state.totalPages}
                                    searchValue={this.state.searchValue}
                                    />
                                    <button className="btn btn-secondary align-self-center" onClick={this.handleShowAll}>
                                        { !this.state.show_all ?
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

export default BusRoutes;