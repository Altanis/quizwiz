"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./Config");
;
;
;
/** A wrappper around the FireBase Database. */
class DatabaseWrapper {
    collections = ["users", "sets"];
    users = new Map();
    sets = new Map();
    constructor() {
        this.retreiveAll();
        setInterval(() => this.retreiveAll(), 1000 * 60 * 5);
    }
    async retreiveAll() {
        for (const collection of this.collections) {
            Config_1.Database.collection(collection).get().then((snapshot) => {
                snapshot.forEach(doc => {
                    /** @ts-ignore */
                    this[collection].set(doc.id, doc.data());
                });
            });
        }
        ;
    }
    getEntry(type, filter, num = 1, id) {
        /** @ts-ignore */
        if (!this[type])
            throw new Error("Could not get entry: No type provided.");
        // please never do [...Map].find
        /** @ts-ignore */
        if (id)
            return this[type].get(id);
        else {
            /** @ts-ignore */
            const entry = [...this[type].values()].filter(filter).slice(0, num);
            if (num === 1)
                return entry[0];
            else
                return entry;
        }
    }
    async createEntry(type, id, data) {
        if (!this.collections.includes(type))
            throw new Error("Could not create entry: Invalid type provided.");
        await Config_1.Database.collection(type).doc(id).set(data);
        /** @ts-ignore */
        this[type].set(id, data);
        return data;
    }
    async updateEntry(type, id, data) {
        if (!this.collections.includes(type))
            throw new Error("Could not update entry: Invalid type provided.");
        /** @ts-ignore */
        await Config_1.Database.collection(type).doc(id).update(data);
        /** @ts-ignore */
        this[type].set(id, data);
        return data;
    }
}
;
exports.default = new DatabaseWrapper();
