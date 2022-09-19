
class MyPromise {
    constructor(fn) {
        fn(this.resolve)
    }
    resolve = (result) => {
        this.result = result
        if (this.fnThen) {
            this.fnThen(result)
        }
    }
    then (fn) {
        if (this.result) {
            return new MyPromise((resolve) => { resolve(fn(this.result))})

        }
        else {
            return new MyPromise((resolve) => {
                this.fnThen = (value) => resolve(fn(value))
            })
        }
    }
}


const promise = new MyPromise((resolve) => {
    setTimeout(() => resolve(1), 300)
})


promise.then((result) => {
    return ++result
})
    .then((result) => {
    console.log(result)
})