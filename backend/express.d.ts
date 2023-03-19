import { auth } from "firebase-admin";
import Client from "./firebase/models/User";
import DatabaseWrapper from "./firebase/Database";

interface User extends auth.DecodedIdToken { };
declare global {
    namespace Express {
        interface Request {
            /** The user parsed through middleware functions. */
            _user?: User;
            /** The user parsed through middleware functions and JWT token verification. */
			user?: Client;
        }
    }
};