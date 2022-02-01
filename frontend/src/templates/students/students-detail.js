import axios from 'axios';
import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { API_DOMAIN, STUDENTS_URL } from "../../constants";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';

import { LOGIN_URL } from '../../constants';
import { PARENT_DASHBOARD_URL } from "../../constants";

class StudentsDetail extends Component {
    state = {
        student: [],
        route: [],
        school: [],
        redirect: false,
        delete_success: 0
    }
    
    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + `students/detail?id=` + this.props.params.id, config)  // TODO: use onclick id values
            .then(response => {
            const student = response.data;
            const route = student.route;
            const school = student.school;
            this.setState({ student: student, route: route, school: school });
            this.setState({ delete_success: 0 })
            })
    }

    handleDeleteSubmit = event => {
        event.preventDefault()

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.delete(API_DOMAIN + `students/delete?id=` + this.props.params.id, config)
            .then(res => {
                console.log(res)
                const msg = res.data.data.message
                if (msg == 'student successfully deleted') {
                    this.setState({ delete_success: 1 })
                    this.setState({ redirect: true });
                    console.log(this.state.redirect)
                    // return <Navigate to={ STUDENTS_URL }/>;
                } else {
                    console.log(this.state.redirect)
                    this.setState({ delete_success: -1 });
                }
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
                        <HeaderMenu root="Students" isRoot={false} isSecond={true} name={this.state.student.first_name + " " + this.state.student.last_name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                            <h5>
                                            {this.state.student.first_name} {this.state.student.last_name}
                                            </h5>
                                            <h7>
                                                ID #{this.state.student.student_school_id}
                                            </h7>
                                        
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            <Link to={"/students/" + this.props.params.id + "/edit"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Edit
                                                </span>
                                            </Link>
                                            <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                <i className="bi bi-trash me-2"></i>
                                                Delete
                                            </button>

                                            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <form onSubmit={this.handleDeleteSubmit}>
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Delete Student</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                Are you sure you want to delete this student?
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" className="btn btn-danger">Delete</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                    </div>
                                    <div className="col-2 me-4">
                                        <a href={"/schools/" + this.state.school.id}>
                                            <p>
                                                {this.state.school.name}
                                            </p>
                                        </a>
                                        {(this.state.route.name === "Unassigned") ?
                                            <p>
                                                {this.state.route.name}
                                            </p> :
                                            <a href={"/routes/" + this.state.route.id}>
                                                <p>
                                                    {this.state.route.name}
                                                </p>
                                            </a>
                                        }
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
    <StudentsDetail
        {...props}
        params={useParams()}
    />
);