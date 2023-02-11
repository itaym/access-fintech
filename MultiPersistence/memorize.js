import Cache from './Cache.js'

export default function memorize(fn) {
    const memory = new Cache({expireIn: 30_000, maxSize: 200_000})

    return function (n) {
        if (memory.has(n)) {
            let tmp = memory.get(n)
            return tmp
        }
        const tmp = fn(n)
        memory.set(n, tmp)
        return tmp
    }
}