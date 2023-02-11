import getTimeString from './getTimeString.js'
import { NUMBERS } from './enums.js'

export default function logMultiPersistence({
    goalNumber,
    startNumber,
}) {
    const totalToRun = goalNumber - startNumber

    return function ({
        currentNumber,
        endTime,
        iterations,
        numberFound,
        powersCache,
        startTime,
        steps,
    }) {
        const numOfMilliseconds = BigInt(endTime - startTime)
        const timeRemaining = (totalToRun / currentNumber) * numOfMilliseconds - numOfMilliseconds
try {
    console.log('----------------------------------------')
    console.log(`Number found in ${steps} -> ${numberFound.toLocaleString()}`)
    console.log(`Current number length: ${currentNumber.toString().length.toLocaleString()}`)
    console.log(`Iterations: ${iterations.toLocaleString()}, ${(NUMBERS.hundred * currentNumber / goalNumber).toLocaleString()}%`)
    console.log(`Iterations/sec: ${(iterations / (numOfMilliseconds / NUMBERS.thousand)).toLocaleString()}`)
    console.log(`Progress/sec length: ${((currentNumber - startNumber) / (numOfMilliseconds / NUMBERS.thousand)).toString().length.toLocaleString()}`)
    console.log(`Powers cache size: ${powersCache.size.toLocaleString()}`)
    console.log(`Up Time: ${getTimeString(numOfMilliseconds)} (${numOfMilliseconds})`)
    console.log(`Time to go: ${getTimeString(timeRemaining)}`)
} catch {}

}}

