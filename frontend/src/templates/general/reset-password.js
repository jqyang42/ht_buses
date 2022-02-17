import React, { Component } from "react";
import { useParams } from "react-router-dom";
import api from "../components/api";

import UnauthenticatedSidebarMenu from "../components/unauthenticated-sidebar-menu";
import UnauthenticatedHeaderMenu from "../components/unauthenticated-header-menu";
import PasswordForm from "../components/password-form";

class ResetPassword extends Component {
    state = {
        valid_url: 0,

    }

    validate_url = async () => {
        const res = await api.get(`reset-password-valid-url?uuid=${this.props.params.uuid}&token=${this.props.params.token}`)
        this.setState({ valid_url: res.data.success ? 1 : -1 }) 
        return res.data.success
    }

    componentDidMount() {
        this.valid_url().then(valid_url => {
            if (!valid_url) {
                console.log("invalid page")
               //TODO show bad request page 
            }
        }) 
    }

    render() {
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <UnauthenticatedSidebarMenu />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <UnauthenticatedHeaderMenu />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <PasswordForm type="Reset"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <ResetPassword
        {...props}
        params={useParams()}
    />
);