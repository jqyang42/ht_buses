import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { MARKER_ICONS } from '../../constants';

import Geocode from "react-geocode";
import StudentMarker from './student-marker';
import StopMarker from './stop-marker';
import { PARENT_DASHBOARD_URL , LOGIN_URL} from "../../constants";

const containerStyle = {
  width: '100%',
  height: '400px'
};
const hidePOIs = [{
  "featureType": "poi",
  "elementType": "labels.icon",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
{
  "featureType": "all",
  "elementType": "labels.text",
  "stylers": [
    {
      "visibility": "off"
    }
  ]
},
]

class RouteMap extends Component {
  state = {
    locations: [],
    latLngs: [],
    center: {},
    markers: [],
    stops: [],
  }

  students = [];

  handleRouteIDChange = (routeID, studentIDs) => {
    for (let i = 0; i < studentIDs.length; i++) {
      this.students.push({
        "id": studentIDs[i],
        "route_id": parseInt(routeID)
      })
      // console.log(this.students)
      // console.log("Map onHandleRouteIDChange Active Route: " + this.props.active_route)
    }
    if(this.props.onChange) {
      this.props.onChange(this.students);
    }
  }

  createStopMarker = (event) => {
    const coords = event.latLng.toJSON() 
    console.log(coords)
    if (this.props.assignMode ) {
      this.setState({
        stops: [...this.state.stops, {
          position: coords,
          routeID: this.props.active_route,
        }]
      })
    }
  }

  render() {
    // console.log("Map onRender Active Route: " + this.props.active_route)
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
              lat: parseFloat(this.props.center.lat),
              lng: parseFloat(this.props.center.lng)
            }}
            options={{
              styles: hidePOIs
            }}
            zoom={13}
            onClick={this.createStopMarker}
          >
            <Marker position={this.props.center}  />
            {this.props.markers?.map((value, index) => {
              return <StudentMarker 
                key={index} 
                location={value.position} 
                assignMode={this.props.assign_mode} 
                routeID={value.routeID} 
                active_route={this.props.active_route}
                id={value.id}
                studentIDs={value.studentIDs}
                studentNames={value.studentNames}
                onChange={this.handleRouteIDChange} />
            })}
            {this.state.stops?.map((value, index) => {
              return <StopMarker 
              key={index}
              id={index}
              location={value.position}
              assignMode={this.props.assign_mode} 
              routeID={value.routeID}
              active_route={this.props.active_route} />
            })}
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default React.memo(RouteMap)
