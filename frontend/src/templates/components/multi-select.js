import React, { Component } from 'react';
import Select from 'react-select';

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

class MultiSelectDropdown extends Component {
  state = {
    selectedOptions: this.props.selectedOptions,
  };

  handleChange = (selectedOptions) => {
    this.setState({ selectedOptions: selectedOptions })
  };

  render() {
    return (
      <Select
        multi={true}
        isMulti={this.props.isMulti}
        value={this.state.selectedOptions}
        onChange={this.handleChange}
        options={this.props.options}
        className="basic-multi-select"
        classNamePrefix="select"
        name="schools"
      />
    );
  }
}

export default React.memo(MultiSelectDropdown)