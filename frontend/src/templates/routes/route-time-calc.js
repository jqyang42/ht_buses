import { DistanceMatrixService, LoadScript } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from '../../constants';
import React, { Component } from "react";
import { timetoArrive, timeToDepart } from "../components/time";

class TimeCalculation extends Component {

    // destination = [{ lat: 35.80513650819991, lng: -78.86720180228771 }]
    // origin = [{ lat: 35.7966295542791, lng: -78.84261969355543 }]
    // arrival_time = "07:20"
    // depature_time = "14:25"

    calculateTime = (travel_time) => {
        let calc_time
        if (this.props.want_arrival) {
            calc_time = timetoArrive({ departure_time: this.props.known_time, travel_time: travel_time })
        } else {
            calc_time = timeToDepart({ arrival_time: this.props.known_time, travel_time: travel_time })
        }
        this.props.handleCalcTime(calc_time)
    }

    render() {
        return (
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
                <DistanceMatrixService 
                options={{
                    destinations: this.props.destination, // destination should be array of lat/lng dicts
                    origins: this.props.origin, // same as destination
                    travelMode: 'DRIVING'
                }}
                callback={(response) => this.calculateTime(response.rows[0].elements[0].duration.value)}
                />
            </LoadScript>
        )
    }
}

export default TimeCalculation