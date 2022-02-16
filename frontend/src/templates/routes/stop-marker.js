import React, { Component } from 'react'
import { Data, GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { STOP_MARKER_ICONS } from '../../constants';
import Geocode from "react-geocode";

const options = {
  fillColor: "#FFC107",
  strokeColor: "#FFC107",
  strokeOpacity: 1,
  strokeWeight: 1.5,
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1
}

class StopMarker extends Component {

    state = {
        currentRoute: this.props.routeID,
        icon: STOP_MARKER_ICONS[this.props.routeID],
        location: this.props.location,
        name: this.props.name,
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

  render () {
    let stringData
    if (this.state.name){
      stringData = this.state.name;
    }
    const { showInfoWindow } = this.state;
    return (
      <>
      <Marker 
      position={this.state.location} 
      className={this.state.currentRoute} 
      icon={this.state.icon} 
      id={this.props.id} 
      key={this.props.id} 
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseExit}>
        {showInfoWindow && (
          <InfoWindow>
              <h6 className='text-center ms-1 me-0 mt-0 mb-1'>{stringData}</h6>
          </InfoWindow>
        )}
      </Marker>
      
      <Circle
      center={this.state.location}
      radius={482.8032}
      options={options}/></>
    )
  }
}
export default React.memo(StopMarker)