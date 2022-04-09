import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { StudentsTable } from "../tables/students-table";
import SidebarMenu from "../components/sidebar-menu";
import HeaderMenu from "../components/header-menu";
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from "../../constants";
import { PARENT_DASHBOARD_URL } from "../../constants";
import { STUDENTS_IMPORT_URL } from "../../constants";
import api from "../components/api";

class Students extends Component {
    constructor(props) {
        super(props)
        this.hiddenFileInput = React.createRef()
    }

    state = {
        students : [],
        show_all: false,
        pageIndex: 1,
        canPreviousPage: null,
        canNextPage: null,
        totalPages: null,
        sortOptions: {
            accessor: 'name',
            sortDirection: 'asc'
        },
        searchValue: '',
        import_redirect: false,
        fileUploaded: null,
        loading: false,
        import_file_error: false,
        import_headers_error: false
    }
    
    componentDidMount() {
        this.getStudentsPage(this.state.pageIndex, this.state.sortOptions, this.state.searchValue)
    }
    
    // pagination
    getStudentsPage = (page, sortOptions, search) => {
        getPage({ url: 'students', pageIndex: page, sortOptions: sortOptions, searchValue: search })
        .then(res => {
            this.setState({
                students: res.data.students,
                pageIndex: res.pageIndex,
                canPreviousPage: res.canPreviousPage,
                canNextPage: res.canNextPage,
                totalPages: res.totalPages,
                sortOptions: sortOptions,
                searchValue: search
            })
        })
    }

    // render handlers
    handleShowAll = () => {
        this.setState(prevState => ({
            show_all: !prevState.show_all
        }), () => {
            this.getStudentsPage(this.state.show_all ? 0 : 1, this.state.sortOptions, this.state.searchValue)
        })
    }

    // Programatically click the hidden file input element
    // when the Button component is clicked
    importStudents = () => {
        this.setState({ import_file_error: false })
        this.setState({ import_headers_error: false })
        this.fileUploaded = null
        this.hiddenFileInput.current.click()
    };

    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file 
    fileUploaded = null

    getExtension = (filename) => {
        var parts = filename.name.split('.');
        return parts[parts.length - 1];
    }

    getFile = (event) => {
        this.fileUploaded = event.target.files[0]
        // console.log(this.fileUploaded)
        var ext = this.getExtension(this.fileUploaded)
        if (ext.toLowerCase() === "csv") {
            this.submitFile(this.fileUploaded)
        } 
        else {
            this.setState({ import_file_error: true })
            this.fileUploaded = null
        }
    };

    submitFile = (fileUploaded) => {
        const formData = new FormData()
        formData.append("bulk_students", fileUploaded)
        const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        this.setState({ loading: true })
        api.post(`bulk-import/students-upload`, formData, config)
        .then(res => {
            // console.log("posted successfully")
            // console.log(res)
            // @thomas i set the token from students-upload here
            localStorage.setItem('students_import_file_token', res.data.students_token)
            this.setState({ 
                import_redirect: true,
                loading: false
            })
        })
        .catch(err => {
            this.setState({ 
                import_headers_error: true,
                loading: false
            })
            this.fileUploaded = null
            // console.log(err)
        })
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (JSON.parse(localStorage.getItem('role') === "General")) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        else if (JSON.parse(localStorage.getItem('role') === "Student")) {
            return <Navigate to={STUDENT_INFO_URL} />
        }
        if (this.state.import_redirect) {
            return <Navigate to={ STUDENTS_IMPORT_URL } state={{file: this.fileUploaded}}/>
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-wrap">
                    <SidebarMenu activeTab="students" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="Students" isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div>
                                    {this.state.import_file_error ? 
                                        <div class="alert alert-danger mt-2 mb-3" role="alert">
                                            Your import file type is not supported. Please provide csv files only.
                                        </div> : ""
                                    }
                                    {this.state.import_headers_error ? 
                                        <div class="alert alert-danger mt-2 mb-3" role="alert">
                                            Your import file does not have the correct format. Please ensure that it contains the headers: name, parent_email, student_id, school_name, student_email, and phone_number in the respective order.
                                        </div> : ""
                                    }
                                    {this.state.loading ? 
                                        <div class="alert alert-primary mt-2 mb-4" role="alert">
                                            Please wait patiently while we load and verify your file import.
                                        </div> : ""
                                    }
                                    <div className="row d-inline-flex float-end">
                                        {
                                              (localStorage.getItem('role') === 'Administrator' || localStorage.getItem('role') === 'School Staff') ?
                                            <>
                                                <button type="button" className="btn btn-primary float-end w-auto me-3" onClick={() => this.importStudents()}>
                                                    <i className="bi bi-upload me-2"></i>
                                                    Import
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={this.hiddenFileInput}
                                                    accept={".csv"}
                                                    onChange={this.getFile}
                                                    onClick={(event) => {
                                                        event.target.value = ''
                                                    }}
                                                    style={{ display: 'none' }} />
                                            </> : ""
                                        }
                                    </div>
                                    <StudentsTable 
                                    data={this.state.students} 
                                    showAll={this.state.show_all}
                                    pageIndex={this.state.pageIndex}
                                    canPreviousPage={this.state.canPreviousPage}
                                    canNextPage={this.state.canNextPage}
                                    updatePageCount={this.getStudentsPage}
                                    pageSize={10}
                                    totalPages={this.state.totalPages}
                                    searchValue={this.state.searchValue}
                                    />
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

export default Students;

