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

    change_password = async () => { 
        const data = {
            password: this.state.password
        }
        const res = await api.post(`reset-password?uuid=${this.props.params.uuid}&token=${this.props.params.token}`, data)
        const password_changed = res.data.success 
        this.setState({ edit_success: password_changed ? 1 : -1 })
        return password_changed
    }
   
    send_api_request = event => {
      
        this.change_password().then(password_changed => {
           //Show that password was successfully reset 
        })
        
    }

    componentDidMount() {
        api.get(`reset-password-valid-url?uuid=${this.props.params.uuid}&token=${this.props.params.token}`) 
        .then(res => {
            const valid_url = res.data.success
            if (!valid_url) {
                console.log("invalid") //TODO show bad request page 
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