import React, { Component } from 'react'
import { Data, GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { MARKER_ICONS } from '../../constants';
import Geocode from "react-geocode";

class StopMarker extends Component {
    state = {
        currentRoute: this.props.routeID,
        icon: MARKER_ICONS[this.props.routeID],
        location: this.props.location,
        id: this.props.id,
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

    // handleClick = (e) => {
    //   // console.log("map marker on handle click: " + this.props.active_route)
    //   if (this.props.assignMode ){
    //     if (this.state.currentRoute == 0) {
    //       this.setState({
    //         icon: MARKER_ICONS[this.props.active_route],
    //         currentRoute: this.props.active_route
    //       })
    //     } else {
    //       this.setState({
    //         icon: MARKER_ICONS[0],
    //         currentRoute: 0
    //       })
    //     }
    //     if (this.props.onChange) {
    //       this.props.onChange(this.state.currentRoute, this.props.studentIDs)
    //     }
    //   }
    // }
  render () {
    let stringData
    if (this.props.studentNames){
      stringData = this.props.studentNames.join(',\n');
    }
    const { showInfoWindow } = this.state;
    return (
      <Marker 
      position={this.state.location} 
      className={this.state.currentRoute} 
      icon={this.state.icon} 
      onClick={this.handleClick} 
      id={this.state.id} 
      key={this.state.id} 
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseExit}>
        {showInfoWindow && (
          <InfoWindow>
              <h6 className='text-center ms-1 me-0 mt-0 mb-1'>{stringData}</h6>
          </InfoWindow>
        )}
      </Marker>
    )
  }
}
export default React.memo(StopMarker)