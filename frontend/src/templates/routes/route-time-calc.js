import { DistanceMatrixService, LoadScript } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from '../../constants';
import React, { Component } from "react";

class TimeCalculation extends Component {

    destination = [{ lat: 35.80513650819991, lng: -78.86720180228771 }]
    origin = [
        { lat: 35.7966295542791, lng: -78.84261969355543 },
        // { lat: 35.79106384148309, lng: -78.85012996793988 }
    ]

    updateTimes = (response) => {
        console.log(response)
        const index = 0 // index of destination
        const travel_time = response.rows[0].elements[index].duration  // time to travel from origin to desitnation
        console.log(travel_time)
    }

    render() {
        return (
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
                <DistanceMatrixService 
                options={{
                    destinations: this.destination, // destination should be array of lat/lng dicts
                    origins: this.origin, // same as destination
                    travelMode: 'DRIVING'
                }}
                callback={(response) => this.updateTimes(response)}
                />
            </LoadScript>
        )
    }
}

export default TimeCalculation