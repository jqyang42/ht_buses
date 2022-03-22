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
  
    checkURL = () => {
        // console.log("there")
      api.get(`reset-password-valid-url?uuid=${this.props.params.uuid}&token=${this.props.params.token}`) 
        .then(res => {
            const valid_url = res.data.success
            this.setState({ valid_url: valid_url ? 1 : -1 })
            if(JSON.parse(localStorage.getItem('logged_in'))) {
                this.logoutUser()
            }
        })
    }

    logoutUser = () => {
        const creds = {
            user_id: localStorage.getItem('user_id')
        }
        api.post(`logout`, creds)
        .then(res => {
            this.setState({token: ''})
            localStorage.setItem('token', '')
            localStorage.setItem('user_id', '')
            localStorage.setItem('first_name', '')
            localStorage.setItem('last_name', '')
            localStorage.setItem('is_staff', false)
            localStorage.setItem('is_parent', false)
            localStorage.setItem('logged_in', false)
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
                {this.state.valid_url === -1 ? <p>{" This url is not valid or it has expired."}  <a href="/" className="mt-0">Click here to go to our home page.</a></p>  :
                <div className="row flex-wrap">
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