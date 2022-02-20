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
    //     origin={{ lat: 35.7966295542791, lng: -78.84261969355543 }}
    //     destination={{ lat: 35.80513650819991, lng: -78.86720180228771 }}
    //     stops={[
    //         {
    //             location: { lat: 35.78721052689135, lng: -78.86991589070445 },
    //         },
    //         {
    //             location: { lat: 35.791252102220305, lng: -78.85021124623715 },
    //         },                
    //     ]}
    //     arrival_time={'07:20'}
    //     departure_time={'14:25'}
    //     handleRouteTimes={this.handleCalcTime}
    // />

    calculateTime = (route_legs) => {
        const leg_travel_times = route_legs.map(leg => {
            return leg.duration.value
        })

        const pickup_times = timeToDepart({ arrival_time: this.props.arrival_time, travel_times: leg_travel_times })
        const dropoff_times = timetoArrive({ departure_time: this.props.departure_time, travel_times: leg_travel_times })
        
        let stop_times = []
        pickup_times.forEach((i) => stop_times[pickup_times.indexOf(i)] = {
            pickup: pickup_times[pickup_times.indexOf(i)],
            dropoff: dropoff_times[pickup_times.indexOf(i)]
        })
        this.props.handleRouteTimes(stop_times)
    }

    render() {
        // TODO @jessica HANDLE MORE THAN 10 WAYPOINTS

        return (
            <LoadScript googleMapsApiKey={GOOGLE_API_KEY}>
                <DirectionsService
                options={{
                    origin: this.props.origin,
                    destination: this.props.destination,
                    waypoints: this.props.stops,
                    travelMode: 'DRIVING'
                }}
                callback={(response) => this.calculateTime(response.routes[0].legs)}
                />
            </LoadScript>
        )
    }
}

export default TimeCalculation