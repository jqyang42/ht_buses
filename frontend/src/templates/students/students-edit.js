import axios from "axios";
import React, { Component } from "react";
import { HT_LOGO } from "../../constants";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router";

import { INDEX_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { STUDENTS_URL } from "../../constants";
import { USERS_URL } from "../../constants";
import { ROUTES_URL } from "../../constants";
import { STUDENTS_DETAIL_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";

class StudentsEdit extends Component {
    state = {
        first_name: '',
        last_name: '',
        student_id: '',
        student: [],
        init_school_id: 0,
        init_parent_id: 0,
        init_route_id: 0,
        schools_dropdown: [],
        routes_dropdown: [],
        parents_dropdown: [],
        redirect: false,
    }

    handleFirstNameChange = event => {
        this.setState({ first_name: event.target.value });
    }

    handleLastNameChange = event => {
        this.setState({ last_name: event.target.value });
    }

    handleStudentIDChange = event => {
        this.setState({ student_id: event.target.value });
    }

    handleSchoolChange = event => {
        const school_id = event.target.value

        axios.get(API_DOMAIN + 'schools/detail?id=' + school_id)
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
    
    handleSubmit = event => {
        event.preventDefault();

        const user = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            student_school_id: this.state.student_id,
            school_name: this.state.school_name,
            route_name: this.state.route_name,
            parent_name: this.state.parent
        }

        console.log(user)

        axios.put(API_DOMAIN + `students/edit?id=` + this.props.params.id, user)
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
        this.setState({ redirect: true });
    }

    componentDidMount() {
        axios.get(API_DOMAIN + `students/detail?id=` + this.props.params.id)
        .then(res => {
            const student = res.data;
            this.setState({ student: student });
        })

        axios.get(API_DOMAIN + `schools`)
        .then(res => {            
            let schools = res.data.schools.map(school => {
                return {value: school.id, display: school.name}
            })
            this.setState({ schools_dropdown: schools})
        })

        axios.get(API_DOMAIN + 'schools/detail?id=' + this.state.init_school_id)
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

        axios.get(API_DOMAIN + 'users')
        .then(res => {
            let parents = res.data.users.filter(user => {
                return user.is_parent === true
            }).map(parent => {
                return { value: parent.id, display: `${parent.first_name} ${parent.last_name}` }
            })
            this.setState({ parents_dropdown: parents})
        })
    }

    render() {
        const { redirect } = this.state;
        const redirect_url = SCHOOLS_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
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
                                <li className="nav-item active">
                                    <a href={STUDENTS_URL} className="nav-link align-middle mx-4 px-4">
                                        <i className="bi bi-list-ul"></i>
                                        <span className="ms-1 d-none d-sm-inline">Students</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={ROUTES_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-geo-alt"></i>
                                        <span className="ms-1 d-none d-sm-inline">Bus Routes</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={SCHOOLS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-building"></i>
                                        <span className="ms-1 d-none d-sm-inline">Schools</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a href={USERS_URL} className="nav-link px-0 align-middle mx-4 px-4">
                                        <i className="bi bi-people"></i>
                                        <span className="ms-1 d-none d-sm-inline">Manage Users</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                            <div className="row align-self-center d-flex justify-content-between">
                                <div className="col-md-auto mx-2 py-2">
                                    <div className="row d-flex align-middle">
                                        <div className="w-auto px-2 ps-3">
                                            <a href={STUDENTS_URL}><h5>Students</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <a href={STUDENTS_DETAIL_URL}><h5>{this.state.student.first_name} {this.state.student.last_name}</h5></a>
                                        </div>
                                        <div className="w-auto px-2">
                                            <i className="bi bi-chevron-right"></i>
                                        </div>
                                        <div className="w-auto px-2">
                                            <h5>Edit Student</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-auto mx-2 py-0 mr-4">
                                    <h6 className="font-weight-bold mb-0">Admin Name</h6>
                                    <p className="text-muted text-small">Administrator</p>
                                </div>
                            </div>
                        </div>
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>Edit Student</h5>
                                    </div>
                                </div>
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    defaultValue="First Name" placeholder="Enter first name" required
                                                    onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    defaultValue="Last Name" placeholder="Enter full name" required
                                                    onChange={this.handleLastNameChange}></input>
                                            </div>
                                            <div className="form-group pb-3 w-75">
                                                <label for="exampleInputID1" className="control-label pb-2">Student ID</label>
                                                <input type="id" className="form-control pb-2" id="exampleInputID1" 
                                                defaultValue={this.state.student.student_school_id} placeholder="Enter student ID"
                                                onChange={this.handleStudentIDChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputSchool1" className="control-label pb-2">School</label>
                                                <select className="form-select" placeholder="Select a School" aria-label="Select a School"
                                                onChange={this.handleSchoolChange}>
                                                    <option>Select a School</option>
                                                    {this.state.schools_dropdown.map(school => {
                                                        if (this.state.init_school_id == school.value) {     //TODO: CHANGE TO USE STUDENT_ID?
                                                            return <option selected value={school.value}>{school.display}</option>
                                                        } else {
                                                            return <option value={school.value}>{school.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group pb-3 w-75">
                                                <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route">
                                                    <option>Select a Route</option>
                                                    {this.state.routes_dropdown.map(route => {
                                                        if (this.state.init_route_id == route.value) {     //TODO: CHANGE TO USE STUDENT_ID?
                                                            return <option selected value={route.value}>{route.display}</option>
                                                        } else {
                                                            return <option value={route.value}>{route.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputParent1" className="control-label pb-2">Parent</label>
                                                <select className="form-select" placeholder="Select a Parent" aria-label="Select a Parent">
                                                    <option>Select a Parent</option>
                                                    {this.state.parents_dropdown.map(parent => {
                                                        if (this.state.init_parent_id == parent.value) {
                                                            return <option selected value={parent.value}>{parent.display}</option>
                                                        } else {
                                                            return <option value={parent.value}>{parent.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button>
                                                <button type="submit" className="btn btn-primary w-auto me-0 justify-content-end">Update</button>
                                            </div>
                                        </div>
                                        <div className="col mt-2"></div>
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