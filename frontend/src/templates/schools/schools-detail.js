import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { SchoolStudentsTable } from "../tables/school-students-table";
import { SchoolRoutesTable } from "../tables/school-routes-table";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";

import { LOGIN_URL, SCHOOLS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";

class SchoolsDetail extends Component {
    state = {
        school: [],
        students: [],
        routes: [],
        address: '',
        delete_school: '',
        delete_success: 0,
        redirect: false,
        students_show_all: false,
        routes_show_all: false,
        error_status: false,
        error_code: 200
    }

    handleStudentsShowAll = event => {
        this.setState({students_show_all: !this.state.students_show_all})
        // console.log(this.state.students_show_all)
    }


    handleRoutesShowAll = event => {
        this.setState({routes_show_all: !this.state.routes_show_all})
        // console.log(this.state.routes_show_all)
    }

    handleDeleteSchool = event => {
        this.setState({ delete_school: event.target.value })
    }

    handleDeleteSubmit = event => {
        event.preventDefault();

        if (this.state.delete_school == this.state.school.name) {
            api.delete(`schools/delete?id=${this.props.params.id}`)
                .then(res => {
                    // console.log(res)
                    const msg = res.data.message
                    if (msg == 'school successfully deleted') {
                        this.setState({ delete_success: 1 })
                        this.setState({ redirect: true });
                        // console.log(this.state.redirect)
                        return <Navigate to={ SCHOOLS_URL }/>;
                    } else {
                        this.setState({ delete_success: -1 })
                    }
                })
        } else {
            this.setState({ delete_success: -1 })
        }
    }

    componentDidMount() {
        var self = this

        api.get(`schools/detail?id=${this.props.params.id}`)
            .then(res => {
                const data = res.data
                const school = data.school
                
                if (data.students == null) {
                    this.setState({ students: []}) 
                } else {
                    this.setState({ students: data.students })
                }

                if (data.routes == null) {
                    this.setState({ routes: []})
                } else {
                    this.setState({ routes: data.routes })
                }

                // console.log(school)
                this.setState({ 
                    school: school,
                    address: school.location.address
                });
                this.setState({ delete_success: 0 });
                this.setState({ students_show_all: false, routes_show_all: false });
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
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        const { redirect } = this.state;
        if (redirect) {
            return <Navigate to={SCHOOLS_URL}/>;
        }
        if (this.state.error_status) {
            return <ErrorPage code={this.state.error_code} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="schools" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Schools" isRoot={false} isSecond={true} id={this.state.school.id} name={this.state.school.name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>{this.state.school.name}</h5>
                                        <p>{this.state.address}</p>
                                    </div>
                                    <div className="col">
                                        <div className="row d-inline-flex float-end">
                                            <Link to={"/schools/" + this.props.params.id + "/email"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-envelope me-2"></i>
                                                    Send Announcement
                                                </span>
                                            </Link>
                                            <Link to={"/schools/" + this.props.params.id + "/routes-planner"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                                    Route Planner
                                                </span>
                                            </Link>
                                            <Link to={"/schools/" + this.props.params.id + "/edit"} className="btn btn-primary float-end w-auto me-3" role="button">
                                                <span className="btn-text">
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Edit
                                                </span>
                                            </Link>
                                            <button type="button" className="btn btn-primary float-end w-auto me-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                <i className="bi bi-trash me-2"></i>
                                                Delete
                                            </button>

                                            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-centered">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title" id="staticBackdropLabel">Delete School</h5>
                                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                        </div>
                                                        <form onSubmit={this.handleDeleteSubmit}>
                                                            <div className="modal-body">
                                                                    <p>Are you sure you want to delete this school and all of its associated students and routes?</p>
                                                                    <div className="form-group required">
                                                                        <label for="school-name" className="control-label pb-2">Type the school name to confirm.</label>
                                                                        <input type="text" className="form-control" id="school-name" placeholder="Enter school name"
                                                                        onChange={this.handleDeleteSchool}></input>
                                                                    </div>
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
                                        Unable to delete school. Please correct all errors before deleting.
                                    </div>) : ""
                                }
                                <div className="row mt-4">
                                    <div className="col me-4">
                                        <h7>STUDENTS</h7>
                                        <SchoolStudentsTable data={this.state.students} showAll={this.state.students_show_all}/>
                                        <button className="btn btn-secondary align-self-center" onClick={this.handleStudentsShowAll}>
                                            { !this.state.students_show_all ?
                                                "Show All" : "Show Pages"
                                            }
                                        </button>
                                    </div>
                                    <div className="col">
                                        <h7>ROUTES</h7>
                                        <SchoolRoutesTable data={this.state.routes} showAll={this.state.routes_show_all}/>
                                        <button className="btn btn-secondary align-self-center" onClick={this.handleRoutesShowAll}>
                                            { !this.state.routes_show_all ?
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
    <SchoolsDetail
        {...props}
        params={useParams()}
    />
);