import React, { Component } from "react";
import { useLocation } from "react-router";
import { Link, Navigate, useParams} from "react-router-dom";
import { ImportUsersTable } from '../tables/import-users-table';
import SidebarMenu from '../components/sidebar-menu';
import HeaderMenu from '../components/header-menu';
import { getPage } from "../tables/server-side-pagination";

import { LOGIN_URL } from '../../constants';
import { USERS_CREATE_URL, PARENT_DASHBOARD_URL } from "../../constants";
import api from "../components/api";

class UsersImport extends Component {
    state = {
        users : [],
        show_all: false,
        pageIndex: 1,
        canPreviousPage: null,
        canNextPage: null,
        totalPages: null,
        sortOptions: {
            accessor: '',
            sortDirection: 'none'
        },
        searchValue: '',
    }

    componentDidMount() {
        // this.getUsersPage(this.state.pageIndex, this.state.sortOptions, this.state.searchValue)
        // console.log(this.props.location.state)
        // TODO: @jessica get backend data from file import here
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
            this.setState({ users: res.data.users })
        })
    }

    // TODO: Add method to cancel all changes from table view and return to Users table @jessica
    handleCancelImport = () => {
        // redirect to USERS_URL (ignoring all changes from import)
    }

    // TODO: Add method to save all changes from table view and submit the import @jessica
    handleSubmitImport = () => {
        // save table changes
        // update backend
        // redirect to USERS_URL
    }

    render() {
        if (!JSON.parse(localStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        else if (!JSON.parse(localStorage.getItem('is_staff'))) {
            return <Navigate to={PARENT_DASHBOARD_URL} />
        }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <SidebarMenu activeTab="users" />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root={"Import Users"} isRoot={true} />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <div className="container-fluid px-4 ml-2 mr-2 py-4 my-4 bg-white shadow-sm rounded align-content-start">
                                <div className="row d-inline-flex float-end">
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
                                <div>
                                    <ImportUsersTable 
                                    data={this.state.users} 
                                    showAll={this.state.show_all}
                                    pageIndex={this.state.pageIndex}
                                    canPreviousPage={this.state.canPreviousPage}
                                    canNextPage={this.state.canNextPage}
                                    // updatePageCount={this.getUsersPage}
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

export default (props) => (
    <UsersImport
        {...props}
        params={useParams()}
    />
);