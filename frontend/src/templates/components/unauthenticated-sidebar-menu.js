import React, { Component } from 'react'
import { HT_LOGO } from "../../constants";

class UnauthenticatedSidebarMenu extends Component {
    render() {
        return (
            <div className="col-auto col-md-3 col-xl-2 px-0 bg-dark">
                <div className="d-flex flex-column align-items-center align-items-sm-start mx-0 px-0 pt-2 text-white sidebar">
                    <a href="/" className="d-flex align-items-center my-0 mx-2 px-4 pb-3 me-md-auto text-white text-decoration-none">
                        <img src={HT_LOGO} className="img-logo img-fluid float-start pt-4 pb-3 px-1" alt="Hypothetical Transportation"></img>
                    </a>
                </div>
            </div>
        )
    }
}

export default React.memo(UnauthenticatedSidebarMenu)
