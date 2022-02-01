import axios from "axios";
import React, { Component } from "react";
import { Link} from "react-router-dom";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";

import { LOGIN_URL } from "../../constants";
import { SCHOOLS_URL } from "../../constants";
import { API_DOMAIN } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class StudentsEdit extends Component {
    state = {
        first_name: '',
        last_name: '',
        student_id: '',
        school_id: '',
        route_id: null,
        parent_id: '',
        // school_name: '',
        // route_name: null,
        // parent_name: [],
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
        console.log(this.state.schools_dropdown)
        // const school_name = event.target[event.target.selectedIndex].id // TODO ?
        this.setState({ school_id })
        this.setState({ route_id: null })
        

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        console.log(school_id)
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
    
    handleRouteChange = event => {
        const route_id = event.target.value
        console.log(this.routes_dropdown)
        this.setState({ route_id })
        console.log(this.state.route_id)
    }

    handleParentIDChange = event => {
        this.setState({ parent_id: event.target.value })
        console.log(this.state.parent_id)
    }
    
    handleSubmit = event => {
        event.preventDefault();

        const student = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            student_school_id: this.state.student_id,
            school_id: this.state.school_id,
            route_id: this.state.route_id,
            parent_id: this.state.parent_id
        }

        console.log(student)

        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
        
        console.log(student)
        axios.put(API_DOMAIN + `students/edit?id=` + this.props.params.id, student, config)
        .then(res => {
            console.log(res);
            console.log(res.data);
        })
        // this.setState({ redirect: true });
    }

    async componentDidMount() {
       const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }

        let init_parent_id, init_route_id, init_school_id
        axios.get(API_DOMAIN + `students/detail?id=` + this.props.params.id,config)
        .then(res => {
            const student = res.data;
            this.setState({ student: student });
            init_parent_id = student.user_id
            init_route_id = student.route.id
            init_school_id = student.school.id

            let init_route
            if (student.route === null) {
                init_route = null
            } else {
                init_route = student.route.id
            }

            this.setState({ 
                init_parent_id, 
                init_route_id, 
                init_school_id,
                first_name: student.first_name,
                last_name: student.last_name,
                student_id: student.student_school_id,
                school_id: init_school_id,
                route_id: init_route_id,
                parent_id: init_parent_id
            })

            console.log(this.state)

            axios.get(API_DOMAIN + 'schools/detail?id=' + init_school_id, config)
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
        })

        axios.get(API_DOMAIN + `schools`, config)
        .then(res => {            
            let schools = res.data.schools.map(school => {
                return {value: school.id, display: school.name}
            })
            this.setState({ schools_dropdown: schools})
        })
        
        axios.get(API_DOMAIN + 'users', config)
        .then(res => {
            let parents = res.data.users.filter(user => {
                return user.is_parent === true
            }).map(parent => {
                return { user_id: parent.id, name: `${parent.first_name} ${parent.last_name}` }
            })
            this.setState({ parents_dropdown: parents})
        })
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        const redirect_url = SCHOOLS_URL + '/' + this.props.params.id;
        if (redirect) {
            return <Navigate to={redirect_url}/>;
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
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
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col mt-2">
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputFirstName1" className="control-label pb-2">First Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputFirstName1"
                                                    defaultValue={this.state.student.first_name} placeholder="Enter first name" required
                                                    onChange={this.handleFirstNameChange}></input>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputLastName1" className="control-label pb-2">Last Name</label>
                                                <input type="name" className="form-control pb-2" id="exampleInputLastName1"
                                                    defaultValue={this.state.student.last_name} placeholder="Enter full name" required
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
                                                            return <option selected value={school.value} id={school.display}>{school.display}</option>
                                                        } else {
                                                            return <option value={school.value} id={school.display}>{school.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group pb-3 w-75">
                                                <label for="exampleInputRoute1" className="control-label pb-2">Route</label>
                                                <select className="form-select" placeholder="Select a Route" aria-label="Select a Route"
                                                onChange={this.handleSchoolChange}>
                                                    <option>Select a Route</option>
                                                    {this.state.routes_dropdown.map(route => {
                                                        if (this.state.init_route_id == route.value) {     //TODO: CHANGE TO USE STUDENT_ID?
                                                            return <option selected value={route.value} id={route.display}>{route.display}</option>
                                                        } else {
                                                            return <option value={route.value} id={route.display}>{route.display}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="form-group required pb-3 w-75">
                                                <label for="exampleInputParent1" className="control-label pb-2">Parent</label>
                                                <select className="form-select" placeholder="Select a Parent" aria-label="Select a Parent"
                                                onChange={this.handleParentIDChange}>
                                                    <option>Select a Parent</option>
                                                    {this.state.parents_dropdown.map(parent => {
                                                        if (this.state.init_parent_id == parent.user_id) {
                                                            return <option selected value={parent.user_id} id={parent.name}>{parent.name}</option>
                                                        } else {
                                                            return <option value={parent.user_id} id={parent.name}>{parent.name}</option>
                                                        }
                                                    })}
                                                </select>
                                            </div>
                                            <div className="row justify-content-end ms-0 mt-2 me-0 pe-0 w-75">
                                                {/* <button type="button" className="btn btn-secondary w-auto me-3 justify-content-end">Cancel</button> */}
                                                <Link to={"/students/" + this.props.params.id} className="btn btn-secondary w-auto me-3 justify-content-end" role="button">
                                                    <span className="btn-text">
                                                        Cancel
                                                    </span>
                                                </Link>
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