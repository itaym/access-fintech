export default class Cache {
    constructor(decayPolicy) {
        this.decayPolicy = { ...decayPolicy }

        if (!this.decayPolicy.maxSize) this.decayPolicy.maxSize = 0
        if (!this.decayPolicy.expireIn) this.decayPolicy.expireIn = Number.MAX_SAFE_INTEGER

        this.cache = new Map()
    }

    set(key, item) {
        this.cache.set(key, {
            item,
            expire: Date.now() + this.decayPolicy.expireIn,
        })

        if (this.cache.size >= this.decayPolicy.maxSize) {
            const keysToDelete = []
            const now = Date.now()
            this.cache.forEach((item, key) => {
                if (item.expire < now) {
                    keysToDelete.push(key)
                }
            })
            keysToDelete.forEach(key => this.cache.delete(key))
        }
        return item
    }
    get(key) {
        const item = this.cache.get(key) || {}
        item.expire = Date.now() + this.decayPolicy.expireIn
        return item.item
    }
    has(key) {
        return this.cache.has(key)
    }

    get size () {
        return this.cache.size
    }
}