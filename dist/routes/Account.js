"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const express_1 = require("express");
const Database_1 = __importDefault(require("../firebase/Database"));
const AccountRouter = (0, express_1.Router)();
AccountRouter.route("/login")
    .post(async (req, res) => {
    const id = req.user?.id || (0, crypto_1.randomBytes)(4).toString("hex");
    const otherUsers = Database_1.default.getEntry("users", u => u.name === (req._user?.name || "Guest"), Infinity);
    if (!Array.isArray(otherUsers)) {
        /** @ts-ignore */
        if (!req._user)
            req._user = { name: "Guest" };
        /** @ts-ignore */
        req._user.name += ` 1`;
    }
    else {
        /** @ts-ignore */
        if (!req._user)
            req._user = { name: "Guest" };
        /** @ts-ignore */
        req._user.name += ` ${otherUsers.length}`;
    }
    if (!req.user) {
        if (!req._user)
            return res.status(401).json({ error: "Unauthorized -- please log in." });
        await Database_1.default.createEntry("users", req._user.uid, {
            email: req._user.email || "",
            sets: [],
            id,
            name: req._user?.name
        });
    }
    res.status(200).send({ message: "Logged in successfully.", id });
});
AccountRouter.route("/search/:name")
    .get(async (req, res) => {
    const name = req.params.name;
    /** @ts-ignore */
    const users = Database_1.default.getEntry("users", u => u.name.toLowerCase().includes(name.toLowerCase()), 10).map(u => ({ name: u.name, id: u.id }));
    /** @ts-ignore */
    const sets = Database_1.default.getEntry("sets", s => s.name.toLowerCase().includes(name.toLowerCase()), 10).map(s => ({ name: s.name, id: s.id }));
    res.status(200).send({ users, sets });
});
AccountRouter.route("/profile/:id")
    .get(async (req, res) => {
    const id = req.params.id;
    const user = Database_1.default.getEntry("users", u => u.id === id);
    if (!user)
        return res.status(404).send({ error: "User not found." });
    /** @ts-ignore */
    const sets = user.sets.map(s => Database_1.default.getEntry("sets", e => e.id === s));
    /** @ts-ignore */
    const sendingSets = sets.map(s => ({ name: s.name, description: s.description, id: s.id })).sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).send({
        /** @ts-ignore */
        name: user.name || "Guest",
        sets: sendingSets
    });
});
exports.default = AccountRouter;
