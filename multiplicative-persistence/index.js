const ArrayNumber = require("array-number")
const fs = require('fs')

/**
 * CONSTANTS @type {ArrayNumber}
 */
const ZERO = new ArrayNumber(0)
const ONE = new ArrayNumber(1)

/**
 * CONSTANTS @type {number}
 */
const Zero = 0
const One = 1
const Two = 2
const Five = 5
const Six = 6
const Eleven = 11
const Sixty = 60
const Seventy = 70
const Thousand = 1_000

const logToFromFile = false
/**
 * Initial parameters @type {number}
 */
let init_ITERATIONS = Zero
let init_MAX_STEPS = Zero
let init_UP_TIME_MILLISECONDS = Zero
/**
 * Initial parameters $type {ArrayNumber}
 */
let INIT_NUMBER = new ArrayNumber(ZERO)
let LAST_FOUND = ZERO
let N = new ArrayNumber(INIT_NUMBER)

let addToEndTime = 5 * 60_000
let NthDigits
let digitsNo = Zero
let logTime = Zero
let endTime
let maxSteps = init_MAX_STEPS
let iterations = init_ITERATIONS
let startTime = new Date().valueOf() - init_UP_TIME_MILLISECONDS
let steps = Zero
let zerosInARow

/**
 * Override parameters to begin with
 */
if (logToFromFile) {
    try {
        let data = fs.readFileSync('file.log', 'utf8')

        if (data) {
            data = data.split('----------------------------------------\n')
            data = data[data.length - 1]
            data = data.split('\n')
            data.forEach(e => eval(e))
        }
    } catch {
    }
}
function getTimeString(numOfMilliseconds) {
    let date = new Date(numOfMilliseconds)
    // noinspection JSUnresolvedFunction
    let noOfYears = date.getYear() - Seventy
    let noOfMonths = date.getMonth()
    let noOfDays = date.getDate() - One
    let noOfHours = date.getHours() + date.getTimezoneOffset() / Sixty
    let noOfMinutes = date.getMinutes()
    let noOfSeconds = date.getSeconds()
    let str = ''
    str += noOfYears ? `${noOfYears} Years and ` : ''
    str += noOfMonths ? `${noOfMonths} Months, ` : ''
    str += noOfDays ? `${noOfDays} Days and ` : ''
    str += noOfHours ? `${noOfHours} Hours, ` : ''
    return str + `${noOfMinutes} Minutes and ${noOfSeconds} Seconds.`
}

function log(steps, NUMBER_FOUND, CURRENT_NUMBER, iterations, startTime, endTime) {
    const numOfMilliseconds = endTime - startTime
    function noFoundStr() {
        return `in ${steps} -> ${NUMBER_FOUND.toString()}`
    }
    function getEPower(N) {
        let digits = N.digits
        return `${digits[N.length - 1]}.${digits[N.length - 2]}E${N.length - 1}`
    }
    console.warn('----------------------------------------')
    console.warn(`number: ${NUMBER_FOUND ? noFoundStr() : '----------'}`)
    console.warn(`current num.: ${getEPower(CURRENT_NUMBER)}`)
    console.warn(`Iterations: ${iterations.toLocaleString()}`)
    console.warn(`Iterations/sec: ${Math.round(iterations / (numOfMilliseconds / Thousand)).toLocaleString()}`)
    console.warn(`Progress/sec num. length: ${getEPower(CURRENT_NUMBER.divide(new ArrayNumber(numOfMilliseconds / Thousand)))}`)
    console.warn(`Up Time: ${getTimeString(numOfMilliseconds)} (${numOfMilliseconds})`)
    if (logToFromFile) {
        let content =
            `----------------------------------------\n` +
            `LAST_FOUND = new ArrayNumber(${JSON.stringify(NUMBER_FOUND.digits)})\n` +
            `maxSteps = ${steps}\n` +
            `startTime = new Date().valueOf() - ${numOfMilliseconds}\n` +
            `iterations = ${iterations}\n` +
            `N = new ArrayNumber(${JSON.stringify(CURRENT_NUMBER.digits)})\n`
        fs.appendFileSync('file.log', content, {flag: 'a'})
    }
}

function toSortedDigits1st(digitsArray) {
    return digitsArray
}
function toSortedDigits2ndEtc(digitsArray) {
    let digit
    let index = Zero
    let digits = []
    let len = digitsArray.length

    do {
        digit = digitsArray[index]
        if (digit === Zero) return [Zero]
        if (digit === Five) return [Eleven]
        index++
        if (digit === One && digitsArray.length !== One) continue
        digits.push(digit)
    } while (index < len)

    return digits
}

function reduceArrayNumber(a, b, index, arr) {
    return a.multiplyByDigit(b)
}

function createMultiPersistence(digitsArrayFn) {
    return function (N) {
        if (N.length === One) return Zero
        return One + multiPer2ndEtc(digitsArrayFn(N.digits).reduce(reduceArrayNumber, ONE))
    }
}

const multiPer1st = createMultiPersistence(toSortedDigits1st)
const multiPer2ndEtc = createMultiPersistence(toSortedDigits2ndEtc)

do {
    N.plusPlus()

    NthDigits = N.digits
    zerosInARow = Zero
    while (NthDigits[zerosInARow] === Zero) {
        zerosInARow++
    }
    if (zerosInARow > Zero) {
        var digit = N.digits[zerosInARow ] > Six ? N.digits[zerosInARow] : Six
        N.plusEqual(new ArrayNumber(new Array(zerosInARow).fill(digit)))
    }
    if (N.digits[zerosInARow] === Five) {
        N.digits[zerosInARow] = Six
    }
    else if (N.digits[zerosInARow] === One) {
        N.digits[zerosInARow] = Two
    }
    /**
     * Get N multiplicative persistence number of steps
     */
    steps = multiPer1st(N)
    /**
     * ================================================
     */

    iterations++
    // if (iterations % Billion === Zero) {
    //     endTime = new Date().valueOf()
    //     log(maxSteps, LAST_FOUND, N, iterations, startTime, endTime)
    // }
    if (new Date().valueOf() > logTime) {
        endTime = new Date().valueOf()
        logTime = endTime + addToEndTime
        log(maxSteps, LAST_FOUND, N, iterations, startTime, endTime)
    }
    if (digitsNo < N.length) {
        digitsNo = N.length
        endTime = new Date().valueOf()
        logTime = endTime + addToEndTime
        log(maxSteps, LAST_FOUND, N, iterations, startTime, endTime)
    }

    if (steps >= maxSteps) {
        maxSteps = steps
        LAST_FOUND = new ArrayNumber(N)
        endTime = new Date().valueOf()
        logTime = endTime + addToEndTime
        log(maxSteps, LAST_FOUND, N, iterations, startTime, endTime)
        if (maxSteps === 12) {
            break
        }
    }
} while (true)
