const createPowerArray = bigIntStr => {
    const values = []

    for (let i = 0; i < bigIntStr.length; i++) {
        const currentNumber = bigIntStr[i]
        const endIndex = bigIntStr.lastIndexOf(currentNumber)
        values.push(BigInt(currentNumber) ** BigInt(endIndex - i + 1))
        if (currentNumber === '0')
            break
        i = endIndex
    }
    return values
}
const toPowerArray1st = (currentNo) => {
    const currentNoStr = currentNo.toString()
    return createPowerArray(currentNoStr)
}
const toPowerArray2nd = (currentNo) => {
    const currentNoStr = currentNo.toString().split('').sort().join('')
    return createPowerArray(currentNoStr)
}
const reduce = (a, b) => {
    return a * b
}
const multiplicativePersistence = function (toPowerArray) {
    return function (currentNo) {
        if (currentNo < 10n) return 0

        const digits = toPowerArray(currentNo)
        return 1 + multiPerRecursive(digits.reduce(reduce))
    }
}

const multiPer = multiplicativePersistence(toPowerArray1st)
const multiPerRecursive = multiplicativePersistence(toPowerArray2nd)

export default multiPer