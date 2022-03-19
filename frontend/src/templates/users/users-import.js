import React, { Component } from "react";
import { useLocation } from "react-router";
import { Link, Navigate, useParams} from "react-router-dom";
import { ImportUsersTable } from '../tables/import-users-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL, USERS_URL } from '../../constants';
import { USERS_CREATE_URL, PARENT_DASHBOARD_URL } from "../../constants";
import api from "../components/api";

class UsersImport extends Component {
    state = {
        users: [],
        errors: [],
        edited_users: [],
        // show_all: false,
        // pageIndex: 1,
        // canPreviousPage: null,
        // canNextPage: null,
        // totalPages: null,
        // sortOptions: {
        //     accessor: '',
        //     sortDirection: 'none'
        // },
        // searchValue: '',
        users_redirect: false
    }

    componentDidMount() {
        // this.getUsersPage(this.state.pageIndex, this.state.sortOptions, this.state.searchValue)
        // console.log(this.props.location.state)
        this.getUploadedUsers()
    }

    // pagination
    // getUsersPage = (page, sortOptions, search) => {
    //     getPage({ url: 'users', pageIndex: page, sortOptions: sortOptions, searchValue: search })
    //     .then(res => {
    //         this.setState({
    //             users: res.data.users,
    //             pageIndex: res.pageIndex,
    //             canPreviousPage: res.canPreviousPage,
    //             canNextPage: res.canNextPage,
    //             totalPages: res.totalPages,
    //             sortOptions: sortOptions,
    //             searchValue: search
    //         })
    //     })
    // }
    
    // render handlers
    // handleShowAll = () => {
    //     this.setState(prev => ({
    //         show_all: !prev.show_all
    //     }), () => {
    //         this.getUsersPage(this.state.show_all ? 0 : 1, this.state.sortOptions, this.state.searchValue)
    //     })
    // }

    getUploadedUsers = () => {
        api.get(`bulk-import/users`)
        .then(res => {
            console.log(res)
            // const temp = res.data.users
            this.setState({ 
                users: res.data.users,
                errors: res.data.errors
            })
        })
        // getPage({ url: 'users', pageIndex: 0, sortOptions: null, searchValue: '' })
        // .then(res => {
        //     console.log(res)
        //     this.setState({ users: res.data.users })
        // })
    }

    handleGetTableEdits = (new_data) => {
        this.setState({ edited_users: new_data }, () => {
            console.log(this.state.edited_users)
        })
    }

    // TODO: Add method to cancel all changes from table view and return to Users table @jessica
    handleCancelImport = (event) => {
        // redirect to USERS_URL (ignoring all changes from import)
        event.preventDefault()
        api.delete(`bulk-import/users/delete-temp-file`)
        .then(res => {
            console.log(res)
            this.setState({ users_redirect: true })
        })
        .catch(err => {
            console.log(err)
        })
    }

    // TODO: Add method to save all changes from table view and submit the import @jessica
    handleSubmitImport = (event) => {
        event.preventDefault()

        // save table changes
        const data = {
            users: this.state.edited_users
        }

        api.post(`bulk-import/users/create`, data)
        .then(res => {
            console.log(res)
            // this.setState({ users_redirect: true })
        })
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        if (this.state.users_redirect) {
            return <Navigate to={ USERS_URL }/>
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root={"Import Users"} isRoot={true} />
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
                                    <button type="button" className="btn btn-primary float-end w-auto me-3" data-bs-toggle="modal" data-bs-target="#verifyModal" onClick={this.verifyImport}>Verify</button>

                                    {/* Verify confirmation modal */}
                                    <div className="modal fade" id="verifyModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <form onSubmit={this.handleSubmitImport}>
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Verify Users</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        { this.state.verifyCheck ? "All users have been verified and no errors exist. Your import is ready to be submitted!" :
                                                        "Errors still exist in the file import. Please correct them before submitting."
                                                        }
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">OK</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit button */}
                                    <button type="button" className="btn btn-primary float-end w-auto me-3" data-bs-toggle="modal" data-bs-target="#submitModal">Save and Import</button>

                                    {/* Submit confirmation modal */}
                                    <div className="modal fade" id="submitModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <form onSubmit={this.handleSubmitImport}>
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Import Users</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Are you sure you want to save and import all users?
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Confirm</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="extra-margin">
                                {(this.state.errors.length !== 0) ? 
                                    this.state.errors.map(error => 
                                        <div class="alert alert-danger mt-2 mb-2" role="alert">
                                            <p className="mb-1">Row {error.row_num} contains the errors:</p>
                                            <ul className="mb-0">
                                                {!error.name ? "" : <li>{error.error_message.name}</li> +
                                                    error.existing_users.length !== 0 ?
                                                    <ul className="mb-0">
                                                    {error.existing_users.map(user => 
                                                        <li>{user.name} with {user.address !== "" ? "" : "no"} address {user.address} and phone number {user.phone_number}</li>
                                                    )}
                                                    </ul>
                                                 : ""
                                                }
                                                {error.email ? <li>{error.error_message.email}</li> : ""}
                                                {error.address ? <li>{error.error_message.address}</li> : ""}
                                                {error.phone_number ? <li>{error.error_message.phone_number}</li> : ""}
                                                {error.duplicate_name ? <li>Name may be a duplicate in file import</li> : ""}
                                                {error.duplicate_email ? <li>Email is a duplicate in file import</li> : ""}
                                            </ul>
                                        </div>
                                    ) : ""
                                }

                                {this.state.users.length !== 0 ? 
                                <div>
                                    <ImportUsersTable 
                                    data={this.state.users} 
                                    // showAll={this.state.show_all}
                                    // pageIndex={this.state.pageIndex}
                                    // canPreviousPage={this.state.canPreviousPage}
                                    // canNextPage={this.state.canNextPage}
                                    // updatePageCount={this.getUsersPage}
                                    // pageSize={10}
                                    // totalPages={this.state.totalPages}
                                    // searchValue={this.state.searchValue}
                                    updateImportData={this.handleGetTableEdits}
                                    />
                                    {/* <button className="btn btn-secondary align-self-center" onClick={this.handleShowAll}>
                                        { !this.state.show_all ?
                                            "Show All" : "Show Pages"
                                        }
                                    </button> */}
                                </div>
                                : ""
                                }
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
    <UsersImport
        {...props}
        params={useParams()}
    />
);