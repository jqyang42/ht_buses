import dayjs from 'dayjs'

dayjs.extend(require('dayjs/plugin/customParseFormat'))

export function toDisplayFormat({ twentyfour_time }) {
    const time = dayjs(twentyfour_time, "HH:mm")
    return time.format('hh:mm A')
}

// returns array of departure times in order of 1st stop to school
export function timeToDepart({ arrival_time, travel_times }) {
    let prev_arrival = dayjs(arrival_time, 'HH:mm')
    const departure_times = travel_times.map(time => {
        const departure = prev_arrival.subtract(time, 's')
        prev_arrival = departure
        return departure.format('HH:mm')
    })
    return departure_times.reverse()
}

// returns array of arrival times in order of school to last stop
export function timetoArrive({ departure_time, travel_times }) {
    let prev_departure = dayjs(departure_time, 'HH:mm')
    const arrival_times = travel_times.map(time => {
        const arrival = prev_departure.add(time, 's')
        prev_departure = arrival
        return arrival.format('HH:mm')
    })
    return arrival_times.reverse()
}

export function validTime(departure_time, arrival_time) {
    var first_value = departure_time[0]
    var second_value = departure_time[1]
    const hour_depart = String(first_value) + String(second_value)
    first_value =  arrival_time[0]
    second_value = arrival_time[1]
    const hour_arrive = String(first_value) + String(second_value)
    if(hour_arrive !== undefined && hour_depart !== undefined) {
        if (parseInt(hour_depart) <= parseInt(hour_arrive)) {
            return -1
        }
        return 1 
    }  
    return 0     
}
