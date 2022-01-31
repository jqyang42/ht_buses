import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
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
        assignMode: this.props.assignMode,
        location: this.props.location,
        id: this.props.id

    }
    // componentDidUpdate(prevProps, prevState) {
    //   if(prevProps.value.assignMode !== this.props.assignMode) {
    //     this.setState({assignMode: this.props.assignMode});
    //   }
    // }
    handleClick = (e) => {
      console.log(this.state.assignMode)
      if (this.state.assignMode){
        this.setState({
          icon: MARKER_ICONS[this.state.clickNumber]
        })
      }
    }
  render () {
    return (
      <Marker position={this.state.location} icon={this.state.icon} onClick={this.handleClick} id={this.state.id} key={this.state.id}/>
    )
  }
}
export default React.memo(StudentMarker)