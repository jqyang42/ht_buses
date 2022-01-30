import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { MARKER_ICONS } from '../../constants';
import { API_DOMAIN } from '../../constants';
import axios from "axios";
import Geocode from "react-geocode";
import StudentMarker from './map-marker';
import { PARENT_DASHBOARD_URL , LOGIN_URL} from "../../constants";

const containerStyle = {
  width: '100%',
  height: '400px'
};
// const pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";

class RouteMap extends Component {
  state = {
    clickNumber: 0,
    icon: MARKER_ICONS[0],
    locations: [],
    latLngs: [],
    center: {},
    markers: [],
    // assignMode: this.props.assignMode
  }

  componentDidMount() {
    const config = {
      headers: {
        Authorization: `Token ${sessionStorage.getItem('token')}`
      }
    }
    axios.get(API_DOMAIN + `routeplanner?id=4`, config)
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
  // componentDidUpdate(prevProps) {
  //   this.setState({assignMode: this.props.assign_mode});
  // }
  render() {
    if (!JSON.parse(sessionStorage.getItem('logged_in'))) {
      return <Navigate to={LOGIN_URL} />
    }
    else if (!JSON.parse(sessionStorage.getItem('is_staff'))) {
      return <Navigate to={PARENT_DASHBOARD_URL} />
    }
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
            <Marker position={this.state.center}  />
            {this.state.markers.map((value, index) => {
              return <StudentMarker 
                key={index} 
                location={value.position} 
                assignMode={this.props.assign_mode} 
                routeID={1} 
                active_route={3}
                id={value.id} />
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default React.memo(RouteMap)
