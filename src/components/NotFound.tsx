import React from 'react';
import { Link } from 'react-router-dom';
import LostImg from '../assets/Lost.svg';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black to-slate-900">
      <main className="container mx-auto px-4 flex-grow text-center">
        <h1 className="text-5xl md:text-8xl pt-8 text-white font-bold mb-12 mt-8"></h1>
        <h2 className="text-3xl md:text-6xl text-white font-bold mb-6">Page Not Found</h2>

        <p className="text-gray-200 text-lg mb-8">
          Sorry, the page you were looking for could not be found.
        </p>
        <Link to="/" className="bg-rose-800 hover:bg-orange-600 text-white text-2xl font-semibold py-3 px-8 rounded-full transition duration-200 ease-in-out transform hover:scale-105">
          Go Home
        </Link>
      </main>
    </div>
  );
};

export default NotFound;
