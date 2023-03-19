import { Router } from "express";
import DatabaseWrapper from "../firebase/Database";
import { randomBytes } from "crypto";

const QuizRouter = Router();

QuizRouter.route("/collections/:id")
    .get(async (req, res) => {
        if (!req.user || !req._user) return res.status(401).json({ error: "Unauthorized -- please log in." });
        const { id } = req.params;

        const set = DatabaseWrapper.getEntry("sets", s => s.id === id);
        if (!set) return res.status(404).json({ error: "Set not found." });

        return res.status(200).send({ set });
    })
    .post(async (req, res) => {
        if (!req.user || !req._user) return res.status(401).json({ error: "Unauthorized -- please log in." });
        const { id } = req.params;
        if (!id) return;

            const { name, options, answers } = req.body;
            const set = DatabaseWrapper.getEntry("sets", () => {}, 1, id);

            if (!set) return res.status(404).json({ error: "Set not found." });
            /** @ts-ignore */
            if (set.owner !== req._user?.name) return res.status(403).json({ error: "Forbidden -- you do not own this set." });
        
            await DatabaseWrapper.updateEntry("sets", id, {
                /** @ts-ignore */
                name: set.name,
                /** @ts-ignore */
                description: set.description,
                /** @ts-ignore */
                questions: set.questions.concat({
                    name,
                    options,
                    answers
                }),
                /** @ts-ignore */
                owner: set.owner,
                id
            });

            return res.status(204);
    });
QuizRouter.route("/collections")
    .post(async (req, res) => {
        if (!req.user || !req._user) return res.status(401).json({ error: "Unauthorized -- please log in." });
        const { name, description } = req.body;

        let setId = randomBytes(4).toString("hex");
        while (DatabaseWrapper.getEntry("sets", () => {}, 1, setId)) {
            setId = randomBytes(4).toString("hex");
        }

        await DatabaseWrapper.createEntry("sets", setId, {
            name,
            description,
            questions: [],
            owner: req._user?.name || "Guest",
            id: setId
        });

        await DatabaseWrapper.updateEntry("users", req._user.uid, {
            email: req.user.email,
            id: req.user.id,
            sets: (req.user.sets || []).concat(setId),
            name: req.user.name
        });

        return res.status(201).send({ message: "Created set successfully.", id: setId });    
    });

export default QuizRouter;