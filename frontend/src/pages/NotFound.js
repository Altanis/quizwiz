import React from 'react';
import Navbar from '../components/Navbar';

export default function NotFound() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl font-bold text-gray-700 mb-4">Oops! Page not found</h1> 
                <p className="text-lg text-gray-600 mb-8">The page you are looking for does not exist.</p>
                <a href="/" className="text-indigo-600 hover:text-indigo-800">Go back to the homepage</a>
            </div>
        </div>
  );
};