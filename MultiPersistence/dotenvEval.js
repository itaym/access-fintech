const dotenvEval = ({ parsed }) => {
    if (!process.selfEnv) process.selfEnv = {
        INIT_GOAL_NUMBER: undefined,
        INIT_ITERATIONS: undefined,
        INIT_LOG_ITERATIONS: undefined,
        INIT_MAX_STEPS: undefined,
        INIT_NUMBER: undefined,
        INIT_UP_TIME_MILLISECONDS: undefined,
        INIT_VARS_FILE: undefined,
    }

    for (let [key, value] of Object.entries(parsed)) {
        try {
            process.selfEnv[key] = eval(value)
        }
        catch {
            process.selfEnv[key] = value
        }
    }
}
export default dotenvEval