import React from 'react';
import Image from '../assets/content.svg';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { Link } from 'react-router-dom';



export const Pricing: React.FC = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black to-slate-900 relative">

        <main className="container mx-auto px-4 flex-grow">
          <div className="text-4xl md:text-6xl pt-8 text-center text-white font-bold mb-4 mt-8">Find your perfect plan</div>
            <div className="w-1/2 mx-auto">
              <h3 className="text-sm md:text-2xl font-base mb-10 text-gray-300 text-center">
                Get started with a tier that meets your needs
              </h3>
            </div>
            <div className="flex justify-center">
            <div className="grid gap-10 grid-cols-2 lg:w-3/4">
              <div className="col-span-2 md:col-span-1 bg-gradient-to-r shadow-lg shadow-emerald-900 from-emerald-600 to-emerald-400 rounded-3xl p-8">
                <div className="text-6xl text-white font-bold">
                  Essential
                </div>
                <div className="text-xl mt-4 text-gray-50 mb-10">
                  <span className="font-bold text-4xl">$17</span> / mo
                </div>
                <Link to="/signup"><div className="text-xl cursor-pointer shadow-md hover:shadow-xl text-emerald-500 bg-white rounded-3xl text-center py-3 mx-10 font-extrabold">
                  START FREE
                </div></Link>
                <div className="flex items-left space-x-2 ml-2 mt-8">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">4650 emails / month</span>
                </div>
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">Incredible Auto-Responses</span>
                </div>
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">Live Customer Support</span>
                </div>
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">Auto-Contacts, Events, and Notes</span>
                </div>
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <CancelIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">In Depth Analytics</span>
                </div>
                
              </div>
              <div className="col-span-2 md:col-span-1 bg-gradient-to-r shadow-lg shadow-cyan-900 from-cyan-600 to-cyan-400 rounded-3xl p-8">
                <div className="text-6xl text-white font-bold">
                  Business
                </div>
                <div className="text-xl mt-4 text-gray-50 mb-10">
                  <span className="font-bold text-4xl">$59</span> / mo
                </div>
                <Link to="/signup"><div className="text-xl cursor-pointer shadow-md hover:shadow-xl text-cyan-500 bg-white rounded-3xl text-center py-3 mx-10 font-extrabold">
                  START FREE
                </div></Link>
                <div className="flex items-left space-x-2 ml-2 mt-8">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">Everything In 'Essential'</span>
                </div>
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">12,400 Scanned Emails Monthly</span>
                </div>
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">Collaborative + Team Functions</span>
                </div>
                {/* <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold"></span>
                </div> */}
                <div className="flex items-left space-x-2 ml-2 mt-4">
                  <VerifiedIcon className="text-white" style={{ 'color': '#ffffff' }} />
                  <span className="text-white font-semibold">In Depth Analytics</span>
                </div>
              </div>
            </div>

            </div>
            <div className="text-white text-center mt-20 text-4xl">Don't see the right plan for you?</div>
            <Link to="/contact"><div className="text-white text-center mt-4 mb-20 text-lg underline">Contact us for more information on entreprise plans</div></Link>

        </main>

      {/* <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-pink-600 to-orange-400 clip-path-u-shape"></div>
      </div>
      <div className="flex flex-col h-1/4 font-sans bg-orange-400 relative">
       */}
      
      </div>
    </>
  );
};

export default Pricing;
