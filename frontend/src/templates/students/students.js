import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { StudentsTable } from "../tables/students-table";
import SidebarMenu from "../components/sidebar-menu";
import HeaderMenu from "../components/header-menu";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { getPage } from "../tables/server-side-pagination";

class Students extends Component {
    state = {
        students : [],
        show_all: false,
        pageIndex: 1,
        canPreviousPage: null,
        canNextPage: null,
        totalPages: null
    }
    
    componentDidMount() {
        this.getStudentsPage(this.state.pageIndex, 'ASC', 'name')
    }

    // render handlers
    handleShowAll = () => {
        this.setState(prevState => ({
            show_all: !prevState.show_all
        }), () => {
            if (this.state.show_all) {
                this.getStudentsPage(0)
            } else {
                this.getStudentsPage(1)
            }
        })        
    }

    // pagination
    getStudentsPage = (page, order_by, sort_by) => {
        getPage({ url: 'students', pageIndex: page, order_by: order_by, sort_by: sort_by })
        .then(res => {
            this.setState({
                students: res.data.students,
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages
            })
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
                    <SidebarMenu activeTab="students" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Students" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    <StudentsTable 
                                    data={this.state.students} 
                                    showAll={this.state.show_all}
                                    pageIndex={this.state.pageIndex}
                                    canPreviousPage={this.state.canPreviousPage}
                                    canNextPage={this.state.canNextPage}
                                    updatePageCount={this.getStudentsPage}
                                    pageSize={10}
                                    totalPages={this.state.totalPages}
                                    // handleColumnSort={this.getSortOptions}
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

export default Students;

