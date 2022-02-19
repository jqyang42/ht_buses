import { DirectionsService, DistanceMatrixService, LoadScript } from "@react-google-maps/api";
import { GOOGLE_API_KEY } from '../../constants';
import React, { Component } from "react";
import { timetoArrive, timeToDepart } from "../components/time";

class TimeCalculation extends Component {

    // destination = [{ lat: 35.80513650819991, lng: -78.86720180228771 }]
    // origin = [{ lat: 35.7966295542791, lng: -78.84261969355543 }]
    // arrival_time = "07:20" --> 7:11am
    // depature_time = "14:25" --> 2:33pm

    // <TimeCalculation
    //     destination={[{ lat: 35.80513650819991, lng: -78.86720180228771 }]}
    //     origin={[{ lat: 35.7966295542791, lng: -78.84261969355543 }]}
    //     want_arrival={false}
    //     known_time={"07:20"}
    //     handleCalcTime={this.handleCalcTime}
    // />
7
    calculateTime = (route_legs) => {
        const leg_travel_times = route_legs.map(leg => {
            return leg.duration.value
        })
        let calculated_times
        if (this.props.want_departure) {
            calculated_times = timeToDepart({ arrival_time: this.props.arrival_time, travel_times: leg_travel_times })
        } else {
            calculated_times = timetoArrive({ departure_time: this.props.departure_time, travel_times: leg_travel_times })
        }
        this.props.handleRouteTimes(calculated_times)
    }

    render() {
        return (
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
                {/* <DistanceMatrixService 
                options={{
                    destinations: this.props.destination, // destination should be array of lat/lng dicts
                    origins: this.props.origin, // same as destination
                    travelMode: 'DRIVING'
                }}
                callback={(response) => this.calculateTime(response.rows[0].elements[0].duration.value)}
                /> */}
                <DirectionsService
                options={{
                    origin: this.props.origin,
                    destination: this.props.destination,
                    waypoints: this.props.stops,
                    travelMode: 'DRIVING'
                    // arrival_time: 1645359600    // epoch time for 2/20/22 7.20am
                }}
                callback={(response) => this.calculateTime(response.routes[0].legs)}
                />
            </LoadScript>
        )
    }
}

export default TimeCalculation