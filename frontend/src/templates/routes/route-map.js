import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY, API_DOMAIN } from '../../constants';
import axios from "axios";
import Geocode from "react-geocode";

const containerStyle = {
  width: '100%',
  height: '400px'
};

class RouteMap extends Component {
  state = {
    icon: "https://www.google.com/mapfiles/marker.png",
    locations: [],
    latLngs: [],
    center: {},
    markers: [],
    isMarkerShown: false
  }
  componentDidMount() {
    axios.get(API_DOMAIN + `routeplanner?id=4`)
      .then(res => {
        const locations = res.data;
        this.setState({ locations });
        Geocode.fromAddress(locations.address).then(
          (response) => {
            const lat = parseFloat(response.results[0].geometry.location.lat);
            const lng = parseFloat(response.results[0].geometry.location.lng);
            this.setState({
              center: { lat: lat, lng: lng }
            })
          },
          (error) => {
            console.error(error);
          }
        )
        locations.addresses.map((address, index) => {
          Geocode.fromAddress(address.address).then(
            (response) => {
              const lat = parseFloat(response.results[0].geometry.location.lat);
              const lng = parseFloat(response.results[0].geometry.location.lng);
              this.setState(prevState => ({
                markers: [...prevState.markers, {
                  position: {
                    lat: lat,
                    lng: lng
                  },
                  icon: this.state.icon,
                  onClick: this.handleClicks,
                  id: address.parent_id
                }]
              }))
            },
            (error) => {
              console.error(error);
            }
          );
        })
      })
  }
  render() {
    return (
      <div className='w-100 h-100'>
        <LoadScript
          googleMapsApiKey={GOOGLE_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: parseFloat(this.state.center.lat),
              lng: parseFloat(this.state.center.lng)
            }}
            zoom={15}
          >
            <Marker position={this.state.center} icon={this.state.icon} onClick={this.handleClicks} />
            {this.state.markers.map((value, index) => {
              return <Marker position={value.position} icon={value.icon} onClick={value.onClick} id={value.id} />
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default React.memo(RouteMap)
