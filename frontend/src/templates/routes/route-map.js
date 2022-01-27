import axios from "axios";
import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY, API_DOMAIN } from '../../constants';
import Geocode from "react-geocode";

const containerStyle = {
  width: '100%',
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
      icon: "https://www.google.com/mapfiles/marker.png",
      locations: [],
      latLngs: [],
    }
  }
  componentDidMount() {
    axios.get(API_DOMAIN + `schools/routes_planner?id=1`)
      .then(res => {
        const locations = res.data;
        console.log(locations)
        this.setState({ locations });
      })
  }
  handleClick = (e) => {
    this.setState({
      icon: "https://www.google.com/mapfiles/marker_yellow.png"
    })
  }
  handleLoad = (e) => {
    for (const [index, value] of this.state.locations) {
      Geocode.fromAddress(value.address).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          latLngs.push({ lat, lng });
        },
        (error) => {
          console.error(error);
        }
      );
    }
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
            onLoad={handleLoad}
          >
            { /* Child components, such as markers, info windows, etc. */}
            {this.state.routes.map((value, index) => {
              <Marker position={this.state.latLngs[index]} icon={this.state.icon} onClick={this.handleClick} id={value.students[0].id} />
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default React.memo(RouteMap)
