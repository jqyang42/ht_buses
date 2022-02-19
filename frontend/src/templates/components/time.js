import dayjs from 'dayjs'
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export function toDisplayFormat({ twentyfour_time }) {
    const time = dayjs(twentyfour_time, "HH:mm")
    return time.format('hh:mm A')
}