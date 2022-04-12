import React, { Component } from 'react'
import { Data, GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { STOP_MARKER_ICONS } from '../../constants';
import Geocode from "react-geocode";

// const options = {
//   fillColor: "#FFC107",
//   strokeColor: "#FFC107",
//   strokeOpacity: 1,
//   strokeWeight: 1.5,
//   fillOpacity: 0.35,
//   clickable: false,
//   draggable: false,
//   editable: false,
//   visible: true,
//   zIndex: 1
// }

class SchoolMarker extends Component {

    state = {
        // location: this.props.location,
        // name: this.props.name,
        showInfoWindow: false
      };

    handleClick = (event) => {
      this.setState(prevState => ({
        showInfoWindow: !prevState.showInfoWindow
      }))
    }


  render () {
    const  showInfoWindow  = this.state.showInfoWindow;
    // console.log(this.props.location)
    return (
      <>
      <Marker 
      position={this.props.location} 
      id={this.props.id} 
      onClick={this.handleClick}
      onDragEnd={this.editLocation}
      draggable={this.props.assign_mode}>
        {showInfoWindow && (
          <InfoWindow options={{maxWidth:300}}>
            { 
              <>
                <h6 className="mb-0">{this.props.name}</h6>
              </>
            }
          </InfoWindow>
        )}
      </Marker></>
    )
  }
}
export default React.memo(SchoolMarker)