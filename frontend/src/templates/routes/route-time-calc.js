import { timetoArrive, timeToDepart } from "../components/time";

export async function callGoogle({ first_stop, school, stops, arrival_time, departure_time }) {
    // @jessica handle more than 10 stops
    // const google = await loader.load()
    const directionsService = new window.google.maps.DirectionsService()
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
    console.log(route_legs)
    const leg_travel_times = route_legs.map(leg => {
        return leg.duration.value
    })
    console.log(leg_travel_times)
    console.log(arrival_time)
    console.log(departure_time)
    const pickup_times = timeToDepart({ arrival_time: arrival_time, travel_times: leg_travel_times })
    const dropoff_times = timetoArrive({ departure_time: departure_time, travel_times: leg_travel_times })
    console.log(pickup_times)
    console.log(dropoff_times)
    let stop_times = []
    pickup_times.forEach((i) => stop_times[pickup_times.indexOf(i)] = {
        pickup: pickup_times[pickup_times.indexOf(i)],
        dropoff: dropoff_times[pickup_times.indexOf(i)]
    })

    return stop_times
}