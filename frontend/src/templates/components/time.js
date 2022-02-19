import dayjs from 'dayjs'

dayjs.extend(require('dayjs/plugin/customParseFormat'))

export function toDisplayFormat({ twentyfour_time }) {
    const time = dayjs(twentyfour_time, "HH:mm")
    return time.format('hh:mm A')
}

export function timeToDepart({ arrival_time, travel_time }) {
    const arrival = dayjs(arrival_time, 'HH:mm')
    return arrival.subtract(travel_time, 's').format('hh:mm A')
}

export function timetoArrive({ departure_time, travel_time }) {
    const departure = dayjs(departure_time, "HH:mm")
    return departure.add(travel_time, 's').format('hh:mm A')
}