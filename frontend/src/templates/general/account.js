import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import { UserStudentsTable } from '../tables/user-students-table';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";
import { makeSchoolsDropdown } from "../components/dropdown";

import { LOGIN_URL, USERS_URL } from "../../constants";
import SidebarMenu from "../components/sidebar-menu";

class Account extends Component {
    state = {
        user: {},
        location: {},
        students: [],
        new_student: {
            first_name: '',
            last_name: '',
            school_id: '',
            route_id: null,
            student_school_id: ''
        },
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

    componentDidMount() {
        this.getUserDetails()
        makeSchoolsDropdown().then(ret => {
            this.setState({
                schools_dropdown: ret
            })
        })
    }

    // api calls
    getUserDetails() {
        console.log(sessionStorage.getItem('user_id'))
        api.get(`users/detail?id=${sessionStorage.getItem('user_id')}`)
        .then(res => {
            const user = res.data.user;
            this.setState({ 
                user: user,
                location: user.location,
                students: user.students
            });
        })
        .catch (err => {
            if (err.response.status !== 200) {
                this.setState({ error_status: true });
                this.setState({ error_code: err.response.status });
            }
        })
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
                return <Navigate to={ USERS_URL }/>;
            } else {
                this.setState({ 
                    delete_success: -1 
                });
            }
        })
    }

    // render handlers
    handleShowAll = () => {
        this.setState({
            show_all: !this.state.show_all
        })
    }

    handleDeleteSubmit = (event) => {
        event.preventDefault();
        this.deleteUser();
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

        api.post(`users/add-students?id=${this.props.params.id}`, student)
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

        api.get(`schools/detail?id=${school_id}`)
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
        // const { redirect } = this.state;
        // const redirect_url = USERS_URL + '/' + this.props.params.id;
        // if (redirect) {
        //     return <Navigate to={ PARENT_DASHBOARD_URL }/>;
        // }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    {
                        sessionStorage.getItem('is_staff') == "false" ? <ParentSidebarMenu /> : <SidebarMenu />
                    }

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Account" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>
                                            {this.state.user.first_name} {this.state.user.last_name}
                                        </h5>
                                        <h7>
                                        {this.state.user.is_staff ? ('ADMINISTRATOR') : ('GENERAL')}
                                        </h7>
                                    </div>
                                    <div className="col">
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
                                    <div className="col-5 me-4">
                                        <p>
                                            {this.state.user.email}
                                        </p>
                                        <p>
                                            {this.state.location.address ? this.state.location.address : ""}
                                        </p>
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
    <Account
        {...props}
        params={useParams()}
    />
);