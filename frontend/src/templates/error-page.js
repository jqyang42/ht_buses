import React, { Component } from "react";

class ErrorPage extends Component {

    render() {
        var code = this.props.code
        var label = (code === 404) ? ("Page Not Found") : (
                  (code === 400) ? ("Bad Request") : (
                  (code === 401) ? ("Unauthorized") : (
                  (code === 500) ? ("Internal Server Error") : ""
                  )))
        var msg = (code === 404) ? ("The page you were looking for does not exist.") : (
                  (code === 400) ? ("Your browser has sent a request that this server could not understand.") : (
                  (code === 401) ? ("You do not have permission to view this page due to invalid credentials.") : (
                  (code === 500) ? ("The server encountered an internal error or misconfiguration and was unable to complete your request.") : ""
                  )))


        return (
            <div className="bg-gray vh-100 container-fluid mx-0 px-0 my-0 py-0 vw-100 bg-gray">
                <div className="container-fluid d-flex py-4 overflow-hidden align-items-center justify-content-center">
                    <div className='row my-4 py-4 align-middle d-flex justify-content-center'>
                        <div className='col my-4 py-4 align-middle my-auto'>
                            <h1 className="text-center mt-4 pt-4 gigantic gray-600">{code}</h1>
                            <h2 className="text-center big gray-600">{label}</h2>
                            <h3 className="text-center gray-600">{msg}</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default React.memo(ErrorPage);