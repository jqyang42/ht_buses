import React, { Component } from 'react'
import { Data, GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { MARKER_ICONS } from '../../constants';
import Geocode from "react-geocode";

class StudentMarker extends Component {
    state = {
        currentRoute: this.props.routeID,
        icon: MARKER_ICONS[this.props.routeID % MARKER_ICONS.length],
        updated: false,
        showInfoWindow: false
      };

      handleMouseOver = e => {
          this.setState({
              showInfoWindow: true
          });
      };
      handleMouseExit = e => {
          this.setState({
              showInfoWindow: false
          });
      };

    handleClick = (e) => {
      if (this.props.assign_mode ){
        if (this.state.currentRoute != this.props.active_route) {
          this.setState({
            icon: MARKER_ICONS[this.props.active_route % MARKER_ICONS.length],
            currentRoute: this.props.active_route
          })
        } else {
          this.setState({
            icon: MARKER_ICONS[0],
            currentRoute: 0
          })
        }
        if (this.props.onChange) {
          this.props.onChange(this.state.currentRoute, this.props.studentIDs)
        }
      }
    }
  render () {
    let stringData
    if (this.props.studentNames){
      stringData = this.props.studentNames.join(',\n');
    }
    const { showInfoWindow } = this.state;
    return (
      <Marker 
      position={this.props.location} 
      className={this.state.currentRoute} 
      icon={this.state.icon} 
      onClick={this.handleClick} 
      id={this.props.id} 
      key={this.props.id} 
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseExit}>
        {showInfoWindow && (
          <InfoWindow>
              <h6 className='text-center ms-1 me-0 mt-0 mb-0'>{stringData}</h6>
          </InfoWindow>
        )}
      </Marker>
    )
  }
}
export default React.memo(StudentMarker)