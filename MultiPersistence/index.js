import logMultiPersistence from './logMultiPersistence.js'
import multiPer from './multiplicativePersistence.js'
import onNotModulo10 from './onNotModulo10.js'
import { getInitVars } from './getInitVars.js'

const INIT_GOAL_NUMBER = process.selfEnv.INIT_GOAL_NUMBER
const INIT_ITERATIONS = process.selfEnv.INIT_ITERATIONS
const INIT_LOG_ITERATIONS = process.selfEnv.INIT_LOG_ITERATIONS
const INIT_MAX_STEPS  = process.selfEnv.INIT_MAX_STEPS
const INIT_NUMBER = process.selfEnv.INIT_NUMBER
const INIT_UP_TIME_MILLISECONDS = process.selfEnv.INIT_UP_TIME_MILLISECONDS

const multiplicativePersistenceSearch = (INIT_VARS) => {

    const {
        GOAL_NUMBER,
        ITERATIONS,
        LOG_ITERATIONS,
        MAX_STEPS,
        START_NUMBER,
        UP_TIME_MILLISECONDS,
    } = INIT_VARS

    let currentNo = START_NUMBER || INIT_NUMBER
    let goalNumber = GOAL_NUMBER || INIT_GOAL_NUMBER
    let logIterations = LOG_ITERATIONS || INIT_LOG_ITERATIONS
    let maxSteps = MAX_STEPS || INIT_MAX_STEPS
    let realIterations = ITERATIONS || INIT_ITERATIONS
    let startTime = UP_TIME_MILLISECONDS || INIT_UP_TIME_MILLISECONDS

    let breakCondition = true
    let endTime
    let iterationsPerLog = 0
    let lastNumberFound = 0n
    let startTimeLog
    let steps = 0
    let valueToAdd = [1n]

    const log = logMultiPersistence({goalNumber, currentNo})

    startTime = Date.now() - startTime
    startTimeLog = startTime

    /**
     * Start (or continue) the Multiplicative Persistence search
     */
    while (breakCondition) {

        ({ currentNo, valueToAdd} = onNotModulo10(currentNo, valueToAdd))

        for (let value of valueToAdd) {
            steps = multiPer(currentNo)

            realIterations++

            if ((realIterations % logIterations === 0) || (steps > maxSteps)) {
                endTime = Date.now()

                if (steps > maxSteps) {
                    maxSteps = steps
                    lastNumberFound = currentNo
                }
                iterationsPerLog = realIterations - iterationsPerLog

                if (endTime - startTimeLog > 10_000) logIterations /= 10

                log({
                    currentNumber: currentNo,
                    endTime,
                    iterations: realIterations,
                    iterationsPerLog,
                    numberFound: lastNumberFound,
                    startTime,
                    startTimeLog,
                    steps: maxSteps,
                })
                if (currentNo >= goalNumber) breakCondition = false
                startTimeLog = new Date().valueOf()
                iterationsPerLog = realIterations
            }
            currentNo += value
        }
    }
    endTime = new Date().valueOf()

    log({
        currentNumber: goalNumber,
        endTime,
        iterations: realIterations,
        iterationsPerLog,
        numberFound: lastNumberFound,
        startTime,
        startTimeLog,
        steps: maxSteps,
    })
    const vars = {
        GOAL_NUMBER,
        ITERATIONS,
        LOG_ITERATIONS,
        MAX_STEPS,
        START_NUMBER,
        UP_TIME_MILLISECONDS,
    }

    console.log('---------- FINISH ----------')
}
const INIT_VARS = getInitVars()
multiplicativePersistenceSearch(INIT_VARS)