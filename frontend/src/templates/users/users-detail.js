import { USERS_URL } from '../../constants';
import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserStudentsTable } from '../tables/user-students-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import ErrorPage from "../error-page";
import api from '../components/api';
import { validNumber } from '../components/validation';
import { makeSchoolsDropdown, makeRoutesDropdown } from '../components/dropdown';
import { ManagedSchoolsTable } from '../tables/managed-schools-table';

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { getPage } from '../tables/server-side-pagination';

class UsersDetail extends Component {
    state = {
        user: {},
        new_student: {
            first_name: '',
            last_name: '',
            school_id: '',
            route_id: null,
            student_school_id: '',
            in_range: false // TODO USE REAL VALUE
        },
        schools_dropdown: [],
        routes_dropdown: [],
        students_show_all: false,
        redirect: false,
        add_student_clicked: false,
        create_success: 0,
        modal_dismiss: false,
        delete_success: 0,    
        error_status: false,
        error_code: 200,
        valid_id: 0,
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
        },
        schools_table: {
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

    // initialize page
    componentDidMount() {
        this.getUserDetails()
        this.getStudentsPage(this.state.students_table.pageIndex, this.state.students_table.sortOptions, this.state.students_table.searchValue)
        this.setState({ valid_id: 0})
        makeSchoolsDropdown().then(ret => {
            this.setState({ schools_dropdown: ret })
        })
        this.updateIsParent()
    }

    // pagination
    getStudentsPage = (page, sortOptions, search) => {
        getPage({ url: `students/user`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}` })
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

    // api calls
    getUserDetails = () => {
        api.get(`users/detail?id=${this.props.params.id}`)
        .then(res => {
            const user = res.data.user;
            this.setState({ user: user });
        })
        .catch (err => {
            if (err.response.status !== 200) {
                this.setState({ 
                    error_status: true,
                    error_code: err.response.status
                 });
            }
        })
    }

    updateIsParent = () => {
       
    }

    deleteUser() {
        api.delete(`users/delete?id=${this.props.params.id}`)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    delete_success: 1,
                    redirect: true
                })
                this.getUserDetails()
                return <Navigate to={ USERS_URL }/>;
            } else {
                this.setState({ delete_success: -1 });
            }
        })
    }

    addStudent = (student) => {
        // console.log(student)
        api.post(`users/add-students?id=${this.props.params.id}`, student)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ create_success: 1 })     // TODO ERROR: edit_success?
                this.setState({ modal_dismiss: true})
                this.getUserDetails()
            } else {
                this.setState({ create_success: -1 })      // TODO ERROR
                this.setState({ modal_dismiss: false})
            }
        })
    } 

    // render handlers
    handleStudentShowAll = () => {
        this.setState(prevState => ({
            students_show_all: !prevState.students_show_all
        }), () => {
            this.getStudentsPage(this.state.students_show_all ? 0 : 1, null, '')
        })
    }

    handleSchoolShowAll = () => {
        this.setState(prevState => ({
            schools_show_all: !prevState.schools_show_all
        }), () => {
            this.getSchoolsPage(this.state.schools_show_all ? 0 : 1, null, '')
        })
    }

    handleDeleteSubmit = (event) => {
        event.preventDefault();
        this.deleteUser();
    }

    resetStudentValues = () => {
        this.lastNameField.value = ""
        this.firstNameField.value = ""
        this.idField.value = ""
        this.schoolField.value = ""
        this.routeField.value = ""
        this.setState({ valid_id: 0})
    }
    
    handleClickAddStudent = () => {
        this.resetStudentValues()
        this.setState(prevState => ({
            add_student_clicked: !prevState.add_student_clicked
        }))
    }

    handleStudentFirstNameChange = (event) => {
        const first_name = event.target.value
        let student = this.state.new_student
        student.first_name = first_name
        this.setState({ new_student: student })
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
        this.setState({ valid_id: validNumber({ value_to_check: student_school_id}) ? 1 : -1})
    }

    handleSchoolChange = (event) => {
        const school_id = event.target.value
        let student = this.state.new_student
        student.school_id = school_id
        this.setState({ new_student: student })

        makeRoutesDropdown({ school_id: school_id}).then(ret => {
            this.setState({ routes_dropdown: ret })
        })
    }

    handleRouteChange = (event) => {
        const route_id = event.target.value
        let student = this.state.new_student
        student.route_id = route_id
        this.setState({ new_student: student })
    }

    handleAddStudentSubmit = (event) => {
        if (!validNumber({ value_to_check: this.state.new_student.student_school_id })) {
            event.preventDefault();
            return
        }
        else {
            const student = {
                students: [this.state.new_student]
            }

        this.addStudent(student)
        }
        this.updateIsParent()
        }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={USERS_URL}/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }

        // console.log(this.state.user.managed_schools)
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Manage Users" isRoot={false} isSecond={true} name={this.state.user.first_name + ' ' + this.state.user.last_name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>
                                            {this.state.user.first_name} {this.state.user.last_name}
                                        </h5>
                                        <h7>
                                            {this.state.user.role ? this.state.user.role.toUpperCase() : ""}
                                        </h7>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            {/* <Link to={"/users/" + this.props.params.id + "/change-password"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-key me-2"></i>
                                                    Change Password
                                                </span>
                                            </Link> */}
                                            {(localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') ?
                                            <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target={this.state.user.location?.address ? "#addModal" : ""} onClick={this.handleClickAddStudent}>
                                                <i className="bi bi-person-plus me-2"></i>
                                                Add Student
                                            </button> : ""
                                            }
                                            <div className="modal fade" show={!this.state.modal_dismiss} id="addModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <form onSubmit={this.handleAddStudentSubmit}>
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Create New Student</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputFirstName"} className="control-label pb-2">First Name</label>
                                                                    <input type="name" className="form-control pb-2" id={"exampleInputFirstName"}
                                                                        placeholder="Enter first name" required ref={el => this.firstNameField = el} onChange={(e) => this.handleStudentFirstNameChange(e)}></input>
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputLastName"} className="control-label pb-2">Last Name</label>
                                                                    <input type="name" className="form-control pb-2" id={"exampleInputLastName"}
                                                                        placeholder="Enter last name" required ref={el => this.lastNameField = el} onChange={(e) => this.handleStudentLastNameChange(e)}></input>
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputID"} className="control-label pb-2">Student ID</label>
                                                                    <input type="id" className="form-control pb-2" id={"exampleInputID"} 
                                                                    placeholder="Enter student ID" required ref={el => this.idField = el} onChange={(e) => this.handleStudentIDChange(e)}></input>
                                                                    {(validNumber({ value_to_check: this.state.new_student.student_school_id}) || (this.state.new_student.student_school_id === '')) ? "" :                                                                 
                                                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                                                        The Student ID value is invalid. Please edit and try again.
                                                                    </div>)
                                                                    }
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputSchool"} className="control-label pb-2">School</label>
                                                                    <select className="form-select" placeholder="Select a School" aria-label="Select a School"
                                                                    ref={el => this.schoolField = el} onChange={(e) => this.handleSchoolChange(e)} required>
                                                                        <option value="" disabled >Select a School</option>
                                                                        {this.state.schools_dropdown.map(school => 
                                                                            <option value={school.value} id={school.display}>{school.display}</option>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                                <div className="form-group pb-3">
                                                                    <label for={"exampleInputRoute"} className="control-label pb-2">Route</label>
                                                                    <select className="form-select" placeholder="Select a Route" aria-label="Select a Route"
                                                                   ref={el => this.routeField = el} onChange={(e) => this.handleRouteChange(e)} >
                                                                        <option value= "" selected >Select a Route</option>
                                                                        {this.state.routes_dropdown.map(route => 
                                                                            <option value={route.value} id={route.display}>{route.display}</option>
                                                                        )}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" className="btn btn-primary" data-bs-dismiss={this.state.modal_dismiss ? "modal" : ""} >Create</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') ?
                                                <Link to={"/users/" + this.props.params.id + "/edit"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                    <span className="btn-text">
                                                        <i className="bi bi-pencil-square me-2"></i>
                                                        Edit
                                                    </span>
                                                </Link> : ""
                                            }
                                            {
                                               (localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') &&
                                                (localStorage.getItem("user_id") !== this.props.params.id) ?
                                                <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                    <i className="bi bi-trash me-2"></i>
                                                    Delete
                                                </button> : ""
                                            }

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
                                    <div className="col-auto me-2">
                                        <p className="gray-600">
                                            Email
                                        </p>
                                        <p className="gray-600">
                                            Phone
                                        </p>
                                        <p className="gray-600">
                                            Address
                                        </p>
                                    </div>
                                    <div className="col-5 me-4">
                                        <p>
                                            {this.state.user.email}
                                        </p>
                                        <p>
                                            {this.state.user.phone_number}
                                        </p>
                                        <p>
                                            {this.state.user.location?.address}
                                        </p>
                                    </div>
                                </div>

                                {(!this.state.user.location?.address && this.state.add_student_clicked) ? 
                                    (<div class="alert alert-danger mt-2 mb-0" role="alert">
                                        Please input an address before you add a student.
                                    </div>) : ""
                                }
{/* 
                                {this.state.user.managed_schools?.length !== 0 ? 
                                    <div className="mt-4">      
                                        <h7 className="mb-4">MANAGED SCHOOLS</h7>
                                        {this.state.user.managed_schools?.map(school => {
                                            return <><p className="mt-2">{school.name}</p></>
                                        })}
                                    </div> : ""
                                } */}

                                <div className="row mt-4 flex-wrap">
                                    {this.state.user.managed_schools?.length !== 0 ? 
                                        <div className="col me-4">      
                                            <h7 className="mb-4">MANAGED SCHOOLS</h7>
                                            {/* <ManagedSchoolsTable 
                                                data={this.state.user.managed_schools} 
                                                showAll={this.state.schools_show_all}
                                                pageIndex={this.state.schools_table.pageIndex}
                                                canPreviousPage={this.state.schools_table.canPreviousPage}
                                                canNextPage={this.state.schools_table.canNextPage}
                                                updatePageCount={this.getSchoolsPage}
                                                pageSize={10}
                                                totalPages={this.state.schools_table.totalPages}
                                                searchValue={this.state.schools_table.searchValue}
                                            />
                                            <button className="btn btn-secondary align-self-center" onClick={this.handleSchoolShowAll}>
                                                { !this.state.schools_show_all ?
                                                    "Show All" : "Show Pages"
                                                }
                                            </button> */}
                                            {this.state.user.managed_schools?.map(school => {
                                                return <p className="mt-2">{school.name}</p>
                                            })}
                                        </div> : ""
                                    }
                                    <div className="col">
                                        <h7>STUDENTS</h7>
                                        <UserStudentsTable 
                                        data={this.state.students_page} 
                                        showAll={this.state.students_show_all}
                                        pageIndex={this.state.students_table.pageIndex}
                                        canPreviousPage={this.state.students_table.canPreviousPage}
                                        canNextPage={this.state.students_table.canNextPage}
                                        updatePageCount={this.getStudentsPage}
                                        pageSize={10}
                                        totalPages={this.state.students_table.totalPages}
                                        searchValue={this.state.students_table.searchValue}
                                        />
                                        <button className="btn btn-secondary align-self-center" onClick={this.handleStudentShowAll}>
                                            { !this.state.students_show_all ?
                                                "Show All" : "Show Pages"
                                            }
                                        </button>
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
    <UsersDetail
        {...props}
        params={useParams()}
    />
);