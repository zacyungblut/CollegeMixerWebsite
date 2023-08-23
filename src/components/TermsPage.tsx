import React from 'react';
import { Link } from 'react-router-dom';

export const TermsAndServices: React.FC = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black to-slate-900 relative">
        <main className="container mx-auto px-4 flex-grow">
          <div className="text-4xl md:text-5xl pt-8 text-center text-white font-bold mb-12 mt-8">Terms and Services</div>
          <div className="w-3/4 md:w-1/2 mx-auto text-sm md:text-base text-gray-200 leading-relaxed">
            <p className="mb-4">
              By using our services, you agree to be bound by these terms and conditions.
              We reserve the right to modify these terms at any time without prior notice.
            </p>
            <p className="mb-4">
              Our services are provided on an "as is" basis, without any warranties or guarantees.
              We do not guarantee that our services will be uninterrupted or error-free.
            </p>
            <p className="mb-4">
              You are responsible for your use of our services and agree to comply with all applicable laws and regulations.
              You may not use our services for any illegal, unauthorized, or harmful purposes.
            </p>
            <p className="mb-4">
              We reserve the right to terminate your access to our services at any time, without notice, for any reason.
              We may also remove any content or information that you submit through our services at our discretion.
            </p>
          </div>
          <div className="flex justify-center">
            <Link to="/" className="bg-rose-800 hover:bg-orange-600 text-white text-xl font-semibold py-2 px-8 rounded-full mx-auto mt-8 transition duration-200 ease-in-out transform hover:scale-105">
              Go Back
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
