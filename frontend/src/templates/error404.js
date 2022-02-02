import axios from 'axios';
import React, { Component } from "react";

class Error404 extends Component {

    render() {
        return (
            <div className="bg-gray vh-100 container-fluid mx-0 px-0 my-0 py-0 vw-100 bg-gray">
                <div className="container-fluid d-flex my-4 py-4 overflow-hidden align-items-center justify-content-center">
                    <div className='row my-4 py-4 align-middle d-flex justify-content-center'>
                        <div className='col my-4 py-4 align-middle my-auto'>
                            <h1 className="text-center mt-4 pt-4 gigantic gray-600">404</h1>
                            <h3 className="text-center gray-600">The page you were looking for does not exist.</h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default React.memo(Error404);