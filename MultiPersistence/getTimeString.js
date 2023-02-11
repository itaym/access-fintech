const TIME_UNITS = [
    BigInt(60 * 60 * 24 * 365),
    BigInt(60 * 60 * 24 * 365 / 12),
    BigInt(60 * 60 * 24),
    BigInt(60 * 60 * 24) / 24n,
    BigInt(60 * 60 * 24) / (24n * 60n),
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

    let numOfSeconds = Number(numOfMilliseconds) / 1000
    numOfSeconds = numOfSeconds === Infinity ? BigInt(Number.MAX_SAFE_INTEGER) : BigInt(Math.floor(numOfSeconds))
    let timeStrings = []

    for (let i = 0; i < TIME_UNITS.length; i++) {
        const unit = TIME_UNITS[i]
        const unitCount = numOfSeconds / unit

        if (unitCount >= 1n) {
            numOfSeconds -= unitCount * unit
            timeStrings.push(`${unitCount.toLocaleString()} ${TIME_UNITS_NAMES[i]}${unitCount > 1n ? 's' : ''}`)
        }
    }

    timeStrings.push(`${numOfSeconds} ${TIME_UNITS_NAMES[TIME_UNITS_NAMES.length - 1]}${numOfSeconds > 1n ? 's' : ''}`)

    return timeStrings.join(' and ')
}