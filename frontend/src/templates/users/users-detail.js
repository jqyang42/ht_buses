import axios from 'axios';
import { API_DOMAIN } from '../../constants';
import React, { Component } from "react";
import { HT_LOGO } from "../../constants";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { UserStudentsTable } from '../tables/user-students-table';

import { INDEX_URL } from "../../constants";
import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class UsersDetail extends Component {
    state = {
        id: '',
        users : [],
        students: []
    }

    componentDidMount() {
        let config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        axios.get(API_DOMAIN + `users/detail?id=` + this.props.params.id, config)
            .then(res => {
            const users = res.data;
            if (users.students == null) {
                this.setState({ students: []})
            } else {
                this.setState({ students: users.students })
            }
            this.setState({ users: users });
            })
    }

    handleLogout = event => {
        event.preventDefault();
        const creds = {
            user_id: sessionStorage.getItem('user_id')
        }

        
        axios.post(API_DOMAIN + `logout`, creds)
        .then(res => {
            this.setState({token: '', message: res.data.message})
            sessionStorage.setItem('token', '')
            sessionStorage.setItem('user_id', '')
            sessionStorage.setItem('first_name', '')
            sessionStorage.setItem('last_name', '')
            sessionStorage.setItem('is_staff', false)
            sessionStorage.setItem('logged_in', false)
            console.log(sessionStorage.getItem('logged_in'))
            console.log(sessionStorage.getItem('token'))
            window.location.reload()
        })
    }



    handleDeleteSubmit = event => {
        event.preventDefault();

        const deleted_user = {
            first_name: this.state.users.first_name,
            last_name: this.state.users.last_name,
            email: this.state.users.email
        }

        let config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        axios.post(API_DOMAIN + `users/delete`, deleted_user, config)
            .then(res => {
                console.log(res)
            })
        
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        let UserAddress='';
        
        if (this.state.users.address != null) {
            UserAddress = this.state.users.address
        } else {
            UserAddress = `-`
        }

        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                        <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white min-vh-100">
                            <a href={INDEX_URL} className="d-flex align-items-center my-0 mx-2 px-4 pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                                <img src={HT_LOGO} className="img-fluid float-start pt-4 pb-4 px-1" alt="Hypothetical Transportation"></img>
                            </a>

                            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100" id="menu">
                                <li className="nav-item">
                                    <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-list-ul me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Students</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-geo-alt me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-building me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Schools</span>
                                    </a>
                                </li>
                                <li className="nav-item active">
                                    <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-people me-2"></i>
                                        <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="w-100 px-auto pb-1 d-flex justify-content-around">
                                <button className="btn btn-primary w-75 mb-4 mx-auto" role="button" onClick={this.handleLogout}>
                                    Log Out
                                </button> 
                            </div>
                        </div>
                    </div>

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2">
                                    <div className="row d-flex align-middle">
                                        <div className="w-auto px-2 ps-3">
                                            <a href={USERS_URL}><h5>Manage Users</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>{this.state.users.first_name} {this.state.users.last_name}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">{sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')}</h6>
                                    <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
                                </div>
                            </div>
                        </div>
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
                                            <button type="button" className="btn btn-primary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target="#addModal">
                                                <i className="bi bi-person-plus me-2"></i>
                                                Add Student
                                            </button>

                                            <div className="modal fade" id="addModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <form> {/* TODO: add onClick handler */}
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Create New Student</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputFirstName"} className="control-label pb-2">First Name</label>
                                                                    <input type="name" className="form-control pb-2" id={"exampleInputFirstName"}
                                                                        placeholder="Enter first name" required></input>
                                                                </div>
                                                                <div className="form-group required pb-3">
                                                                    <label for={"exampleInputLastName"} className="control-label pb-2">Last Name</label>
                                                                    <input type="name" className="form-control pb-2" id={"exampleInputLastName"}
                                                                        placeholder="Enter last name" required></input>
                                                                </div>
                                                                <div className="form-group pb-3">
                                                                    <label for={"exampleInputID"} className="control-label pb-2">Student ID</label>
                                                                    <input type="id" className="form-control pb-2" id={"exampleInputID"} 
                                                                    placeholder="Enter student ID"></input>
                                                                </div>
                                                                {/* <div className="form-group required pb-3">
                                                                    <label for={"exampleInputSchool"} className="control-label pb-2">School</label>
                                                                    <select className="form-select" placeholder="Select a School" aria-label="Select a School" required>
                                                                        <option selected>Select a School</option>
                                                                        {this.state.schools_dropdown.map(school => 
                                                                            <option value={school.value} id={school.display}>{school.display}</option>
                                                                        )}
                                                                    </select>
                                                                </div> */}
                                                                {/* <div className="form-group pb-3">
                                                                    <label for={"exampleInputRoute"} className="control-label pb-2">Route</label>
                                                                    <select className="form-select" placeholder="Select a Route" aria-label="Select a Route" required>
                                                                        <option selected>Select a Route</option>
                                                                        {this.state.routes_dropdown.map(route => 
                                                                            <option value={route.value} id={route.display}>{route.display}</option>
                                                                        )}
                                                                    </select>
                                                                </div> */}
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                                <button type="submit" className="btn btn-primary">Create</button>
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
                                            Email
                                        </p>
                                        <p className="gray-600">
                                            Address
                                        </p>
                                    </div>
                                    <div className="col-2 me-4">
                                        <p>
                                            {this.state.users.email}
                                        </p>
                                        <p>
                                            {UserAddress}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h7>STUDENTS</h7>
                                    <UserStudentsTable data={this.state.students}/>   
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