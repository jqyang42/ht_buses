import React, { Component } from 'react'

class SearchBar extends Component {

    render() {
        var handleFilterInputChange = this.props.handleFilterInputChange
        var label = this.props.label

        return (
            <input
                id="search-input"
                type="search" 
                className="form-control w-25 mb-3"
                placeholder={label}
                onChange={handleFilterInputChange}
            />
        )
    }
}

export default React.memo(SearchBar)