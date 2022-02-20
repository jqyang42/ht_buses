import { GOOGLE_API_KEY } from '../../constants';
import { timetoArrive, timeToDepart } from "../components/time";
import { Loader } from "@googlemaps/js-api-loader"

// destination = [{ lat: 35.80513650819991, lng: -78.86720180228771 }]
// origin = [{ lat: 35.7966295542791, lng: -78.84261969355543 }]
// arrival_time = "07:20" --> 7:11am
// depature_time = "14:25" --> 2:33pm

const loader = new Loader({
    apiKey: GOOGLE_API_KEY
})

export async function callGoogle({ first_stop, school, stops, arrival_time, departure_time }) {
    // @jessica handle more than 10 stops
    const google = await loader.load()
    const directionsService = new google.maps.DirectionsService()
    const api_response = await directionsService.route(
        {
            origin: first_stop,
            destination: school,
            travelMode: 'DRIVING',
            waypoints: stops
        }
    )
    return calculateTime({ route_legs: api_response.routes[0].legs, arrival_time: arrival_time, departure_time: departure_time })
}

function calculateTime({ route_legs, arrival_time, departure_time }) {
    const leg_travel_times = route_legs.map(leg => {
        return leg.duration.value
    })

    const pickup_times = timeToDepart({ arrival_time: arrival_time, travel_times: leg_travel_times })
    const dropoff_times = timetoArrive({ departure_time: departure_time, travel_times: leg_travel_times })
    
    let stop_times = []
    pickup_times.forEach((i) => stop_times[pickup_times.indexOf(i)] = {
        pickup: pickup_times[pickup_times.indexOf(i)],
        dropoff: dropoff_times[pickup_times.indexOf(i)]
    })

    return stop_times
}