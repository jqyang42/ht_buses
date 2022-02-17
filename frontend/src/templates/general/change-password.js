import React, { Component } from "react";
import { Link , Navigate} from "react-router-dom";
import { useParams } from "react-router-dom";
import { passwordRegex } from "../regex/input-validation";
import ParentSidebarMenu from '../components/parent-sidebar-menu';
import HeaderMenu from "../components/header-menu";
import api from "../components/api";

import { LOGIN_URL } from "../../constants";
import SidebarMenu from "../components/sidebar-menu";
import PasswordForm from "../components/password-form";

class ChangePassword extends Component {

    state = {
        valid_url: false
    }

    sendApiRequest = () => {
    }

    componentDidMount() {
        console.log(sessionStorage.getItem('is_staff'))
    }

    render() {
        if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
            return <Navigate to={LOGIN_URL} />
        }
        // const { redirect } = this.state;
        // const redirect_url = USERS_URL + '/' + this.props.params.id;
        // if (redirect) {
        //     return <Navigate to={ PARENT_DASHBOARD_URL }/>;
        // }
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    {
                        sessionStorage.getItem('is_staff') == "false" ? <ParentSidebarMenu /> : <SidebarMenu />
                    }

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <HeaderMenu root="My Account" isRoot={false} isSecond={true} name="Change Password" />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <PasswordForm type="Change" sendApiRequest={this.sendApiRequest} validUrl={this.state.valid_url}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <ChangePassword
        {...props}
        params={useParams()}
    />
);