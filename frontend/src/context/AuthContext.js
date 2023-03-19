import { useContext, createContext, useEffect, useState } from "react";

import { Auth } from "../firebase";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    getAuth,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const signIn = async () => {
        const provider = new GoogleAuthProvider();
        const data = await signInWithPopup(Auth, provider);
        const resolve = GoogleAuthProvider.credentialFromResult(data);
        if (!resolve) window.location.href = "/login?error=1";

        const token = await getAuth().currentUser.getIdToken();

        document.cookie = `token=${token}; path=/; max-age=604800`;

        const response = await fetch("http://localhost:3001/account/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        if (response.status === 200) {
            const r = await response.json();
            console.log(r);
            localStorage.id = r.id;
            window.location.href = `/profile/${localStorage.id}`;
        } else {
            logOut();
            window.location.href = "/login?error=2";
        }
        
        return resolve;
    };

    const logOut = async () => {
        await signOut(Auth);
        document.cookie = "";
        window.location.href = "/";
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, user => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{signIn, logOut, user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const UserAuth = () => useContext(AuthContext);