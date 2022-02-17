import React, { Component } from 'react'
import { Data, GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { Link , Navigate} from "react-router-dom";
import { STOP_MARKER_ICONS } from '../../constants';
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

class StopMarker extends Component {

    state = {
        currentRoute: this.props.routeID,
        icon: STOP_MARKER_ICONS[this.props.routeID % STOP_MARKER_ICONS.length],
        location: this.props.location,
        name: this.props.name,
        updated: false,
        showInfoWindow: false
      };

    handleMouseOver = (event) => {
        this.setState({
            showInfoWindow: true
        });
    };
    handleMouseExit = (event) => {
        this.setState({
            showInfoWindow: false
        });
    };

    editName = (event) => {
      console.log(event.target.value)
      this.setState({
        name: event.target.value
      });
    }

    handleSubmit = (event) => {
      this.setState({
        // TODO: ask thomas how to pass info to routeMap
      })
    }

  render () {
    let stringData
    if (this.state.name){
      stringData = this.state.name;
    }
    const { showInfoWindow } = this.state;
    console.log(this.state.name)
    return (
      <>
      <Marker 
      position={this.state.location} 
      className={this.state.currentRoute} 
      icon={this.state.icon} 
      id={this.props.id} 
      key={this.props.id} 
      onMouseOver={this.handleMouseOver}
      onMouseOut={this.handleMouseExit}
      onClick={this.handleMouseOver}>
        {showInfoWindow && (
          <InfoWindow options={{maxWidth:300}}>
            <>
              <form>
                <div className='form-group mt-1'>
                  <span>
                    <input type='name' className="d-inline form-control w-auto ms-1 me-2" placeholder='Enter bus stop name' onChange={this.editName} defaultValue={this.state.name}></input>
                    <button onSubmit={this.handleSubmit} className='d-inline btn btn-primary mb-1'><i className='bi bi-check'></i></button>
                  </span>
                </div>
              </form>
            </>
              
          </InfoWindow>
        )}
      </Marker>
      
      <Circle
      center={this.state.location}
      radius={482.8032}
      options={options}/></>
    )
  }
}
export default React.memo(StopMarker)