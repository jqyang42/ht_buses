import React, { Component } from 'react'

class UnauthenticatedHeaderMenu extends Component {

    render() {
        return (
            <div className="container mx-0 mt-0 mb-0 px-4 pt-3 pb-2 bg-white mw-100 w-100 shadow-sm">
                <div className="mx-2 py-2">
                    <h5>Hypothetical Transportation Bus Management System</h5>
                </div>
            </div>
        )
    }
}

export default React.memo(UnauthenticatedHeaderMenu)