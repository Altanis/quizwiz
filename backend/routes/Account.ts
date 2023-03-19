import { randomBytes } from "crypto";
import { Router } from "express";
import DatabaseWrapper from "../firebase/Database";

const AccountRouter = Router();

AccountRouter.route("/login")
    .post(async (req, res) => {
        const id = req.user?.id || randomBytes(4).toString("hex");

        const otherUsers = DatabaseWrapper.getEntry("users", u => u.name === (req._user?.name || "Guest"), Infinity);
        if (!Array.isArray(otherUsers)) {
            /** @ts-ignore */
            if (!req._user) req._user = { name: "Guest" };
            /** @ts-ignore */
            req._user.name += ` 1`;
        } else {
            /** @ts-ignore */
            if (!req._user) req._user = { name: "Guest" };
            /** @ts-ignore */
            req._user.name += ` ${otherUsers.length}`;
        }

        if (!req.user) {
            if (!req._user) return res.status(401).json({ error: "Unauthorized -- please log in." });
            await DatabaseWrapper.createEntry("users", req._user.uid, {
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
        const users = DatabaseWrapper.getEntry("users", u => u.name.toLowerCase().includes(name.toLowerCase()), 10).map(u => ({ name: u.name, id: u.id }));
        /** @ts-ignore */
        const sets = DatabaseWrapper.getEntry("sets", s => s.name.toLowerCase().includes(name.toLowerCase()), 10).map(s => ({ name: s.name, id: s.id }));

        res.status(200).send({ users, sets });
    });


AccountRouter.route("/profile/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        const user = DatabaseWrapper.getEntry("users", u => u.id === id);
        if (!user) return res.status(404).send({ error: "User not found." });
        /** @ts-ignore */
        const sets = user.sets.map(s => DatabaseWrapper.getEntry("sets", e => e.id === s));
        /** @ts-ignore */
        const sendingSets = sets.map(s => ({ name: s.name, description: s.description, id: s.id })).sort((a, b) => a.name.localeCompare(b.name));

        res.status(200).send({ 
            /** @ts-ignore */
            name: user.name || "Guest",
            sets: sendingSets
        });
    });

export default AccountRouter;