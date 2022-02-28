import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import { SchoolsTable } from '../tables/schools-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from '../../constants';
import { SCHOOLS_CREATE_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class Schools extends Component {
    state = {
        schools : [],
        show_all: false,
        pageIndex: 1,
        canPreviousPage: null,
        canNextPage: null,
        totalPages: null,
        sortOptions: {
            accessor: '',
            sortDirection: 'none'
        },
        searchValue: ''
    }

    // initialize
    componentDidMount() {
        this.getSchoolsPage(this.state.pageIndex, this.state.sortOptions, this.state.searchValue)
    }

    // pagination
    getSchoolsPage = (page, sortOptions, search) => {
        getPage({ url: 'schools', pageIndex: page, sortOptions: sortOptions, searchValue: search })
        .then(res => {
            this.setState({
                schools: res.data.schools,
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
            this.getSchoolsPage(this.state.show_all ? 0 : 1, this.state.sortOptions, this.state.searchValue)
        })
    }
    
    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="schools" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Schools" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <div className="row d-inline-flex float-end">
                                        <Link to={SCHOOLS_CREATE_URL} className="btn btn-primary float-end w-auto me-3" role="button">
                                            <span className="btn-text">
                                                <i className="bi bi-person-plus-fill me-2"></i>
                                                Create
                                            </span>
                                        </Link>
                                    </div>
                                    <SchoolsTable 
                                    data={this.state.schools} 
                                    showAll={this.state.show_all}
                                    pageIndex={this.state.pageIndex}
                                    canPreviousPage={this.state.canPreviousPage}
                                    canNextPage={this.state.canNextPage}
                                    updatePageCount={this.getSchoolsPage}
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

export default Schools;