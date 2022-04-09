import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL, STUDENTS_URL, STUDENT_INFO_URL } from "../../constants";
import { ParentDashboardTable } from "../tables/parent-dashboard-table";
import SidebarMenu from '../components/sidebar-menu';
class ParentDashboard extends Component {
    state = {
        user: {},
        students: [],
        show_all: false,
        students_page: [],
        students_table: {
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
    }

    componentDidMount() {
        this.getStudentsPage(this.state.students_table.pageIndex, this.state.students_table.sortOptions, this.state.students_table.searchValue)
    }
    
    // pagination
    getStudentsPage = (page, sortOptions, search) => {
        getPage({ url: `students/user`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${localStorage.getItem('user_id')}` })
        .then(res => {
            const students_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
                sortOptions: sortOptions,
                searchValue: search
            }
            this.setState({
                students_page: res.data.students,
                students_table: students_table
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
        // console.log(this.state.totalPages)
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        if (JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        else if (JSON.parse(localStorage.getItem('role') === "Student")) {
            return <Navigate to={STUDENT_INFO_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    {(JSON.parse(localStorage.getItem('is_staff')) && JSON.parse(localStorage.getItem('is_parent'))) ?
                    <SidebarMenu activeTab="dashboard" /> :
                    <ParentSidebarMenu activeTab="Dashboard"/>
                    }

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Dashboard" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <ParentDashboardTable
                                    data={this.state.students_page} 
                                    showAll={this.state.show_all}
                                    pageIndex={this.state.students_table.pageIndex}
                                    canPreviousPage={this.state.students_table.canPreviousPage}
                                    canNextPage={this.state.students_table.canNextPage}
                                    updatePageCount={this.getStudentsPage}
                                    pageSize={10}
                                    totalPages={this.state.students_table.totalPages}
                                    searchValue={this.state.students_table.searchValue}
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

export default ParentDashboard;