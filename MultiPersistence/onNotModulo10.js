import * as dotenv from 'dotenv'
import dotenvEval from './dotenvEval.js'
dotenvEval(dotenv.config())

const length = process.selfEnv['INIT_GOAL_NUMBER'].toString().length
const longDigitsArr = []
for (let x = 1; x < 10; x++) {
    longDigitsArr[x] = String(x).repeat(length)
}

const valuesToAdd = []

for (let x = 0; x < length; x++) {
    valuesToAdd.push(10n ** BigInt(x))
}

const onNotModulo10 = (currentNo) => {

    let valueToAdd = [1n]

    if (currentNo % 10n === 0n) {

        let str = String(currentNo)
        const index = str.indexOf('0')
        const powerLen = str.length - index

        if (str.charAt(0) === '1') {
            str = '2' + str.substring(1)
            currentNo = BigInt(str)
        }

        let digit = str.charAt(index - 1) * 1

        if (digit === 5) {
            const powerOfTen = 10n ** BigInt(powerLen)
            currentNo += 2n * powerOfTen
        }
        if (digit < 7) {
            digit = 7
        }

        currentNo += BigInt(longDigitsArr[digit].substr(0, powerLen))

        if (digit === 8) {
            currentNo++
        }
        else if (digit === 9) {

            const index = str.indexOf('9')
            if (index > 0) {
                const powerLen2 = str.length - index
                let digitIndex = index - 1
                let digit = str.charAt(digitIndex) * 1
                if (digit < 7) digit = 7
                valueToAdd = [BigInt(longDigitsArr[digit + 1].substr(0, powerLen2)) + 1n]

                let index8 = str.indexOf('8')
                if (index8 > 1) {
                    valueToAdd.push(...valuesToAdd.slice(str.length - index + 1, str.length - index8))
                }
            }
        }
    }
    return {
        currentNo,
        valueToAdd,

    }
}

export default onNotModulo10