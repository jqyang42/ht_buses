import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { SchoolStudentsTable } from "../tables/school-students-table";
import { SchoolRoutesTable } from "../tables/school-routes-table";
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from "../components/header-menu";
import ErrorPage from "../error-page";
import api from "../components/api";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL, SCHOOLS_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { toDisplayFormat } from "../components/time";

class SchoolsDetail extends Component {
    state = {
        school: {},
        students: [],
        routes: [],
        delete_school: '',
        delete_success: 0,
        redirect: false,
        students_show_all: false,
        routes_show_all: false,
        error_status: false,
        error_code: 200,
        students_page: [],
        students_table: {
            pageIndex: 1,
            canPreviousPage: null,
            canNextPage: null,
            totalPages: null,
            // sortOptions: {},
            // searchValue: ''
        }
    }

    // initialize
    componentDidMount() {
        this.getSchoolDetails()
        this.getStudentsPage(this.state.students_table.pageIndex, null, '')
    }

    // pagination
    getStudentsPage = (page, sortOptions, search) => {
        getPage({ url: `students/school`, pageIndex: page, sortOptions: sortOptions, searchValue: search, additionalParams: `&id=${this.props.params.id}` })
        .then(res => {
            const students_table = {
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
                // sortOptions: sortOptions,
                // searchValue: search
            }
            this.setState({
                students_page: res.data.students,
                students_table: students_table
            })
        })
    }
    
    // api calls
    getSchoolDetails = () => {
        api.get(`schools/detail?id=${this.props.params.id}`)
        .then(res => {
            const data = res.data
            this.setState({ 
                school: data.school,
                students: data.students,
                routes: data.routes,
            });
        })
        .catch (error => {
            if (error.response.status !== 200) {
                this.setState({ error_status: true });
                this.setState({ error_code: error.response.status });
            }
        })
    }

    deleteSchool = () => {
        api.delete(`schools/delete?id=${this.props.params.id}`)
        .then(res => {
            const success = res.data.success
            if (success) {
                this.setState({ 
                    delete_success: 1,
                    redirect: true 
                });
                return <Navigate to={ SCHOOLS_URL }/>;
            } else {
                this.setState({ delete_success: -1 })
            }
        })
    }

    // render handlers
    handleStudentsShowAll = () => {
        this.setState(prevState => ({
            students_show_all: !prevState.students_show_all
        }), () => {
            this.getStudentsPage(this.state.students_show_all ? 0 : 1, null, '')
        })
    }

    handleRoutesShowAll = () => {
        this.setState(prevState => ({
            routes_show_all: !prevState.routes_show_all
        }))
    }

    handleDeleteSchool = (event) => {
        this.setState({ delete_school: event.target.value })
    }

    handleDeleteSubmit = (event) => {
        event.preventDefault();

        if (this.state.delete_school === this.state.school.name) {
            this.deleteSchool()
        } else {
            this.setState({ delete_success: -1 })
        }
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
                        <HeaderMenu root="Schools" isRoot={false} isSecond={true} id={this.props.params.id} name={this.state.school.name} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 py-4 mt-4 mb-2 bg-white shadow-sm rounded align-content-start">
                                <div className="row">
                                    <div className="col">
                                        <h5>{this.state.school.name}</h5>
                                        <p>{this.state.school.location?.address}</p>
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
                                <div className="row mt-2">
                                    <div className="col-auto">
                                        <p className="gray-600">
                                            Arrival Time
                                        </p>
                                        <p className="gray-600">
                                            Departure Time
                                        </p>
                                    </div>
                                    <div className="col-5 ms-2 me-4">
                                        <p>
                                            {/* TODO: connect school arrival time */}
                                            {toDisplayFormat({ twentyfour_time: this.state.school.arrival})}
                                        </p>
                                        <p>
                                            {/* TODO: connect school departure time */}
                                            {toDisplayFormat({ twentyfour_time: this.state.school.departure})}
                                        </p>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col me-4">
                                        <h7>STUDENTS</h7>
                                        <SchoolStudentsTable 
                                        data={this.state.students_page} 
                                        showAll={this.state.students_show_all}
                                        pageIndex={this.state.students_table.pageIndex}
                                        canPreviousPage={this.state.students_table.canPreviousPage}
                                        canNextPage={this.state.students_table.canNextPage}
                                        updatePageCount={this.getStudentsPage}
                                        pageSize={10}
                                        totalPages={this.state.students_table.totalPages}
                                        searchValue={''}    
                                        />
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