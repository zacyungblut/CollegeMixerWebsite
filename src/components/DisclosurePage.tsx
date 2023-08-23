import React from 'react';
import { Link } from 'react-router-dom';

export const TermsAndServices: React.FC = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black to-slate-900 relative">
        <main className="container mx-auto px-4 flex-grow">
          <div className="text-4xl md:text-5xl pt-8 text-center text-white font-bold mb-12 mt-8">Google Limited Use Policy Disclosure</div>
          <div className="w-3/4 md:w-1/2 mx-auto text-sm md:text-base text-gray-200 leading-relaxed">
            <p className="mb-4">
            SpeedLead's use and transfer of information received from Google APIs to any other app will adhere to <a className="underline text-blue-500 hover:text-blue-600" href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes" target="_blank">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
          </div>
          <div className="flex justify-center">
            <Link to="/" className="bg-rose-800 hover:bg-orange-600 text-white text-xl font-semibold py-2 px-8 rounded-full mx-auto mt-8 transition duration-200 ease-in-out transform hover:scale-105">
              Home
            </Link>
          </div>
        </main>
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-pink-600 to-orange-400 clip-path-u-shape"></div>
      </div>
      <div className="flex flex-col h-1/4 font-sans bg-orange-400 relative"></div>
    </>
  );
};

export default TermsAndServices;
