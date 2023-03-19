import "dotenv/config";

import { App, Database } from "./firebase/Config";
import Express from "express";
import { auth } from "firebase-admin";
import CookieParser from "cookie-parser";
import cors from "cors";

// ROUTES
import AccountRouter from "./routes/Account";
import QuizRouter from "./routes/Quiz";

// DATABASE
import DatabaseWrapper from "./firebase/Database";

const app = Express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(Express.json());
app.use(CookieParser());
app.use(async function (req, res, next) { // Verify that the user is logged in
	const token = req.cookies.token;
	if (!token) return res.status(401).send({ error: "Unauthorized -- please log in." });
	
	try {
        const user = await auth().verifyIdToken(token);
        let client = DatabaseWrapper.getEntry("users", () => {}, 1, user.uid);

        req._user = user;
        req.user = client;

		next();
	} catch (error) {
		console.trace("[SERVER] Error verifying token: " + error);
		if (req.method === "GET") return next();
		res.status(401).json({ error: "Unauthorized -- please log in." });
    }
});

app.use("/account", AccountRouter);
app.use("/quiz", QuizRouter);

app.listen(PORT, () => console.log("[SERVER] Running on port " + PORT));