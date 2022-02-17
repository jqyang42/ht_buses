export function twelveHourTime({ twentyfour_time }) {
    const hours_minutes = twentyfour_time.split(":")
    const int_hours = parseInt(hours_minutes[0])
    const is_pm = int_hours > 12
    const new_hours = is_pm ? timeLeadingZeroes({ time: (int_hours - 12) }) : timeLeadingZeroes({ time: int_hours})
    return (<>{new_hours}:{hours_minutes[1]} {is_pm ? `PM` : `AM`}</>) 
}

function timeLeadingZeroes({ time }) {
    if (time < 10) {
        return `0${time.toString()}`
    }
}