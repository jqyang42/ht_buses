import React, { Component } from 'react'
import UserAccount from './account-info'

class HeaderMenu extends Component {

    componentDidMount() {
        const config = {
        headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`
        }}
    }

    render() {
        var root_url = (this.props.root === "Bus Routes") ? "/routes" : (
                       (this.props.root === "Manage Users") ? "/users" : (
                       (this.props.root === "My Dashboard") ? "/dashboard" : (
                       (this.props.root === "My Account") ? "/account" : "/" + this.props.root.toLowerCase() )))

        return (
            <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-0 bg-white mw-100 w-100 shadow-sm">
                <div className="row align-self-center d-flex justify-content-between">
                    {/* <div className="col-md-auto mx-2 py-2 px-2 ps-3"> */}
                    {/* <div className="col-md-auto mx-2 py-2"> */}
                        { this.props.isRoot ? 
                            <div className="col-md-auto mx-2 py-2 px-2 ps-3">
                                <h5>{this.props.root}</h5>
                            </div>
                            : ( this.props.isSecond ?
                                <>
                                    <div className="col-md-auto mx-2 py-2">
                                        <div className="row d-flex align-middle">
                                            <div className="w-auto px-2 ps-3">
                                                {
                                                    sessionStorage.getItem('is_staff') == "false" && this.props.root === "My Account" ? 
                                                    <h5>{this.props.root}</h5> :
                                                    <a href={root_url}><h5>{this.props.root}</h5></a>
                                                }
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <h5>{this.props.name}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </> :
                                <>
                                    <div className="col-md-auto mx-2 py-2">
                                        <div className="row d-flex align-middle">
                                            <div className="w-auto px-2 ps-3">
                                                {
                                                    !sessionStorage.getItem('is_staff') && this.props.root === "My Account" ? 
                                                    <h5>{this.props.root}</h5> :
                                                    <a href={root_url}><h5>{this.props.root}</h5></a>
                                                }
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <a href={root_url + "/" + this.props.id}><h5>{this.props.name}</h5></a>
                                            </div>
                                            <div className="w-auto px-2">
                                                <i className="bi bi-chevron-right"></i>
                                            </div>
                                            <div className="w-auto px-2">
                                                <h5>{this.props.page}</h5>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </>
                            )
                        }
                        <UserAccount />
                    {/* </div> */}
                </div>
            </div>
        )
    }
}

export default React.memo(HeaderMenu)