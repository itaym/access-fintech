import getTimeString from './getTimeString.js'
import { NUMBERS } from './enums.js'

export default function logMultiPersistence({
    goalNumber,
    currentNo,
}) {
    const totalToRun = goalNumber - currentNo

    return function ({
        currentNumber,
        endTime,
        iterations,
        iterationsPerLog,
        numberFound,
        startTimeLog,
        startTime,
        steps,
    }) {
        const numOfMilliseconds = endTime - startTime
        const numOfMillisecondsLog = endTime - startTimeLog
        //const timeRemaining = (totalToRun / currentNumber) * numOfMilliseconds - numOfMilliseconds
try {
    console.log('----------------------------------------')
    console.log(`Number found in ${steps} -> ${numberFound.toLocaleString()}`)
    console.log(`Current number length: ${currentNumber.toString().length.toLocaleString()}`)
    console.log(`Iterations: ${iterations.toLocaleString()}`)
    console.log(`Avg Iterations/sec: ${Math.floor(iterations / (numOfMilliseconds / 1000)).toLocaleString()}`)
    console.log(`Log Iterations/sec: ${Math.floor(iterationsPerLog / (numOfMillisecondsLog / 1000)).toLocaleString()}`)
    //console.log(`Progress/sec length: ${((currentNumber - startNumber) / (numOfMilliseconds / 1000)).toString().length.toLocaleString()}`)
    console.log(`Up Time: ${getTimeString(numOfMilliseconds)} (${numOfMilliseconds})`)
    //console.log(`Time to go: ${getTimeString(timeRemaining)}`)
} catch {}

}}

