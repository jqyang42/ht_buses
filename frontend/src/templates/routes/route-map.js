import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';

const x = 50;
const y = 50;
const containerStyle = {
  width: '100%',
  height: '400px'
};
const greatPlaceStyle = {
  width: '200px'
}
const center = {
  lat: -3.745,
  lng: -38.523
};
const pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";

class RouteMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickNumber: 0,
      icon: {
        path: pinSVGHole,
        fillOpacity: 1,
        fillColor: MARKER_COLORS[0],
        strokeWeight: 2,
        strokeColor: "#000000",
        scale: 2,
      }
    }
  }
  handleClick = (e) => {
    if (this.state.clickNumber < Object.keys(MARKER_COLORS).length-1) {
      this.setState({
        clickNumber: this.state.clickNumber+1,
      })
    } else {
      this.setState({
        clickNumber: 0,
      })
    }
    console.log(this.state.clickNumber)
    this.setState({
      icon: {
        path: pinSVGHole,
        fillOpacity: 1,
        fillColor: MARKER_COLORS[this.state.clickNumber],
        strokeWeight: 2,
        strokeColor: "#000000",
        scale: 2,
      }
    })

  }
  render() {
    return (
      <div class='w-100 h-100'>
        <LoadScript
          googleMapsApiKey={GOOGLE_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            { /* Child components, such as markers, info windows, etc. */}
            <Marker position={center} id='icon' icon={this.state.icon} onClick={this.handleClick} style={greatPlaceStyle} />
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }

}

export default React.memo(RouteMap)
