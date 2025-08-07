// pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            {/* 🎬 Funny GIF */}
            <div className="flex justify-center items-center w-full">
                <img
                    src="/404.png"
                    alt="Funny 404"
                    className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-auto mb-6 -mt-24 sm:-mt-32 md:-mt-40 object-cover"
                />
            </div>


            <p className="text-xl mt-2 text-gray-700">Page Not Found</p>

            <Link
                to="/"
                className="mt-6 inline-block px-6 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
