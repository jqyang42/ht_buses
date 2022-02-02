import React, { Component } from "react";
import { API_DOMAIN } from "../../constants";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";

import { LOGIN_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import axios from "axios";

class ParentDetail extends Component {
    state = {
        student: [],
        route: []
    }

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        console.log(config)
        axios.get(API_DOMAIN + 'dashboard/students/detail?id=' + this.props.params.id, config)
            .then(res => {
                const student = res.data
                const route = student.route
                this.setState({ student: student, route: route })
            })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={STUDENTS_URL} />
        }
        return (
            <body className="overflow-hidden">
                <div className="container-fluid mx-0 px-0">
                    <div className="row flex-nowrap">
                        <ParentSidebarMenu />

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
                                                {this.state.route.name}
                                            </p>
                                            <p>
                                                {this.state.route.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </body>
        );
    }
}

export default (props) => (
    <ParentDetail
        {...props}
        params={useParams()}
    />
);