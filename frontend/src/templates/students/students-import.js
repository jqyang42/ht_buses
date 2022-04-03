import React, { Component } from "react";
import { useLocation } from "react-router";
import { Link, Navigate, useParams} from "react-router-dom";
import { ImportStudentsTable } from '../tables/import-students-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import { getPage } from "../tables/server-side-pagination";
import { Modal } from "react-bootstrap";

import { LOGIN_URL, STUDENTS_URL } from '../../constants';
import { STUDENTS_CREATE_URL, PARENT_DASHBOARD_URL } from "../../constants";
import api from "../components/api";

class StudentsImport extends Component {
    state = {
        students: [],
        errors: [],
        edited_students: [],
        to_verify_students: [],
        verified_errors: [],
        verified_students: [],
        students_redirect: false,
        successVerifyModalIsOpen: false,
        errorVerifyModalIsOpen: false,
        createConfirmationModalIsOpen: false,
        loading: true,
        createStudentCount: 0
    }

    componentDidMount() {
        this.getUploadedStudents()
    }

    openSuccessVerifyModal = () => this.setState({ successVerifyModalIsOpen: true });
    closeSuccessVerifyModal = () => {
        this.setState({ 
            errors: this.state.verified_errors,
            students: this.state.verified_students,
            successVerifyModalIsOpen: false
        });
    }

    openErrorVerifyModal = () => this.setState({ errorVerifyModalIsOpen: true });
    closeErrorVerifyModal = () => {
        this.setState({ 
            errors: this.state.verified_errors,
            students: this.state.verified_students,
            errorVerifyModalIsOpen: false 
        });
    }

    openCreateConfirmationModal = () => this.setState({ createConfirmationModalIsOpen: true });
    closeCreateConfirmationModal = () => this.setState({ createConfirmationModalIsOpen: false });

    getUploadedStudents = () => {
        // @thomas i send you the file token here
        api.get(`bulk-import/students?token=${localStorage.getItem('students_import_file_token')}`)
        .then(res => {
            // console.log(res)
            const sorted_errors = this.sortErrors(res.data.errors)
            this.setState({ 
                students: res.data.students,
                errors: sorted_errors,
                loading: false
            })
        })
    }

    handleGetTableEdits = (new_data) => {
        this.setState({ 
            edited_students: new_data,
        }, () => {
            // console.log(this.state.edited_students)
        })
    }

    // TODO: Add method to cancel all changes from table view and return to Users table @jessica
    handleCancelImport = (event) => {
        // redirect to USERS_URL (ignoring all changes from import)
        event.preventDefault()
        this.setState({ loading: true })
        api.delete(`bulk-import/students/delete-temp-file?token=${localStorage.getItem('students_import_file_token')}`)
        .then(res => {
            // console.log(res)
            // @thomas i remove the file token here
            localStorage.removeItem('students_import_file_token')
            this.setState({ 
                students_redirect: true,
                loading: false
            })
        })
        .catch(err => {
            // console.log(err)
            this.setState({ loading: false })
        })
    }

    sortErrors = (errors) => {
        const sorted_errors = errors
        sorted_errors.sort((a, b) => {
            return a.row_num - b.row_num
        })

        const no_duplicates = sorted_errors.reduce((unique, a) => {
            if (!unique.some(err => err.row_num === a.row_num)) {
                unique.push(a)
            }
            return unique
        }, [])
        
        return no_duplicates
    }

    isVerified = (err_arr) => {
        const errors_per_row = err_arr.filter(error => {
            const error_message = error.error_message
            let error_num = 0
            
            if (!error.exclude) {
                for (const [err_type, err_value] of Object.entries(error)) {
                    const is_svr_duplicate = err_type === 'name' && err_value && error_message.name === "Name may already exist in the system"
                    const is_csv_duplicate = err_type === 'duplicate_name' && err_value
                    const is_parent_email_duplicate = err_type === 'duplicate_parent_email' && err_value

                    if (!(is_svr_duplicate || is_csv_duplicate || is_parent_email_duplicate || err_type === 'row_num' 
                    || err_type === 'error_message' || err_type === 'existing_students' || err_type === 'exclude') && err_value) {
                        error_num += 1
                    }
                }
            }
            
            return error_num
        })

        const total_errors = errors_per_row.reduce((a, b) => a + b, 0)
        return total_errors === 0
    }

    verifyImport = (event) => {
        event.preventDefault()
        const data = {
            students: this.state.edited_students
        }
        
        this.setState({ 
            loading: true,
            to_verify_students: data
        })

        api.post(`bulk-import/students/validate`, data)
        .then(res => {
            // console.log(res)
            const data = res.data
            const sorted_errors = this.sortErrors(data.errors)
            this.setState({
                verified_errors: sorted_errors,
                verified_students: data.students,
                loading: false
            }, () => {
                if (this.isVerified(data.errors)) {
                    this.openSuccessVerifyModal()
                } else {
                    this.openErrorVerifyModal()
                }
            })
        })
        .catch(err => {
            this.setState({ loading: false })
        })
    }

    // TODO: Add method to save all changes from table view and submit the import @jessica
    handleSubmitImport = (event) => {
        event.preventDefault()

        this.setState({ loading: true })
        api.post(`bulk-import/students/create`, this.state.to_verify_students)
        .then(res => {
            // console.log(res)
            this.setState({ createStudentCount: res.data.student_count })
            api.delete(`bulk-import/students/delete-temp-file?token=${localStorage.getItem('students_import_file_token')}`)
            .then(res => {
                // console.log(res)
                this.closeSuccessVerifyModal()
                this.openCreateConfirmationModal()
            })
            .catch(err => {
                // console.log(err)
                this.setState({ loading: false })
            })
        })
        .catch(err => {
            this.setState({ loading: false })
        })
    }

    handleStudentsRedirect = () => {
        this.setState({ students_redirect: true })
        localStorage.removeItem('students_import_file_token')
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        if (this.state.students_redirect) {
            return <Navigate to={ STUDENTS_URL }/>
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="students" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root={"Import Students"} isRoot={true} />

                        { localStorage.getItem('students_import_file_token') ?
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div className="row d-inline-flex float-end mb-4">
                                    {/* Cancel button */}
                                    <button type="button" className="btn btn-secondary float-end w-auto me-3"  data-bs-toggle="modal" data-bs-target="#cancelModal">
                                        Cancel
                                    </button>

                                    {/* Cancel confirmation modal */}
                                    <div className="modal fade" id="cancelModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <form onSubmit={this.handleCancelImport}>
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Cancel Import</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure you want to cancel your import? Please note that all edits will be discarded.
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="submit" className="btn btn-secondary" data-bs-dismiss="modal">Yes, discard</button>
                                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">No, keep me on this page</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Verify button */}
                                    <button type="button" className="btn btn-primary float-end w-auto me-3" onClick={this.verifyImport}>Verify</button>

                                    {/* Success verify confirmation modal */}
                                    <Modal backdrop="static" show={this.state.successVerifyModalIsOpen} onHide={this.closeSuccessVerifyModal}>
                                        <form onSubmit={this.handleSubmitImport}>
                                        <Modal.Header>
                                        <Modal.Title><h5>Verify Students</h5></Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            All students have been verified and no errors exist. Your import is ready to be submitted!
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button type="button" className="btn btn-secondary" onClick={this.closeSuccessVerifyModal}>Continue Editing</button>
                                            <button type="submit" className="btn btn-primary">Save and Import</button>
                                        </Modal.Footer>
                                        </form>
                                    </Modal>

                                    {/* Error verify confirmation modal */}
                                    <Modal backdrop="static" show={this.state.errorVerifyModalIsOpen} onHide={this.closeErrorVerifyModal}>
                                        <Modal.Header>
                                        <Modal.Title><h5>Verify Students</h5></Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            Errors still exist in the file import. Please correct them before submitting.
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button type="button" className="btn btn-primary" onClick={this.closeErrorVerifyModal}>Continue Editing</button>
                                        </Modal.Footer>
                                    </Modal>

                                    {/* Create confirmation modal */}
                                    <Modal backdrop="static" show={this.state.createConfirmationModalIsOpen} onHide={this.closeCreateConfirmationModal}>
                                        <form onSubmit={this.handleStudentsRedirect}>
                                        <Modal.Header>
                                        <Modal.Title><h5>Import Students</h5></Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {this.state.createStudentCount} student{this.state.createStudentCount === 1 ? "": "s"} {this.state.createStudentCount === 1 ? "has": "have"} been successfully imported.
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <button type="submit" className="btn btn-primary">OK</button>
                                        </Modal.Footer>
                                        </form>
                                    </Modal>
                                </div>

                                <div className="extra-margin">
                                {this.state.loading ? 
                                    <div class="alert alert-primary mt-2 mb-2" role="alert">
                                        Please wait patiently while we load and verify your file import.
                                    </div> : ""
                                }
                                <div class="alert alert-primary mt-2 mb-2" role="alert">
                                    Please note that all parent users must be imported before students can be associated to them.
                                </div>
                                {(this.state.errors.length !== 0) ? 
                                    this.state.errors.map(error => 
                                        error.exclude ? "" :
                                        <div class="alert alert-danger mt-2 mb-2" role="alert">
                                            <p className="mb-1">Row {error.row_num} contains the errors:</p>
                                            <ul className="mb-0">
                                                {error.student_id ? <li>{error.error_message.student_id}</li> : ""}
                                                {error.name ? <li>{error.error_message.name}</li> : ""}
                                                {error.existing_students.length !== 0 ?
                                                <ul className="mb-0">
                                                    {error.existing_students.map(student => 
                                                    <li>{student.first_name} {student.last_name} with student ID {student.student_id} at {student.school_name}, belonging to a parent with email {student.parent_email}</li>
                                                    )}
                                                </ul> : ""
                                                }
                                                {error.student_email ? <li>{error.error_message.student_email}</li> : ""}
                                                {error.phone_number ? <li>{error.error_message.phone_number}</li> : ""}
                                                {error.parent_email ? <li>{error.error_message.parent_email}</li> : ""}
                                                {error.school_name ? <li>{error.error_message.school_name}</li> : ""}
                                                {error.duplicate_name ? <li>Name may be a duplicate in file import</li> : ""}
                                                {error.duplicate_parent_email ? <li>Parent email is a duplicate in file import</li> : ""}
                                            </ul>
                                        </div>
                                    ) : ""
                                }

                                {this.state.students.length !== 0 ? 
                                <div>
                                    <ImportStudentsTable 
                                    data={this.state.students} 
                                    updateImportData={this.handleGetTableEdits}
                                    />
                                </div>
                                : ""
                                }
                                </div>
                            </div>
                        </div>
                        : 
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="alert alert-danger mt-2 me-3" role="alert">
                                <p className="mb-1">
                                    No file was found. Please upload a csv file through the Students page before attempting to import.
                                </p>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <StudentsImport
        {...props}
        params={useParams()}
    />
);