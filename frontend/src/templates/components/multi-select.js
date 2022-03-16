import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

class MultiSelectDropdown extends Component {
  state = {
    selectedOptions: this.props.selectedOptions,
    options: this.props.options,
    isMulti: this.props.isMulti
  };

  handleChange = (selectedOptions) => {
    this.setState({ selectedOptions: selectedOptions })
    console.log(this.state.selectedOptions)
    console.log(this.state.options)
  };

  render() {
    console.log(this.state.options)
    console.log(this.state.isMulti)
    return (
      <Select
        multi={true}
        isMulti={this.state.isMulti}
        value={this.state.selectedOptions}
        onChange={this.handleChange}
        options={this.state.options}
        className="basic-multi-select"
        classNamePrefix="select"
        name="schools"
        placeholder="Select Schools to Manage"
        components={animatedComponents}
        closeMenuOnSelect={false}
      />
    );
  }
}

export default React.memo(MultiSelectDropdown)