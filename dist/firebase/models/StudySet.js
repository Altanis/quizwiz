"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("../Config");
;
;
/** A StudySet class, representing every study set. */
class StudySet {
    id = "";
    questions = [];
    loaded = false;
    constructor(id) {
        this.id = id;
    }
    /** Retreives the user from the database (given id). */
    async retrieve() {
        const user = await Config_1.Database.collection("sets").doc(this.id).get();
        if (!user.exists) {
            await Config_1.Database.collection("sets").doc(this.id).set(this.toJSON());
            this.loaded = true;
            return;
        }
        this.questions = user.data().questions;
        this.loaded = true;
    }
    /** Updates the user in the database. */
    async update(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                /** @ts-ignore */
                this[key] = data[key];
            }
        }
        await Config_1.Database.collection("users").doc(this.id).set(this.toJSON());
    }
    /** Converts the class to JSON. */
    toJSON() {
        return {
            questions: this.questions,
        };
    }
}
exports.default = StudySet;
