const TIME_UNITS = [
    60 * 60 * 24 * 365,
    60 * 60 * 24 * 365 / 12,
    60 * 60 * 24,
    60 * 60 * 24 / 24,
    60 * 60 * 24 / (24 * 60),
]

const TIME_UNITS_NAMES = [
    'Year',
    'Month',
    'Day',
    'Hour',
    'Minute',
    'Second',
]

export default function getTimeString(numOfMilliseconds) {

    let numOfSeconds = numOfMilliseconds / 1000
    numOfSeconds =  Math.floor(numOfSeconds)
    let timeStrings = []

    for (let i = 0; i < TIME_UNITS.length; i++) {
        const unit = TIME_UNITS[i]
        const unitCount = Math.floor(numOfSeconds / unit)

        if (unitCount >= 1) {
            numOfSeconds -= unitCount * unit
            timeStrings.push(`${unitCount.toLocaleString()} ${TIME_UNITS_NAMES[i]}${unitCount > 1 ? 's' : ''}`)
        }
    }

    timeStrings.push(`${numOfSeconds} ${TIME_UNITS_NAMES[TIME_UNITS_NAMES.length - 1]}${numOfSeconds > 1 ? 's' : ''}`)

    return timeStrings.join(' and ')
}