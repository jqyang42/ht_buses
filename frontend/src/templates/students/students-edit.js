import React, { Component } from "react";
import { Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";

import { LOGIN_URL, STUDENTS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { makeParentsDropdown, makeSchoolsDropdown, makeRoutesDropdown } from "../components/dropdown";
import { validNumber } from "../components/validation";

class StudentsEdit extends Component {
    state = {
        student: {},
        school: {},
        route: {},
        edited_student: {
            first_name: '',
            last_name: '',
            student_school_id: null,
            school_id: null,
            route_id: null,
            user_id: null,
            in_range: null
        },
        schools_dropdown: [],
        routes_dropdown: [],
        parents_dropdown: [],
        redirect: false,
        edit_success: 0,
        error_status: false,
        error_code: 200
    }

    componentDidMount() {
        this.getStudentDetails()

        makeSchoolsDropdown().then(ret => {
            this.setState({ schools_dropdown: ret })
        })
        
        makeParentsDropdown().then(ret => {
            this.setState({ parents_dropdown: ret })
        })
    }

    // api calls
    getStudentDetails = () => {
        api.get(`students/detail?id=${this.props.params.id}`)
        .then(res => {
            const student = res.data.student
            const school = res.data.school
            const route = res.data.route
            const user = res.data.user
            student.user_id = user.id
            let edited_student = {
                first_name: student.first_name,
                last_name: student.last_name,
                student_school_id: student.student_school_id,
                school_id: school.id,
                route_id: route.id,
                user_id: user.id,
                in_range: false // TODO USE CLACLUATED VALUE
            }
            this.setState({ 
                student: student,
                school: school,
                route: route,
                edited_student: edited_student
            })

            // console.log(this.state.edited_student)

            makeRoutesDropdown({ school_id: school.id }).then(ret => {
                this.setState({ routes_dropdown: ret })
            })
        }).catch (error => {
            if (error.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: error.response.status 
                });
            }
        })
    }

    editStudent = (request) => {
        api.put(`students/edit?id=${this.props.params.id}`, request)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    edit_success: 1,
                    redirect: true 
                });
            } else {
                this.setState({ edit_success: -1 })
            }
        })
    }

    // render handlers
    handleFirstNameChange = (event) => {
        const first_name = event.target.value
        let student = this.state.edited_student
        student.first_name = first_name
        this.setState({ edited_student: student });
    }

    handleLastNameChange = (event) => {
        const last_name = event.target.value
        let student = this.state.edited_student
        student.last_name = last_name
        this.setState({ edited_student: student });    
    }

    handleStudentIDChange = (event) => {
        const student_school_id = event.target.value
        let student = this.state.edited_student
        student.student_school_id = student_school_id
        this.setState({ edited_student: student });  
    }

    handleSchoolChange = (event) => {
        const school_id = event.target.value
        let student = this.state.edited_student
        student.school_id = school_id
        student.route_id = null
        this.setState({ edited_student: student });

        makeRoutesDropdown({ school_id: school_id }).then(ret => {
            this.setState({ routes_dropdown: ret })
        })
    } 
    
    handleRouteChange = (event) => {
        const route_id = event.target.value
        let student = this.state.edited_student
        student.route_id = route_id
        this.setState({ edited_student: student });
    }

    handleParentIDChange = (event) => {
        const parent_id = event.target.value
        let student = this.state.edited_student
        student.user_id = parent_id
        this.setState({ edited_student: student });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(!validNumber({ value_to_check: this.state.edited_student.student_school_id })) {
            this.setState({ edit_success: -1 })
            return
        }
        
        const student = {
            student: this.state.edited_student
        }

        this.editStudent(student)
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = STUDENTS_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="students" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Students" isRoot={false} isSecond={false} id={this.props.params.id} name={this.state.student.first_name + " " + this.state.student.last_name} page="Edit Student" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit Student</h5>
                                    </div>
                                </div>
                                <div className="w-50 pe-2 me-2">
                                    {(this.state.edit_success === -1) ? 
                                        (<div class="alert alert-danger mt-2 mb-2 w-75" role="alert">
                                            Unable to edit student details. Please correct all errors before submitting.
                                        </div>) : ""
                                    }
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    defaultValue={this.state.student.first_name} placeholder="Enter first name" required
                                                    onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    defaultValue={this.state.student.last_name} placeholder="Enter full name" required
                                                    onChange={this.handleLastNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputID1" className="control-label pb-2">Student ID</label>
                                                <input type="id" className="form-control pb-2" id="exampleInputID1" 
                                                defaultValue={this.state.student.student_school_id} placeholder="Enter student ID" required
                                                onChange={this.handleStudentIDChange}></input>
                                                 {(!validNumber({ value_to_check: this.state.edited_student.student_school_id })) ? 
                                                      (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                           The Student ID value is invalid. Please edit and try again.
                                                      </div>) : ""
                                                }
                                            </div>
                        
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School"
                                                onChange={this.handleSchoolChange}>
                                                   <option value="" disabled selected>Select a School</option>
                                                    {this.state.schools_dropdown.map(school => {
                                                        if (this.state.school.id == school.value) {
                                                            return <option selected value={school.value}>{school.display}</option>
                                                        } else {
                                                            return <option value={school.value}>{school.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group pb-3 form-col">
                                                <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route"
                                                onChange={this.handleRouteChange} value={this.state.edited_student.route_id}>
                                                    <option>Select a Route</option>
                                                    {this.state.routes_dropdown.map(route => {
                                                        if (this.state.route.id == route.value) { 
                                                            return <option selected value={route.value}>{route.display}</option>
                                                        } else {
                                                            return <option value={route.value}>{route.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group required pb-3 form-col">
                                                <label for="exampleInputParent1" className="control-label pb-2">Parent</label>
                                                <select className="form-select" placeholder="Select a Parent" aria-label="Select a Parent"
                                                onChange={this.handleParentIDChange}>
                                                    <option>Select a Parent</option>
                                                    {this.state.parents_dropdown.map(parent => {
                                                        if (parseInt(this.state.edited_student.user_id) == parent.user_id) {
                                                            return <option selected value={parent.user_id}>{parent.name}</option>
                                                        } else {
                                                            return <option value={parent.user_id}>{parent.name}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 form-col">
                                                {/* <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button> */}
                                                <Link to={"/students/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
                                                <button type="submit" className="btn btn-primary w-auto me-0 justify-content-end">Update</button>
                                            </div>
                                        </div>
                                        <div className="col mt-2 extra-col"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <StudentsEdit
        {...props}
        params={useParams()}
    />
);