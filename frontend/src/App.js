import React from "react";
import { Route, Routes } from 'react-router-dom';
import "./index.css";

import { AuthContextProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import StudySet from "./pages/StudySet";
import Flashcards from "./pages/Flashcard";

export default function App() {
    return (
        <AuthContextProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/search/:query" element={<Search />} />
                <Route path="/collections/:id" element={<StudySet />}/>
                <Route path="/collections/:id/flashcard" element={<Flashcards />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </AuthContextProvider>
    )
};