import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { API_DOMAIN } from '../../constants';
import axios from "axios";
import Geocode from "react-geocode";

const x = 50;
const y = 50;
const containerStyle = {
  width: '100%',
  height: '400px'
};
const pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";

class RouteMap extends Component {
  state = {
    clickNumber: 0,
    icon: {
      path: pinSVGHole,
      fillOpacity: 1,
      fillColor: MARKER_COLORS[0],
      strokeWeight: 2,
      strokeColor: "#000000",
      scale: 2,
    },
    locations: [],
    latLngs: [],
    center: {},
    markers: [],
  }
  handleClick = (marker, e) => {
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
      <div class='w-100 h-100'>
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
            <Marker position={this.state.center} icon={this.state.icon} onClick={this.handleClick} />
            {this.state.markers.map((value, index) => {
              return <Marker key={index} position={value.position} icon={value.icon} onClick={this.handleClick} id={value.id} />
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default React.memo(RouteMap)
