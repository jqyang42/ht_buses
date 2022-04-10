import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { GOOGLE_API_KEY } from '../../constants';
import { MARKER_COLORS } from '../../constants';
import { MARKER_ICONS } from '../../constants';

import Geocode from "react-geocode";
import StudentMarker from './student-marker';
import StopMarker from './stop-marker';
import BusMarker from './bus-marker'
import { PARENT_DASHBOARD_URL , LOGIN_URL, STUDENT_INFO_URL } from "../../constants";

const containerStyle = {
  width: '100%',
  height: '400px'
};
const hidePOIs = [
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]


class RouteMap extends Component {
  state = {
    newStops: [],
    editedStops: [],
    existingStops: this.props.existingStops,
    showModal: false,
    center: {
      lat: parseFloat(this.props.center.lat),
      lng: parseFloat(this.props.center.lng)
    },
    buses: this.props.buses,
    // bus_info_window: false,
    bus_tooltip: this.props.bus_tooltip
  }

  studentsChanged = []

  handleCenterChange = (event) => {
    //TODO: update state with new center
  }

  toggleBusInfoWindow = (bus_number) => {
    // console.log(this.state.bus_tooltip)
    // this.setState(prevState => ({
    //   bus_tooltip: {
    //     ...prevState.bus_tooltip,
    //     [bus_number]: !prevState.bus_tooltip[bus_number]
    //   }
    // }))

    const new_tooltip = this.state.bus_tooltip
    new_tooltip[bus_number] = !new_tooltip[bus_number]
    this.setState({
      bus_tooltip: new_tooltip
    })
  }

  componentDidUpdate(prevProps) {
    if(this.props.existingStops !== prevProps.existingStops){
      this.setState({
        existingStops: this.props.existingStops
      });
    }
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

  // Handles onClick
  createStopMarker = (event) => {
    const coords = event.latLng.toJSON() 
    if (this.props.assign_mode ) {
      const newStop = {
        name: "",
        lat: coords.lat,
        lng: coords.lng,
        route_id: this.props.active_route,
        arrival: "00:00",
        departure: "00:00"
      }
      // this.newStops.push(newStop)
      this.setState(prevState => ({
        newStops: [...prevState.newStops, newStop],
        center: {
          lat: coords.lat,
          lng: coords.lng
        }
      }))
    }
    this.handleUpdateNewStops()
    this.setState({ showModal: true })
    // document.getElementById("staticBackdrop").modal({ show: true, backdrop: false, keyboard: false });
  }

  handleUpdateNewStops = () => {
    if (this.props.handleUpdateNewStops) {
      // console.log(this.state.newStops)
      this.props.handleUpdateNewStops(this.state.newStops)
    }
  }

  handleStopNameChange = (arrayToChange, name, index, location) => {
    const newStopNames = arrayToChange;
    const newStop = newStopNames[index];
    newStop.name = name;
    newStop.lat = location.lat;
    newStop.lng = location.lng;
    newStopNames[index] = newStop;
    // console.log(newStopNames)
    return newStopNames
  }

  handleNewStopNameChange = (name, index, location) => {
    const newStopNames = this.handleStopNameChange(this.state.newStops, name, index, location)
    this.setState({
      newStops: newStopNames
    }) 
    this.handleUpdateNewStops()
  }
  
  handleStopModify = () => {
    if (this.props.handleStopModification) {
      // console.log(this.state.editedStops)
      this.props.handleStopModification(this.state.editedStops)
    }
  }

  handleExistingStopNameChange = (name, index, uid, location) => {
    const updatedStopNames = this.handleStopNameChange(this.state.existingStops, name, index, location)
    const editedStop = {
      "id": uid,
      "name": name,
      "location": {
        "lat": location.lat,
        "lng": location.lng,
      }
    }
    // console.log(editedStop)
    const editedStopNames = this.state.editedStops;
    editedStopNames.push(editedStop)
    this.setState({
      editedStops: editedStopNames,
      existingStops: updatedStopNames
    })
    // console.log(this.state.editedStops)
    // console.log(this.state.existingStops)
    this.handleStopModify()
  }

  handleDeleteNewStops = (event, index) => {
    event.preventDefault()
    const new_stops = [...this.state.newStops]
    new_stops.splice(index, 1)
    this.setState({ newStops: new_stops }, () => this.handleUpdateNewStops())
  }

  deleted_ids = []
  handleDeleteOrigStops = (event, index) => {
    event.preventDefault()
    const existing_stops = [...this.state.existingStops]
    existing_stops.splice(index, 1)
    this.setState({ existingStops: existing_stops })

    const stop_id = this.state.existingStops[index].id
    this.deleted_ids.push(stop_id)
    this.props.handleDeleteOrigStops(this.deleted_ids)
  }

  render() {
    const center = this.props.center
    if (!JSON.parse(localStorage.getItem('logged_in'))) {
      return <Navigate to={LOGIN_URL} />
    }
    return (
      <div className='w-100 h-100'>
        <LoadScript
          googleMapsApiKey={GOOGLE_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            options={{
              styles: hidePOIs
            }}
            zoom={13}
            onClick={this.createStopMarker}
          >
            {this.props.centerIcon ? 
              <Marker 
                position={this.props.center} 
                icon={this.props.centerIcon}
              /> :
              <Marker 
                position={this.props.center} 
              />
            }
            {console.log(this.props.buses)}
            {this.props.buses?.map((value, index) => {
              console.log(value)
              return <BusMarker 
                key={`${value.location.lat}+${value.location.lng}`}
                id={index}
                // uid={1}
                bus_number={value.bus_number}
                driver={value.user}
                location={value.location}
                // assign_mode={false} 
                // routeID={5}
                // handleDeleteStopMarker={() => {}}
                // handleStopNameChange={() => {}}
                // showInfoWindow={this.state.bus_info_window}
                busToolTip={this.state.bus_tooltip}
                toggleInfoWindow={this.toggleBusInfoWindow}
                // key={index} 
                // position={value.location}
                // location={value.location} 
                // assign_mode={this.props.assign_mode} 
                // routeID={value.routeID} 
                // active_route={this.props.active_route}
                // id={value.id}
                // studentIDs={value.studentIDs}
                // studentNames={value.studentNames}
                // onChange={this.handleRouteChanges} 
                // data-bs-toggle="modal"
                // data-bs-target="#staticBackdrop"
                />
            })}
            {this.props.students?.map((value, index) => {
              return <StudentMarker 
                key={index} 
                location={value.location} 
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
            {this.state.existingStops?.map((value, index) => {
              return <StopMarker 
              key={`${value.location.lat}+${value.location.lng}`}
              id={index}
              uid={value.id}
              name={value.name}
              location={{
                lat: value.location.lat,
                lng: value.location.lng
              }}
              assign_mode={this.props.assign_mode} 
              routeID={this.props.active_route}
              handleDeleteStopMarker={this.handleDeleteOrigStops}
              handleStopNameChange={this.handleExistingStopNameChange}/>
            })}
            {this.state.newStops?.map((value, index) => {
              return <StopMarker 
              key={`${value.lat}+${value.lng}`}
              id={index}
              name={""}
              location={{
                lat: value.lat,
                lng: value.lng
              }
            }
              assign_mode={this.props.assign_mode} 
              routeID={value.route_id}
              handleDeleteStopMarker={this.handleDeleteNewStops}
              handleStopNameChange={this.handleNewStopNameChange}/>
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
                            placeholder="Enter stop name" onChange={this.handleNewStopNameChange}></input>
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
