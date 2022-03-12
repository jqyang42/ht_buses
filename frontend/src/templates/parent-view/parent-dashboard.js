import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL, STUDENTS_URL } from "../../constants";
import { ParentDashboardTable } from "../tables/parent-dashboard-table";
import SidebarMenu from '../components/sidebar-menu';
class ParentDashboard extends Component {
    state = {
        user: {},
        students: [],
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

    componentDidMount() {
        this.getUserDashboard();
        this.getParentPage(this.state.pageIndex, this.state.sortOptions, this.state.searchValue)
    }

    // // api calls
    // getUserDashboard() {
    //     api.get(`dashboard?id=${localStorage.getItem('user_id')}`)
    //         .then(res => {
    //         const user = res.data.user;

    //         this.setState({ 
    //             user: user, 
    //             students: user.students
    //         })
    //     })
    // }
    
    // render handlers
    handleShowAll = () => {
        this.setState(prevState => ({
            show_all: !prevState.show_all
        }), () => {
            this.getRoutesPage(this.state.show_all ? 0 : 1, this.state.sortOptions, this.state.searchValue)
        })
    } 

    // pagination
    getParentPage = (page, sortOptions, search) => {
        getPage({ url: `dashboard`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${localStorage.getItem('user_id')}` })
        .then(res => {
            console.log(res)
            console.log(res.data.user.students)
            this.setState({
                students: res.data.user.students,
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
                sortOptions: sortOptions,
                searchValue: search
            })
        })
    }

    render() {
        console.log(this.state.totalPages)
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
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
                                        data={this.state.students}
                                        showAll={this.state.show_all}
                                        pageIndex={this.state.pageIndex}
                                        canPreviousPage={this.state.canPreviousPage}
                                        canNextPage={this.state.canNextPage}
                                        updatePageCount={this.getParentPage}
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

export default ParentDashboard;