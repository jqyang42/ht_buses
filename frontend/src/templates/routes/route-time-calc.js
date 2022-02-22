import { timetoArrive, timeToDepart } from "../components/time";

export async function getStopInfo({ school, stops, arrival_time, departure_time }) {
    let all_locations = stops
    all_locations.push(school)

    let api_call_sets = []
    for (let i = 0; i < all_locations.length; i += (2 + 10 - 1)) {
        api_call_sets.push(all_locations.slice(i, i + (2 + 10)))
    }

    const google_results = await Promise.all(api_call_sets.filter(set => set.length !== 1).map(async set => {
        return await callGoogleDirectionServer({ 
            origin: set[0], 
            destination: set[set.length - 1], 
            waypoints: set.filter(stop => (set.indexOf(stop) !== 0) && (set.indexOf(stop) !== (set.length - 1))), 
            arrival_time: arrival_time, 
            departure_time: departure_time
        })
    }))
    
    let merged_google_results = {
        stop_addresses: [],
        stop_times: []
    }
    google_results.map(set => {
        merged_google_results.stop_addresses = merged_google_results.stop_addresses.concat(set.stop_addresses)
        merged_google_results.stop_times = merged_google_results.stop_times.concat(set.stop_times)
    })

    return {
        stop_addresses: merged_google_results.stop_addresses,
        stop_times: calculateTime({ leg_durations: merged_google_results.stop_times, arrival_time: arrival_time, departure_time: departure_time })
    }
}

async function callGoogleDirectionServer({ origin, destination, waypoints }) {
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

    const stop_duration = api_response.routes[0].legs.map(leg => {
        return leg.duration.value
    })

    return {
        stop_addresses: stop_address,
        stop_times: stop_duration
    }
}

function calculateTime({ leg_durations, arrival_time, departure_time }) {
    const pickup_times = timeToDepart({ arrival_time: arrival_time, travel_times: leg_durations })
    const dropoff_times = timetoArrive({ departure_time: departure_time, travel_times: leg_durations })
    let stop_times = []
    pickup_times.forEach((i) => stop_times[pickup_times.indexOf(i)] = {
        pickup: pickup_times[pickup_times.indexOf(i)],
        dropoff: dropoff_times[pickup_times.indexOf(i)]
    })

    return stop_times
}