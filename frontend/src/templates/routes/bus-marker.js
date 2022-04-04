import React, { Component } from 'react'
import { Data, GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { STOP_MARKER_ICONS } from '../../constants';
import { BUS_ICON } from '../../constants';
import Geocode from "react-geocode";

const options = {
  fillColor: "#FFC107",
  strokeColor: "#FFC107",
  strokeOpacity: 1,
  strokeWeight: 1.5,
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  zIndex: 1
}

class BusMarker extends Component {

    state = {
        currentRoute: this.props.routeID,
        icon: BUS_ICON,
        location: this.props.location,
        name: this.props.name,
        updated: false,
        showInfoWindow: true,
        mapLoaded: false
      };

    handleClick = (event) => {
      this.setState(prevState => ({
        showInfoWindow: !prevState.showInfoWindow
      }))
    }

    editName = (event) => {
      event.preventDefault();
      this.setState({
        name: event.target.value
      });
    }

    editLocation = (event) => {
      this.setState({
        location: event.latLng.toJSON() 
      })
      this.handleSubmit(event)
    }
 
    handleSubmit = (event) => {
      if (this.props.handleStopNameChange) {
        if(this.props.uid) {
          // console.log(this.state.name)
          this.props.handleStopNameChange(this.state.name, this.props.id, this.props.uid, this.state.location)
        } 
        else {
          // console.log(this.state.name)
          this.props.handleStopNameChange(this.state.name, this.props.id, this.state.location)
        }
      }
      this.handleClick()
    }

  render () {
    const { showInfoWindow } = this.state;
    return (
      <>
      <Marker 
      position={this.state.location} 
      className={this.state.currentRoute} 
      icon={this.state.icon} 
      id={this.props.id} 
      key={this.props.id} 
      onClick={this.handleClick}
      onDragEnd={this.editLocation}
      draggable={this.props.assign_mode}>
        {console.log(showInfoWindow)}
        {showInfoWindow && (
          <InfoWindow options={{maxWidth:300}}>
            {
              !this.props.assign_mode ? 
              <>
                <h6>{this.state.name}</h6>
              </>
              :
              <>
                <form>
                  <div className='form-group mt-1 me-0 pe-0 px-0 overflow-hidden'>
                      <input type='name' className="d-inline form-control w-auto ms-1 me-0" placeholder='Enter bus stop name' onChange={this.editName} defaultValue={this.state.name}></input>
                      <div className='row mt-3 mb-1 ms-1 w-auto d-flex justify-content-between'>
                        <div className='float-start ms-0 ps-0 w-auto'>
                          {/* <button onClick={showInfoWindow ? this.props.handleDeleteMarker(this.props.id) : () => {}} className='h-100 w-auto btn btn-danger ms-0 me-2'>Delete</button> */}
                          <button onClick={(e) => this.props.handleDeleteStopMarker(e, this.props.id)} className='h-100 w-auto btn btn-danger ms-0 me-2'>Delete</button>
                        </div>
                        <div className='float-end w-auto text-align-end align-items-end pb-0'>
                          <button onClick={this.handleSubmit} className='h-100 w-auto btn btn-primary mb-0 me-0'>
                            Save
                          </button>
                        </div>
                      </div>
                  </div>
                </form>
              </>
            }
            
              
          </InfoWindow>
        )}
      </Marker>
      </>
    )
  }
}
export default React.memo(BusMarker)