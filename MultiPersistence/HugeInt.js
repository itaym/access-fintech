class HugeInt {
    constructor() {
        this.numArr = [{count: 1, digit: 0}]
        this.numLen = 1
    }
    addOne() {
        let position = this.numLen - 1
        let number = this.numArr[position]

        const onAnyOtherDigit = (position) => {
            number = this.numArr[position]
            if (number.count === 1) {
                number.digit++
                return
            }
            number.count--
            this.numArr.unshift(this.numArr[0])
            for (let index = 1; index < position - 1; index++) {
                this.numArr[index] = this.numArr[index + 1]
            }
            this.numArr[position] = {
                digit: number.digit + 1,
                count: 1,
            }
        }

        switch (number.digit) {
            case 0:
                if (number.count === 1) {
                    number.digit = 1
                } else {
                    number.count--
                    this.numArr.push({
                        count: 1,
                        digit: 1,
                    })
                    this.numLen++
                }
                return
            case 9:
                number.digit = 0
                if (position === 0) {
                    this.numArr.unshift({
                        count: 1,
                        digit: 1,
                    })
                    this.numLen++
                } else {
                    position--
                    onAnyOtherDigit(position)
                }
                return
            default:
                onAnyOtherDigit(position)
        }
    }

    divideBy10power(count) {
        while (count) {
            const lastNumber = this.numArr[this.numLen - 1]
            if (lastNumber.count >= count) {
                lastNumber.count -= count
                count = 0
            } else {
                count -= lastNumber.count
                this.numArr.pop()
                this.numLen--
            }
        }
    }
    modulo10() {
        return this.numArr[this.numLen - 1].digit
    }
    multiplyBy10power(count) {
        if (this.numArr[this.numLen - 1].digit === 0) {
            this.numArr[this.numLen - 1].count+= count
        }
        else {
            this.numArr.push({
                count,
                digit: 0
            })
            this.numLen++
        }
    }
}