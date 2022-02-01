import axios from 'axios';
import React, { Component } from "react";
import { Link, Navigate} from "react-router-dom";
import { API_DOMAIN } from '../constants';

class Error404 extends Component {

    componentDidMount() {
        const config = {
            headers: {
              Authorization: `Token ${sessionStorage.getItem('token')}`
            }
        }
    }

    render() {

        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden align-items-center">
                <div className=''>
                    <h1>404</h1>
                    <h3>The page you were looking for does not exist.</h3>
                </div>
            </div>
        );
    }
}

export default Error404;