import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY, API_DOMAIN } from '../../constants';
import Geocode from "react-geocode";

const containerStyle = {
  width: '100%',
  height: '400px'
};

class RouteMap extends Component {
  state = {
    icon: "https://www.google.com/mapfiles/marker.png",
    locations: this.props.locations,
    latLngs: [],
    center: { lat: 0, lng: 0 },
  }

  handleClicks = (e) => {
    this.setState({
      icon: "https://www.google.com/mapfiles/marker_yellow.png"
    })
  }
  handleClick = (e) => {
    Geocode.fromAddress(this.state.locations.address).then(
      (response) => {
        this.setState({
          center: response.results[0].geometry.location
        })
      },
      (error) => {
        console.error(error);
      }
    )
    for (const [index, value] of this.state.locations) {
      Geocode.fromAddress(value.addresses).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          this.state.latLngs.push({ lat, lng });
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  render() {
    // Geocode.fromAddress(this.state.locations.address).then(
    //   (response) => {
    //     const center = response.results[0].geometry.location;
    //     this.setState({ center });
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    // for (const [index, value] of this.state.locations) {
    //   Geocode.fromAddress(value.addresses).then(
    //     (response) => {
    //       const { lat, lng } = response.results[0].geometry.location;
    //       this.state.latLngs.push({ lat, lng });
    //     },
    //     (error) => {
    //       console.error(error);
    //     }
    //   );
    // }
    return (
      <div class='w-100 h-100'>
        <LoadScript
          googleMapsApiKey={GOOGLE_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={this.state.center}
            zoom={15}
            onLoad={() => this.handleClick}
          >
            { /* Child components, such as markers, info windows, etc. */}
            {this.state.routes.map((value, index) => {
              <Marker position={this.state.latLngs[index]} icon={this.state.icon} onClick={this.handleClicks} id={value.students[0].id} />
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default React.memo(RouteMap)
