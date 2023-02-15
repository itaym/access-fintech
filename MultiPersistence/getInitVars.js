import { promises as fs } from 'fs'

export const getInitVars = async () => {
    try {
        const data = await fs.readFile(process.selfEnv.INIT_VARS_FILE, 'utf-8')
        return JSON.parse(data)
    } catch {
        return {}
    }
}

export const setInitVars = (initVars) => {
    fs.writeFile(process.selfEnv.INIT_VARS_FILE, JSON.stringify(initVars)).then()
}