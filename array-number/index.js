const MINUS_SIGN = '-'
const PLUS_SIGN = '+'

/**
 * Mathematical operations for ArrayNumber
 * ---------------------------------------
 */

/**
 * Helping arrays for multiplication
 * ---------------------------------------
 */

/**
 *
 * @type {number[][]}
 */
const multiplicationPanel = []
/**
 *
 * @type {number[]}
 */
const sumCarries = new Array(100)
/**
 *
 * @type {number[]}
 */
const sumDigits = new Array(100)

for (let x = 0; x < 10; x++) {
    let int8Array = new Array(12)
    for (let y = 0; y < 12; y++) {
        int8Array[y] = x * y
    }
    multiplicationPanel[x] = int8Array
}

for (let x = 0;  x < 100; x++) {
    let digit = x % 10
    sumCarries[x] = (x - digit) / 10
    sumDigits[x] = digit
}
/**
 * Addition operation over two positives ArrayNumber
 * @param {ArrayNumber} a
 * @param {ArrayNumber} b
 * @returns {ArrayNumber}
 */
function __add(a, b) {
    const minLen = Math.min(a.length, b.length)
    const maxLen = Math.max(a.length, b.length)
    const aDigits = a.digits
    const bDigits = b.digits
    const rDigits = new Array(maxLen)

    const longer = aDigits.length === maxLen ? aDigits : bDigits
    const shorter = longer === aDigits ? bDigits : aDigits
    const result = new ArrayNumber()

    let sum = 0, index = 0, digit

    for (; index < minLen; index++) {
        sum += longer[index] + shorter[index]
        digit = sum % 10
        sum = (sum - digit) / 10
        rDigits[index] = digit
    }
    for (; index < maxLen; index++) {
        if (!sum) break
        sum += longer[index]
        digit = sum % 10
        sum = (sum - digit) / 10
        rDigits[index] = digit
    }
    rDigits.splice(index, rDigits.length - index, ...longer.slice(index))
    if (sum) {
        rDigits.push(sum)
    }
    result.digits = rDigits
    return result
}

/**
 *
 * @param {ArrayNumber[]} batch
 * @returns {ArrayNumber}
 */
function __addBatch(batch) {
    let maxLen = batch[0].length
    batch.sort(function(a, b) {
        if (maxLen < a.length) maxLen = a.length
        if (maxLen < b.length) maxLen = b.length
        return a.length - b.length
    })
    const rDigits = new Array(maxLen)
    const result = new ArrayNumber()

    let sum = 0, index = 0, digit

    for (; index < maxLen; index++) {
        while (index === batch[0].length) {
            batch.shift()
        }
        for (let batchIndex = 0; batchIndex < batch.length; batchIndex++) {
            sum += batch[batchIndex]._digits[index]
        }
        digit = sum % 10
        sum = (sum - digit) / 10
        rDigits[index] = digit
    }
    while (sum) {
        digit = sum % 10
        sum = (sum - digit) / 10
        rDigits.push(digit)
    }
    result.digits = rDigits
    return result
}

/**
 * Division operation over two positives ArrayNumber
 * @param {ArrayNumber} a
 * @param {ArrayNumber} b
 * @returns {ArrayNumber}
 */
function __divide(a, b) {
    if (b.length === 1 && b.digits[0] === 0) {
        return new ArrayNumber(b)
    }
    let numOfZeros = a.length - b.length
    if (numOfZeros < 0) return new ArrayNumber(0)

    if (b.multiplyByPow10(numOfZeros).isGreaterThen(a)) {
        numOfZeros--
    }
    if (numOfZeros < 0) return new ArrayNumber(0)

    const returnValue = ArrayNumber.nthPow10(numOfZeros)
    const bByPowerOfTen = b.multiplyByPow10(numOfZeros)
    const aMinusB = a.minus(bByPowerOfTen)
    return returnValue.plus(__divide(aMinusB, b))
}

/**
 * Returns the larger ArrayNumber
 * @param {...ArrayNumber} args
 * @returns {ArrayNumber}
 */
function __getBigger(...args) {
    const hashTable = {}
    const minusGroup = []
    const plusGroup = []

    for (let index = 0; index < args.length; index++) {
        args[index].sign === MINUS_SIGN ? minusGroup.push(args[index]) : plusGroup.push(args[index])
    }
    if (plusGroup.length === 0) {
        minusGroup.forEach(e => e.sign = PLUS_SIGN)
        let result = __getSmaller(...minusGroup)
        minusGroup.forEach(e => e.sign = MINUS_SIGN)
        return result
    }
    for (let index = 0; index < plusGroup.length; index++) {
        let length = plusGroup[index].length
        if (!hashTable[length]) {
            hashTable[length] = []
        }
        hashTable[length].push(plusGroup[index])
    }
    let longest = hashTable[Object.keys(hashTable).sort((a, b) => b - a)[0]]

    for (let index = longest[0].length - 1; index > -1; index --) {
        let highest = longest.reduce((a, b) => a > b.digits[index] ? a : b.digits[index], 0)
        longest = longest.filter(e => e.digits[index] === highest)
        if (longest.length === 1) break
    }
    return longest[0]
}

/**
 * Returns the smaller ArrayNumber
 * @param {...ArrayNumber} args
 * @returns {ArrayNumber}
 */
function __getSmaller(...args) {
    const hashTable = {}
    const minusGroup = []
    const plusGroup = []

    for (let index = 0; index < args.length; index++) {
        args[index].sign === MINUS_SIGN ? minusGroup.push(args[index]) : plusGroup.push(args[index])
    }
    if (plusGroup.length === 0) {
        minusGroup.forEach(e => e.sign = PLUS_SIGN)
        let result = __getBigger(...minusGroup)
        minusGroup.forEach(e => e.sign = MINUS_SIGN)
        return result
    }
    for (let index = 0; index < plusGroup.length; index++) {
        let length = plusGroup[index].length
        if (!hashTable[length]) {
            hashTable[length] = []
        }
        hashTable[length].push(plusGroup[index])
    }
    let shortest = hashTable[Object.keys(hashTable).sort((a, b) => a - b)[0]]

    for (let index = shortest[0].length - 1; index > -1; index --) {
        let lowest = shortest.reduce((a, b) => a < b.digits[index] ? a : b.digits[index], 9)
        shortest = shortest.filter(e => e.digits[index] === lowest)
        if (shortest.length === 1) break
    }
    return shortest[0]
}

/**
 * Multiply operation over two positives ArrayNumbers
 * @param {ArrayNumber} a
 * @param {ArrayNumber} b
 * @returns {ArrayNumber}
 */
function __multiply(a, b) {
    const bDigits = b.digits
    const batch = []

    for (let index = 0; index < b.length; index++) {
        batch.push(__multiplyByDigit(a, bDigits[index]).multiplyByPow10(index))
    }
    return __addBatch(batch)
}

/**
 * Multiply positive ArrayNumber by a digit
 * @param {ArrayNumber} a
 * @param {number} n - Positive 0-9
 * @returns {ArrayNumber}
 */
function __multiplyByDigit(a, n) {
    const result = new ArrayNumber()
    // noinspection JSAccessibilityCheck
    const aDigits = a._digits
    // noinspection JSAccessibilityCheck
    const rDigits = new Array(a._digits.length)

    let sum = 0, index = 0, digit

    for (; index < a.length; index++) {
        sum += multiplicationPanel[aDigits[index]][n]

        digit = sumDigits[sum] // sum % 10
        sum = sumCarries[sum]  // (sum - digit) / 10
        rDigits[index] = digit
    }
    if (sum !== 0) {
        rDigits.push(sum)
    }
    // noinspection JSAccessibilityCheck
    result._digits = rDigits
    return result
}

/**
 *
 * @param {ArrayNumber} base
 * @param {number} expo
 * @returns {ArrayNumber}
 */
var cache = {}
function __power (base, expo) {
    let key = base //.digits.join('')
    if (!cache[key]) {
        cache[key] = {}
    }
    if (cache[key][expo])
        return (cache[key][expo])
    if (expo === 0) return new ArrayNumber(1)
    if (expo === 1) return new ArrayNumber(base)

    if (!(expo % 2)) {
        let preResult = __power(base, expo / 2)
        cache[key][expo] = preResult.multiply(preResult)
        return cache[key][expo]
    }
    let preResult = __power(base, (expo -1) / 2)
    cache[key][expo] = preResult.multiply(preResult).multiply(new ArrayNumber(base))
    return cache[key][expo]
}

/**
 * Subtraction operation over two positives ArrayNumbers
 * @param {ArrayNumber} a
 * @param {ArrayNumber} b
 * @returns {ArrayNumber}
 */
function __sub(a, b) {
    const bigger = __getBigger(...[a, b])
    const smaller = __getSmaller(...[a, b])
    const sign = bigger === a ? PLUS_SIGN : MINUS_SIGN
    if (bigger === undefined) debugger
    // noinspection JSAccessibilityCheck
    const aDigits = bigger._digits
    // noinspection JSAccessibilityCheck
    const bDigits = smaller._digits
    const maxLen = Math.max(aDigits.length, bDigits.length)

    const result = new ArrayNumber()
    const cDigits = new Array(maxLen-1)
    let sum = 0, index = 0

    for (; index < smaller.length; index++) {
        sum += aDigits[index] - bDigits[index]
        if (sum < 0) {
            sum += 10
            cDigits[index] = sum
            sum = -1
            continue
        }
        cDigits[index] = sum
        sum = 0
    }
    for (; index < bigger.length; index++) {
        sum += aDigits[index]
        if (sum < 0) {
            sum += 10
            cDigits[index] = sum
            sum = -1
            continue
        }
        cDigits[index] = sum
        index++
        break
    }
    for (; index < bigger.length; index++) {
        cDigits[index] = aDigits[index]
    }
    while (cDigits.length > 1 && cDigits[cDigits.length - 1] === 0) {
        cDigits.pop()
    }
    result.digits = cDigits

    return result
}

/**
 * =======================================
 * ---------------------------------------
 */

/**
 * Initial functions for ArrayNumber
 * ---------------------------------------
 */

/**
 *
 * @param {ArrayNumber} self
 * @param {number[]} initValue
 */
function initFromArray(self, initValue) {
    // noinspection JSAccessibilityCheck
    self._digits = initValue
}

/**
 *
 * @param {ArrayNumber} self
 * @param {ArrayNumber} initValue
 */
function initFromArrayNumber(self, initValue) {
    // noinspection JSAccessibilityCheck
    self._digits = [...initValue._digits]
}

/**
 *
 * @param {ArrayNumber} self
 * @param {number} number
 */
function initFromNumber(self, number) {
    initFromArray(self, (Math.floor(number) + '').split('').map(n => parseInt(n)).reverse())
}

/**
 *
 * @param {ArrayNumber} self
 * @param {string} string
 */
function initFromString(self, string) {
    initFromArray(self, string.split('').reverse().map(e => parseInt(e)))
}

/**
 * =======================================
 * ---------------------------------------
 */

/**
 * Creates a new ArrayNumber
 * @class
 * @constructor
 * @public
 */
class ArrayNumber {
    /**
     *
     * @param  {number|string|number[]|String|Number|ArrayNumber} [initValue]
     * @returns {ArrayNumber}
     */
    constructor (initValue) {

        /**
         * Holds the digits array of the ArrayNumber
         * @type {number[]}
         * @private
         */
        this._digits = [0]

        if (initValue === undefined) return this
        else if (typeof initValue === 'number') initFromNumber(this, initValue)
        else if (typeof initValue === 'string') initFromString(this, initValue)
        else if (initValue instanceof Number) initFromNumber(this, initValue)
        else if (initValue instanceof String) initFromString(this, initValue)
        else if (initValue instanceof Array) initFromArray(this, initValue)
        else if (initValue instanceof ArrayNumber) initFromArrayNumber(this, initValue)

        if (!this._digits || this._digits.length === 0) {
            initFromNumber(this, 0)
        }
    }

    /**
     * Returns the length of the number without the sign
     * @type {number}
     */
    get length () {
        return this._digits.length
    }

    /**
     * Returns the digits array of the ArrayNumber
     * @type {number[]}
     */
    get digits () {
        return this._digits
    }

    /**
     * Sets the digits array of the ArrayNumber
     * @param {number[]} digits
     */
    set digits (digits) {
        this._digits = digits
    }

    /**
     * Returns a new ArrayNumber which is the result of a division
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    divide (a) {
        return ArrayNumber.divide(this, a)
    }

    /**
     * Returns a new ArrayNumber which is the result of a division
     * operation over this instance and 10 to the power of n.
     * @param {number} n
     * @returns {ArrayNumber}
     */
    divideByPow10 (n) {
        return new ArrayNumber([...this.digits].splice(0, n))
    }

    /**
     * Returns this ArrayNumber instance after the result of a division
     * operation over this instance and 10 to the power of n.
     * @param {number} n
     * @returns {ArrayNumber}
     */
    divideByPow10Equal (n) {
        this._digits = this._digits.slice(n, this._digits.length)
        return this
    }

    /**
     * Returns this ArrayNumber instance after the result of a division
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    divideEqual (a) {
        const result = ArrayNumber.divide(this, a)
        this._digits = result._digits
        return this
    }

    /**
     * Returns boolean if this instance equals the provided one.
     * @param a
     * @returns {boolean}
     */
    isEqual (a) {
        return ArrayNumber.isEqual(this, a)
    }

    /**
     * Returns boolean if this instance is greater from the provided one.
     * @param a
     * @returns {boolean}
     */
    isGreaterThen (a) {
        return ArrayNumber.isGreaterThen(this, a)
    }

    /**
     * Returns boolean if this instance is lesser from the provided one.
     * @param a
     * @returns {boolean}
     */
    isLesserThen (a) {
        return ArrayNumber.isLesserThen(this, a)
    }

    /**
     * Returns boolean if this instance is lesser from Number.MAX_SAFE_INT.
     * @returns {boolean}
     */
    isSafe () {
        return this._digits.length <= ArrayNumber.MAX_SAFE_INTEGER._digits.length
    }

    /**
     * Returns a new ArrayNumber which is the result of a subtraction
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    minus (a) {
        return ArrayNumber.sub(this, a)
    }

    /**
     * Returns this ArrayNumber instance after the result of a subtraction
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    minusEqual (a) {
        const { digits, sign } = ArrayNumber.sub(this, a)
        this._digits = digits
        return this
    }

    /**
     * Returns a new ArrayNumber which is the result of a multiplication
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    multiply (a) {
        return ArrayNumber.multiply(this, a)
    }

    /**
     * Returns a new ArrayNumber which is the result of a multiplication
     * operation over this instance and the supplied parameter.
     * @param {number} a
     * @returns {ArrayNumber}
     */
    multiplyByDigit (a) {
        return __multiplyByDigit(this, a)
    }

    /**
     * Returns a new ArrayNumber which is the result of a multiplication
     * operation over this instance with n to the power of ten.
     * @param {number} n
     * @returns {ArrayNumber}
     */
    multiplyByPow10 (n) {
        const zeros = new Array(n).fill(0)
        return new ArrayNumber(zeros.concat(this._digits))
    }

    /**
     * Returns this ArrayNumber instance after the result of a multiplication
     * operation over this instance with n to the power of ten.
     * @param {number} n
     * @returns {ArrayNumber}
     */
    multiplyByPow10Equal (n) {
        const zeros = new Array(n).fill(0)
        this._digits = this.multiplyByPow10(n)._digits
        return this
    }

    /**
     * Returns this ArrayNumber instance after the result of a multiplication
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    multiplyEqual (a) {
        this._digits = ArrayNumber.multiply(this, a)._digits
        return this
    }

    /**
     * Returns a new ArrayNumber which is the result of an addition
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    plus (a) {
        return ArrayNumber.add(this, a)
    }

    /**
     * Returns this ArrayNumber instance after the result of an addition
     * operation over this instance and the supplied parameter.
     * @param {ArrayNumber} a
     * @returns {ArrayNumber}
     */
    plusEqual (a) {
        this._digits = ArrayNumber.add(this, a)._digits
        return this
    }
    plusPlus () {
        let carry = this._digits[0] + 1
        this._digits[0] = carry % 10
        //carry = this._digits[0] === 0 ? 1 : 0
        if (carry = this._digits[0] === 0 ? 1 : 0) {
            for (let index = 1; index < this._digits.length; index++) {
                carry += this._digits[index]
                if (carry === 10) {
                    this._digits[index] = 0
                    carry = 1
                } else {
                    this._digits[index] = carry
                    return
                }
            }
            this._digits.push(carry)
        }
    }
    power (expo) {
        return __power(this, expo)
    }
    /**
     * String representation of an ArrayNumber
     * @returns {string}
     */
    toString () {
        return [...this._digits].reverse().join('')
    }

    /**
     * String representation of an ArrayNumber with digit grouping
     * @returns {string}
     */
    toLocaleString () {
        /**
         *
         * @type {*[]}
         */
        let arr = [...this._digits]

        for (let x = 3; x < arr.length; x += 4) {
            arr.splice(x, 0, ',')
        }
        return arr.reverse().join('')
    }

    /**
     * Try converting the ArrayNumber to a regular number
     * @returns {number}
     */
    toNumber () {
        return parseInt([...this.digits].reverse().join(''))
    }

    /**
     * Addition operation over two ArrayNumbers
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {ArrayNumber}
     */
    static add (a, b) {
        return __add(a, b)
    }

    /**
     * Division operation over two ArrayNumbers
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {ArrayNumber}
     */
    static divide (a, b) {
        return __divide(a, b)
    }

    /**
     * Returns boolean if ArrayNumber a is equal to ArrayNumber b.
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {boolean}
     */
    static isEqual (a, b) {
        if (a.length === b.length) {
            for (let index = 0; index < a.length; index++) {
                if (a._digits[index] !== b._digits[index]) return false
            }
            return true
        }
        return false
    }

    /**
     * Returns boolean if ArrayNumber a is greater from ArrayNumber b.
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {boolean}
     */
    static isGreaterThen (a, b) {
        return !ArrayNumber.isEqual(a, b) && __getBigger(a, b) === a
    }

    /**
     * Returns boolean if ArrayNumber a is lesser from ArrayNumber b.
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {boolean}
     */
    static isLesserThen (a, b) {
        return !ArrayNumber.isEqual(a, b) && __getSmaller(a, b) === a
    }

    /**
     * Multiply operation over two ArrayNumbers
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {ArrayNumber}
     */
    static multiply (a, b) {
        return __multiply(a, b)
    }

    /**
     * Returns new ArrayNumber of n to the power of 10
     * @param n
     * @returns {ArrayNumber}
     */
    static nthPow10 (n) {
        const arr = new Array(n).fill(0)
        arr.push(1)
        return new ArrayNumber(arr)
    }

    static power (base, expo) {
        return __power (base, expo)
    }
    /**
     * Subtraction operation over two ArrayNumbers
     * @param {ArrayNumber} a
     * @param {ArrayNumber} b
     * @returns {ArrayNumber}
     */
    static sub (a, b) {
        return __sub(a, b)
    }
}


ArrayNumber.MAX_SAFE_INTEGER = new ArrayNumber(Number.MAX_SAFE_INTEGER)
module.exports = ArrayNumber