import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { StudentsTable } from "../tables/students-table";
import SidebarMenu from "../components/sidebar-menu";
import HeaderMenu from "../components/header-menu";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class Students extends Component {
    state = {
        students : [],
        show_all: false
    }

    handleShowAll = () => {
        this.setState({show_all: !this.state.show_all})
    }

    componentDidMount() {
        api.get('students')
            .then(res => {
                const students = res.data.students;
                this.setState({ students });
                this.setState({ show_all: false });
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
                                    <StudentsTable data={this.state.students} showAll={this.state.show_all}/>
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

