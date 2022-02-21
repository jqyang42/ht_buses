import { timetoArrive, timeToDepart } from "../components/time";

export async function getStopInfo({ school, stops, arrival_time, departure_time }) {
    // @jessica handle more than 10 stops
    // const api_call_sets = stops.map(stop => {
    //     const slice = stops.sl
    //     return {
    //         origin: 
    //     }
    // })
    // const origin

    return callGoogleDirectionServer({ 
        origin: stops[0], 
        destination: school, 
        waypoints: stops.filter(stop => stops.indexOf(stop) !== 0), 
        arrival_time: arrival_time, 
        departure_time: departure_time
    })
}

async function callGoogleDirectionServer({ origin, destination, waypoints, arrival_time, departure_time }) {
    const directionsService = new window.google.maps.DirectionsService()
    const api_response = await directionsService.route(
        {
            origin: origin,
            destination: destination,
            travelMode: 'DRIVING',
            waypoints: waypoints
        }
    )
    
    const stop_address = api_response.routes[0].legs.map(leg => {
        return leg.start_address
    })

    return {
        stop_addresses: stop_address,
        stop_times: calculateTime({ route_legs: api_response.routes[0].legs, arrival_time: arrival_time, departure_time: departure_time })
    }
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