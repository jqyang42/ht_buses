import React, { Component } from 'react'

class UserAccount extends Component {

    componentDidMount() {
        const config = {
        headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
        }}
    }

    render() {
        return (
            <div className="col-md-auto mx-2 py-0 mr-4">
                <a href={"/account"}><h6 className="font-weight-bold mb-0"> {localStorage.getItem('first_name')} {localStorage.getItem('last_name')} </h6></a>
                <p className="text-muted text-small">{localStorage.getItem('role')}</p>
            </div>
        )
    }
}

export default React.memo(UserAccount)