import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '../constants';

const containerStyle = {
  width: '400px',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

class RouteMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: "https://www.google.com/mapfiles/marker.png"
    }
  }
  handleClick = (e) => {
    this.setState({
      icon: "https://www.google.com/mapfiles/marker_yellow.png"
    })

  }
  render() {
    return (
      <div>
        <LoadScript
          googleMapsApiKey={GOOGLE_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
          >
            { /* Child components, such as markers, info windows, etc. */}
            <Marker position={center} icon={this.state.icon} onClick={this.handleClick} />
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }

}

export default React.memo(RouteMap)
