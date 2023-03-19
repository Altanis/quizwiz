"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
;
/** A User class, representing every client of the application. */
class User {
    authId = "";
    email = "";
    loaded = false;
    constructor(authId) {
        this.authId = authId;
    }
    /** Retreives the user from the database (given authId). */
    async retrieve() {
        const user = await Config_1.Database.collection("users").doc(this.authId).get();
        if (!user.exists)
            return false;
        this.email = user.data().email;
        this.loaded = true;
        return true;
    }
    /** Updates the user in the database. */
    async update(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                /** @ts-ignore */
                this[key] = data[key];
            }
        }
        console.log(this.toJSON());
        await Config_1.Database.collection("users").doc(this.authId).set(this.toJSON());
    }
    /** Converts the class to JSON. */
    toJSON() {
        return {
            email: this.email
        };
    }
}
exports.default = User;
