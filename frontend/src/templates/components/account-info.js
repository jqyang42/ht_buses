import React, { Component } from 'react'

class UserAccount extends Component {

    componentDidMount() {
        const config = {
        headers: {
            Authorization: `Token ${sessionStorage.getItem('token')}`
        }}
    }

    render() {
        return (
            <div className="col-md-auto mx-2 py-0 mr-4">
                {
                    sessionStorage.getItem('is_staff') == "false" ? 
                    <h6 className="font-weight-bold mb-0"> {sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')} </h6> :
                    <a href={"/account"}><h6 className="font-weight-bold mb-0"> {sessionStorage.getItem('first_name')} {sessionStorage.getItem('last_name')} </h6></a>
                }
                <p className="text-muted text-small">{sessionStorage.getItem('role')}</p>
            </div>
        )
    }
}

export default React.memo(UserAccount)