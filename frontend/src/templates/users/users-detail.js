import axios from 'axios';
import { API_DOMAIN, USERS_URL } from '../../constants';
import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserStudentsTable } from '../tables/user-students-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import ErrorPage from "../error-page";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class UsersDetail extends Component {
    state = {
        id: '',
        users : [],
        students: [],
        new_student: [],
        schools_dropdown: [],
        routes_dropdown: [],
        redirect: false,
        create_success: 0,
        delete_success: 0,
        show_all: false,
        error_status: false,
        error_code: 200,
        add_student_clicked: false
    }

    handleShowAll = event => {
        this.setState({show_all: !this.state.show_all})
        // console.log(this.state.show_all)
    }

    componentDidMount() {
        let config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        var self = this
        
        axios.get(API_DOMAIN + `users/detail?id=` + this.props.params.id, config)
            .then(res => {
            const users = res.data;
            if (users.students == null) {
                this.setState({ students: []})
            } else {
                this.setState({ students: users.students })
            }
            this.setState({ users: users });
            this.setState({ create_success: 0 });
            this.setState({ delete_success: 0});
            this.setState({ show_all: false});
            })
            .catch (function(error) {
                // console.log(error.response)
                if (error.response.status !== 200) {
                    // console.log(error.response.data)
                    self.setState({ error_status: true });
                    self.setState({ error_code: error.response.status });
                }
            } 
        )
        
        axios.get(API_DOMAIN + `schools`,  config)
            .then(res => {            
            let schools = res.data.schools.map(school => {
                return {value: school.id, display: school.name}
            })
            this.setState({ schools_dropdown: schools})
        })

        this.setState({ new_student: 
            {
                first_name: '',
                last_name: '',
                school_id: '',
                route_id: null,   //TODO: replicate?
                student_school_id: ''
            }
        })
    }

    handleDeleteSubmit = event => {
        event.preventDefault();

        let config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.delete(API_DOMAIN + `users/delete?id=` + this.props.params.id, config)
            .then(res => {
                // console.log(res)
                const msg = res.data.data.message
                if (msg == 'user successfully deleted') {
                    this.setState({ delete_success: 1 })
                    this.setState({ redirect: true });
                    // console.log(this.state.redirect)
                    return <Navigate to={ USERS_URL }/>;
                } else {
                    // console.log(this.state.redirect)
                    this.setState({ delete_success: -1 });
                }
            })
    }
    studentIDValidation = () => {
        const isNumber = !isNaN(this.state.new_student.student_school_id)
        if (!isNumber ) {
            return false
        }
        else if(isNumber && Math.sign(this.state.new_student.student_school_id) === -1)   {
            return false
        }
        return true 
    }
    handleAddStudentSubmit = event => {
        // event.preventDefault();
        if (!this.studentIDValidation()) {
            this.setState({ create_success: -1 })  
            return
        }

        const student = {
            students: [this.state.new_student]
        }

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        
        axios.post(API_DOMAIN + `users/add-students?id=` + this.props.params.id, student, config) // TODO, config as 3rd parameter
            .then(res => {
                const msg = res.data.data.message
                if (msg === 'Students created successfully') {
                    this.setState({ create_success: 1 })     // TODO ERROR: edit_success?
                    // console.log(this.state.create_success)
                } else {
                    this.setState({ create_success: -1 })      // TODO ERROR
                }
            })
    }

    handleStudentFirstNameChange = (event) => {
        const first_name = event.target.value
        let student = this.state.new_student
        student.first_name = first_name
        this.setState({ new_student: student })
        // console.log(this.state.new_student)
    }

    handleStudentLastNameChange = (event) => {
        const last_name = event.target.value
        let student = this.state.new_student
        student.last_name = last_name
        this.setState({ new_student: student })
    }

    handleStudentIDChange = (event) => {
        const student_school_id = event.target.value
        let student = this.state.new_student
        student.student_school_id = student_school_id
        this.setState({ new_student: student })
    }

    handleSchoolChange = (event) => {
        const school_id = event.target.value
        let student = this.state.new_student
        student.school_id = school_id
        this.setState({ new_student: student })

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + 'schools/detail?id=' + school_id, config)
            .then(res => {
                let routes_data
                if (res.data.routes == null) {
                    routes_data = []
                } else {
                    routes_data = res.data.routes
                }
                let routes = routes_data.map(route => {
                    return {
                        value: route.id,
                        display: route.name
                    }
                })
                this.setState({ routes_dropdown: routes })
            })
    }

    handleRouteChange = (event) => {
        const route_id = event.target.value
        let student = this.state.new_student
        student.route_id = route_id
        this.setState({ new_student: student })
    }

    handleClickAddStudent = (event) => {
        this.setState({add_student_clicked: !this.state.add_student_clicked});
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        let UserAddress='';
        
        // if (this.state.users.address != null) {
        //     UserAddress = this.state.users.address
        // } else {
        //     UserAddress = `-`
        // }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={USERS_URL}/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Manage Users" isRoot={false} isSecond={true} name={this.state.users.first_name + " " + this.state.users.last_name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>
                                            {this.state.users.first_name} {this.state.users.last_name}
                                        </h5>
                                        <h7>
                                        {this.state.users.is_staff ? ('ADMINISTRATOR') : ('GENERAL')}
                                        </h7>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            <Link to={"/users/" + this.props.params.id + "/change-password"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-key me-2"></i>
                                                    Change Password
                                                </span>
                                            </Link>
                                            <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target={this.state.users.address ? "#addModal" : ""}onClick={this.handleClickAddStudent}>
                                                <i className="bi bi-person-plus me-2"></i>
                                                Add Student
                                            </button>

                                            <div className="modal fade" id="addModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <form onSubmit={this.handleAddStudentSubmit}> {/* TODO: add onClick handler */}
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Create New Student</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputFirstName"} className="control-label pb-2">First Name</label>
                                                                    <input type="name" className="form-control pb-2" id={"exampleInputFirstName"}
                                                                        placeholder="Enter first name" required onChange={(e) => this.handleStudentFirstNameChange(e)}></input>
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputLastName"} className="control-label pb-2">Last Name</label>
                                                                    <input type="name" className="form-control pb-2" id={"exampleInputLastName"}
                                                                        placeholder="Enter last name" required onChange={(e) => this.handleStudentLastNameChange(e)}></input>
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputID"} className="control-label pb-2">Student ID</label>
                                                                    <input type="id" className="form-control pb-2" id={"exampleInputID"} 
                                                                    placeholder="Enter student ID" required onChange={(e) => this.handleStudentIDChange(e)}></input>
                                                                    {(!this.studentIDValidation()) ? 
                                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                                        The Student ID value is invalid. Please edit and try again.
                                                                    </div>) : ""
                                                                    }
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputSchool"} className="control-label pb-2">School</label>
                                                                    <select className="form-select" placeholder="Select a School" aria-label="Select a School"
                                                                    onChange={(e) => this.handleSchoolChange(e)} required>
                                                                        <option value="" disabled selected>Select a School</option>
                                                                        {this.state.schools_dropdown.map(school => 
                                                                            <option value={school.value} id={school.display}>{school.display}</option>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                                <div className="form-group pb-3">
                                                                    <label for={"exampleInputRoute"} className="control-label pb-2">Route</label>
                                                                    <select className="form-select" placeholder="Select a Route" aria-label="Select a Route"
                                                                    onChange={(e) => this.handleRouteChange(e)} required>
                                                                        <option selected>Select a Route</option>
                                                                        {this.state.routes_dropdown.map(route => 
                                                                            <option value={route.value} id={route.display}>{route.display}</option>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" onClick={this.handleClickAddStudent}>Create</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={"/users/" + this.props.params.id + "/edit"} className="btn btn-primary float-end w-auto me-3" role="button">
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
                                                                <h5 className="modal-title" id="staticBackdropLabel">Delete User</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                Are you sure you want to delete this user and all of its associated students?
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
                                {(this.state.delete_success === -1) ? 
                                    (<div class="alert alert-danger mt-2 mb-2" role="alert">
                                        Unable to delete user. Please correct all errors before deleting.
                                    </div>) : ""
                                }
                                {(this.state.create_success === -1) ? 
                                    (<div class="alert alert-danger mt-2 mb-2" role="alert">
                                        Unable to add student. Please correct all errors before adding.
                                    </div>) : ""
                                }
                                <div className="row mt-4">
                                    <div className="col-1">
                                        <p className="gray-600">
                                            Email
                                        </p>
                                        <p className="gray-600">
                                            Address
                                        </p>
                                    </div>
                                    <div className="col-5 me-4">
                                        <p>
                                            {this.state.users.email}
                                        </p>
                                        <p>
                                            {this.state.users.address ? this.state.users.address : ""}
                                        </p>
                                    </div>
                                </div>

                                {(!this.state.users.address && this.state.add_student_clicked) ? 
                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                        Please input an address before you add a student.
                                    </div>) : ""
                                }

                                <div className="mt-4">
                                    <h7>STUDENTS</h7>
                                    <UserStudentsTable data={this.state.students} showAll={this.state.show_all}/>
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

export default (props) => (
    <UsersDetail
        {...props}
        params={useParams()}
    />
);