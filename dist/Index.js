"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = require("firebase-admin");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// ROUTES
const Account_1 = __importDefault(require("./routes/Account"));
const Quiz_1 = __importDefault(require("./routes/Quiz"));
// DATABASE
const Database_1 = __importDefault(require("./firebase/Database"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(async function (req, res, next) {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).send({ error: "Unauthorized -- please log in." });
    try {
        const user = await (0, firebase_admin_1.auth)().verifyIdToken(token);
        let client = Database_1.default.getEntry("users", () => { }, 1, user.uid);
        req._user = user;
        req.user = client;
        next();
    }
    catch (error) {
        console.trace("[SERVER] Error verifying token: " + error);
        if (req.method === "GET")
            return next();
        res.status(401).json({ error: "Unauthorized -- please log in." });
    }
});
app.use("/account", Account_1.default);
app.use("/quiz", Quiz_1.default);
app.listen(PORT, () => console.log("[SERVER] Running on port " + PORT));
