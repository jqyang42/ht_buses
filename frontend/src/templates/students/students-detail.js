import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { STUDENTS_URL } from "../../constants";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import api from "../components/api";

import { LOGIN_URL } from '../../constants';
import { PARENT_DASHBOARD_URL } from "../../constants";
import ErrorPage from '../error-page';

class StudentsDetail extends Component {
    state = {
        student: {},
        route: {},
        school: {},
        redirect: false,
        delete_success: 0,
        error_status: false,
        error_code: 200
    }
    
    // initialize
    componentDidMount() {
        this.getStudentDetails()
        this.updateIsParent()

    }

    // api calls
    getStudentDetails = () => {
        api.get(`students/detail?id=${this.props.params.id}`)
        .then(res => {
            const data = res.data
            console.log(data)
            this.setState({ 
                student: data.student, 
                route: data.route, 
                school: data.school 
            });
        })
        .catch (error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status 
                });
            }
        } 
    )}

    deleteStudent = () => {
        api.delete(`students/delete?id=${this.props.params.id}`)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    delete_success: 1,
                    redirect: true 
                });
            } else {
                this.setState({ delete_success: -1 });
            }
        })
    }


    updateIsParent = () => {
        api.get(`users/detail?id=${localStorage.getItem('user_id')}`)
        .then(res => {
            const user = res.data.user;
            const prev = JSON.parse(localStorage.getItem('is_parent'))
            localStorage.setItem('is_parent', user.is_parent)
            if(!user.is_parent && prev) {
               window.location.reload()
            }
        })
        .catch (err => {
        })
    }


    // render handlers
    handleDeleteSubmit = (event) => {
        event.preventDefault()
        this.deleteStudent()
        this.updateIsParent()
    }

    render() {
        this.updateIsParent()
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={ STUDENTS_URL }/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
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
                                            {
                                                  (localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') ?
                                                <>
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
                                                </>
                                                : ""
                                            }
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
                                                                <button type="submit" className="btn btn-danger" data-bs-dismiss="modal">Delete</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-auto me-2">
                                        <p className="gray-600">
                                            School
                                        </p>
                                        <p className="gray-600">
                                            Route
                                        </p>
                                        <p className="gray-600">
                                            Bus Stops
                                        </p>
                                    </div>
                                    <div className="col-5 me-6">
                                        <a href={"/schools/" + this.state.school.id}>
                                            <p>
                                                {this.state.school.name}
                                            </p>
                                        </a>
                                        {(this.state.route.name === "Unassigned" || this.state.route.name === "" ) ?
                                        
                                            <p className="unassigned"> {"Unassigned"}</p> :
                                            <a href={"/routes/" + this.state.route.id}>
                                                <p>
                                                    {this.state.route.name}
                                                </p>
                                            </a> 
                                        }
                                        {
                                            (this.state.student.in_range ?
                                                <p>
                                                    In Range
                                                </p> :
                                                <p className="unassigned"> {"Out of Range"}</p> 
                                            )
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