import React, { Component } from "react";
import { useParams } from "react-router-dom";

import UnauthenticatedSidebarMenu from "../components/unauthenticated-sidebar-menu";
import UnauthenticatedHeaderMenu from "../components/unauthenticated-header-menu";
import PasswordForm from "../components/password-form";

class SetupPassword extends Component {
    state = {
        valid_url: 0
    }
    
    sendApiRequest = async (data) => {
        //TODO change to account activation 
        return true
    }

    onChange = () => {
        //placeholder don't delete
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <div className="container-fluid mx-0 px-0 overflow-hidden">
                <div className="row flex-nowrap">
                    <UnauthenticatedSidebarMenu />

                    <div className="col mx-0 px-0 bg-gray w-100">
                        <UnauthenticatedHeaderMenu />
                        <div className="container my-4 mx-0 w-100 mw-100">
                            <PasswordForm type="Reset" source="AccountActivation" sendApiRequest={this.sendApiRequest} onChange={this.onChange}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default (props) => (
    <SetupPassword
        {...props}
        params={useParams()}
    />
);