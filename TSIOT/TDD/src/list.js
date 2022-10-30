module.exports = class List {
    elements = []

    constructor() {}

    count() {
        return this.elements.length;
    }

    add(key, value) {
        if(key === null || key === "" || typeof(key) !== "string")
            return false;

        if(value === null)
            return false;

        if (this.getIndex(key) !== -1)
            return false;

        this.elements.push(
            { "key" : key, "value" : value }
        )
        return true;
    }

    get(key) {
        let i = this.getIndex(key);
        if(i === -1)
            return null;
        return this.elements[i].value;
    }

    update(key, newvalue) {
        let i = this.getIndex(key);
        if(i === -1)
            return false;
        this.elements[i].value = newvalue;
        return true;
    }

    getKeys() {
        let keys = [];
        this.elements.forEach((elem) => {
            keys.push(elem.key);
        })
        return keys.sort();
    }

    delete(key) {
        let i = this.getIndex(key);
        if(i === -1)
            return false;
        this.elements.splice(i, 1);
        return true;
    }

    getIndex(key) {
        for(let i = 0; i < this.elements.length; i++) {
            if(this.elements[i].key === key) {
                return i;
            }
        }
        return -1;
    }
}