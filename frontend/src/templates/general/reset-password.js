import React, { Component } from "react";
import { useParams } from "react-router-dom";
import api from "../components/api";
import { Navigate} from "react-router-dom";

import UnauthenticatedSidebarMenu from "../components/unauthenticated-sidebar-menu";
import UnauthenticatedHeaderMenu from "../components/unauthenticated-header-menu";
import PasswordForm from "../components/password-form";
import { LOGIN_URL } from "../../constants";

class ResetPassword extends Component {

    
    state = {
        valid_url: 0,
        type: "Reset Password"
    }

    sendApiRequest = async (data) => {
        const valid_url_response = await api.get(`reset-password-valid-url?uuid=${this.props.params.uuid}&token=${this.props.params.token}`)
        if(valid_url_response.data.success) {
            const res = await api.patch(`reset-password?uuid=${this.props.params.uuid}&token=${this.props.params.token}`, data)
            const password_changed = res.data.success 
            return password_changed
        }
        else {
            this.setState({ valid_url: -1 })
            return false
        }
    }
  
    checkURL() {
      api.get(`reset-password-valid-url?uuid=${this.props.params.uuid}&token=${this.props.params.token}`) 
        .then(res => {
            const valid_url = res.data.success
            this.setState({ valid_url: valid_url ? 1 : -1 })
            if(JSON.parse(sessionStorage.getItem('logged_in'))) {
                this.logoutUser()
            }
        })
    }

    logoutUser = () => {
        const creds = {
            user_id: sessionStorage.getItem('user_id')
        }
        api.post(`logout`, creds)
        .then(res => {
            this.setState({token: ''})
            sessionStorage.setItem('token', '')
            sessionStorage.setItem('user_id', '')
            sessionStorage.setItem('first_name', '')
            sessionStorage.setItem('last_name', '')
            sessionStorage.setItem('is_staff', false)
            sessionStorage.setItem('logged_in', false)
        })
    }

    componentDidMount() {
        this.setState({ type: this.props.source })
        this.setState({ valid_url: 0 })
        this.checkURL()
    }

    render() {
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                {this.state.valid_url === -1 ? "Url link has expired." :
                <div className="row flex-nowrap">
                    <UnauthenticatedSidebarMenu />
                    <div className="col mx-0 px-0 bg-gray w-100">
                        <UnauthenticatedHeaderMenu />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <PasswordForm type={this.state.type} source="ResetPassword" sendApiRequest={this.sendApiRequest} checkURL={this.checkURL}/>
                        </div>
                    </div>
                </div>
    }
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