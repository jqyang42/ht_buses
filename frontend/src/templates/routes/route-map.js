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
    stops: [],
    showModal: false,
    center: {
      lat: parseFloat(this.props.center.lat),
      lng: parseFloat(this.props.center.lng)
    },
    // new_stops = []
  }

  studentsChanged = []

  handleCenterChange = (event) => {
    //TODO: update state with new center
  }

  // onChange
  handleRouteChanges = (routeID, studentIDs) => {
    for (let i = 0; i < studentIDs.length; i++) {
      this.studentsChanged.push({
        "id": studentIDs[i],
        "route_id": parseInt(routeID),
        "in_range": false
      })
    }
    if (this.props.onChange) {
      this.props.onChange(this.studentsChanged);
    }
  }

  // newStops = [];

  // Handles onClick
  createStopMarker = (event) => {
    const coords = event.latLng.toJSON() 
    if (this.props.assign_mode ) {
      const newStop = {
        name: "",
        lat: coords.lat,
        long: coords.lng,
        route_id: this.props.active_route,
        arrival: "00:00",
        departure: "00:00"
      }
      // this.newStops.push(newStop)
      this.setState(prevState => ({
        stops: [...prevState.stops, newStop]
      }))
    }
    this.handleStopCreate()
    this.setState({ showModal: true })
    console.log(this.state.showModal)
    // document.getElementById("staticBackdrop").modal({ show: true, backdrop: false, keyboard: false });
  }

  handleStopNameChange = (name, key) => {
    const newStops = this.state.stops;
    const newStop = newStops[key];
    newStop.name = name;
    newStops[key] = newStop;
    console.log(newStops);
    this.setState({
      stops: newStops
    }, this.handleStopCreate()) 
  }

  handleStopCreate = () => {
    if (this.props.handleStopCreation) {
      console.log(this.state.stops)
      this.props.handleStopCreation(this.state.stops)
    }
  }

  // handleDeleteMarker = (id) => {
  //   // console.log(this.state.stops)
  //   console.log(id)
  //   // this.setstate whatever

  //   // const new_stops = this.state.stops
  //   // const delete_index = new_stops.indexOf(id)
  //   // new_stops.splice(delete_index, 1)
  //   // console.log(new_stops)
  //   // this.setState({ stops: new_stops })
  // }

  handleUpdateStops = (event, index) => {
    event.preventDefault()
    // console.log(this.state.stops)
    const value = this.state.stops[index]
    // console.log(value)
    const new_stops = this.state.stops.filter(stop => stop !== value)

    // console.log(index)

    // const new_stops = this.state.stops
    // console.log(new_stops)
    // new_stops.splice(index, 1)
    // console.log(new_stops)
    this.setState({ stops: new_stops })
  }

  counter = 0
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
              lat: parseFloat(this.props.center.lat),
              lng: parseFloat(this.props.center.lng)
            }}
            options={{
              styles: hidePOIs
            }}
            zoom={13}
            onClick={this.createStopMarker}
            onCenterChanged={this.handleCenterChange}
          >
            <Marker position={this.props.center}  />
            {this.props.students?.map((value, index) => {
              return <StudentMarker 
                key={`${value.position.lat}+${value.position.long}`} 
                location={value.position} 
                assign_mode={this.props.assign_mode} 
                routeID={value.routeID} 
                active_route={this.props.active_route}
                id={value.id}
                studentIDs={value.studentIDs}
                studentNames={value.studentNames}
                onChange={this.handleRouteChanges} 
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"/>
            })}
            {this.state.stops?.map((value, index) => {
              return <StopMarker 
              key={`${value.lat}+${value.long}`}
              id={index}
              name={""}
              location={{
                lat: value.lat,
                lng: value.long
              }
            }
              assign_mode={this.props.assign_mode} 
              routeID={value.route_id}
              // handleDeleteMarker={this.handleDeleteMarker}
              handleUpdateStops={this.handleUpdateStops}
              handleStopNameChange={this.handleStopNameChange}/>
            })}
          </GoogleMap>
        </LoadScript>

        {/* Modal for Add Stop form */}
        {this.state.showModal ?
          <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">Add Stop</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={this.resetAddRouteSuccess}></button>
                </div>
                <form id="add-stop-form" onSubmit={this.handleRouteCreateSubmit}>
                    <div className="modal-body">
                        <div className="form-group pb-3 required">
                            <label for="stop-name" className="control-label pb-2">Name</label>
                            <input type="name" className="form-control" id="stop-name" required defaultValue=""
                            placeholder="Enter stop name" onChange={this.handleStopNameChange}></input>
                        </div> 
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.resetAddStopSuccess}>Cancel</button>
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Create</button>
                    </div>
                </form>
              </div>
            </div>
          </div> : ""
        }
        
      </div>
    )
  }
}

export default React.memo(RouteMap)
