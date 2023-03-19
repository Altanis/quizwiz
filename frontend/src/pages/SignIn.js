import React from "react";
import { GoogleButton } from "react-google-button";
import { useSearchParams } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import Navbar from '../components/Navbar';

export default function SignIn() {
    const [searchParams] = useSearchParams();
    const error = searchParams.get("error");
    let message = "";

    switch (error) {
        case "1": message = "An error occurred while signing in. Please try again."; break;
        case "2": message = "An error occurred while authorizing you. Please try again."; break;
        default: message = ""; break;
    }

    const { signIn } = UserAuth();
    
    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center h-full">
                {message && <p className="text-red-500 text-2xl font-bold">{message}</p>}
                <div className="max-w-[240px] m-[5%] py-4">
                    <GoogleButton className="rounded-lg" onClick={async () => (await signIn())} />
                </div>
            </div>
        </div>
    );
};