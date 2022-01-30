import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { API_DOMAIN } from '../../constants';
import { MARKER_ICONS } from '../../constants';
import axios from "axios";
import Geocode from "react-geocode";

class StudentMarker extends Component {
    state = {
        clickNumber: this.props.active_route,
        icon: MARKER_ICONS[this.props.routeID],
        assignMode: this.props.assign_mode,
        location: this.props.location
    }
    handleClick = (e) => {
      if (this.state.clickNumber < MARKER_ICONS.length-1) {
        this.setState({
          clickNumber: this.state.clickNumber+1,
        })
      } else {
        this.setState({
          clickNumber: 0,
        })
      }
      this.setState({
        icon: MARKER_ICONS[this.state.clickNumber]
      })
  }
  render () {
    return (
      <Marker position={this.state.location} icon={this.state.icon} onClick={this.handleClick} />
    )
  }
}
export default React.memo(StudentMarker)