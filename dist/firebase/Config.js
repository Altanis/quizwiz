"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = exports.App = void 0;
require("dotenv/config");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const service_json_1 = __importDefault(require("../service.json"));
const firebaseConfig = {
    credential: firebase_admin_1.default.credential.cert(service_json_1.default),
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    databaseURL: process.env.FIREBASE_DB_URL
};
const App = firebase_admin_1.default.initializeApp(firebaseConfig);
exports.App = App;
const Database = firebase_admin_1.default.firestore(App);
exports.Database = Database;
