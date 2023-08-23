import React from 'react';
import powerImg from '../../assets/power.jpg';
import { Link, useLocation } from 'react-router-dom';
import fingerImg from '../../assets/finger.png';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const Brief = () => {
  const query = useQuery();
  const pageId = query.get('page');

  
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black via-slate-950 via-90% to-slate-900 to-95% relative">
      <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 pt-20 pb-8">
        <div className="ml-4 w-full">
            <h1 className="text-white text-4xl md:text-7xl text-center font-semibold">
                Everything You Need To Get <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">More Clients</span>
            </h1>
            <h3 className="text-gray-100 text-center text-xl md:text-2xl mt-6 ml-2">Companies who consistently respond to their inbound leads first close <span className="underline">5 times more deals.</span></h3>
        </div>
      </div>
      <img
          className="w-1/4 h-auto mx-auto my-4 rounded-3xl"
          src={powerImg}
          alt="Your Image Description"
        />

      <div className="flex flex-col gap-4 md:gap-0 md:items-stretch md:flex-row justify-center mt-6 mb-2">
        <div className="bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
          <div className="text-3xl font-bold text-white">
            Grow Sales
          </div>
          <div className="text-sm text-gray-200 mt-3 px-8">
            SpeedLead responds to inbound leads within 90 seconds
          </div>
        </div>
        <div className=" bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
          <div className="text-3xl font-bold text-white">
            Save Time
          </div>
          <div className="text-sm text-gray-200 mt-3 px-8">
            Add a custom subject line to detect, or let us do the heavy lifting
          </div>
        </div>
        <div className=" bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
          <div className="text-3xl font-bold text-white">
            Impress Clients
          </div>
          <div className="text-sm text-gray-200 mt-3 px-8">
            ChatGPT's unparalleled authenticity responds just like a human
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 py-20">
        <div className="ml-4 mr-10">
            <h1 className="text-white text-4xl md:text-6xl font-semibold">
                Empowering teams to grow <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">effortlessly</span>
            </h1>
        </div>
        <div className="max-w-3/4 ml-2">
          <h3 className="text-gray-100 text-sm md:text-lg mt-6 ml-2">
          <div>Roughly 16.4 million businesses in the United States and Canada have a form on their website for customers to contact them. Yet, shockingly, 50% of these companies don't respond to their customers within 5 days!</div>
          <br></br>
          <div>Companies that respond to their inbound clients within 5 minutes end up increasing their conversion rate by 900%. This is why we make it easy for you to make more money, by responding for you with ChatGPT.</div>
          </h3>
        </div>
      </div>

      <div className="text-center bg-gray-700 bg-opacity-20 shadow-2xl rounded-3xl mx-2 px-4 md:mx-20 lg:mx-64 xl:mx-80 py-12 mb-10 mt-10">
        <div className="text-white mb-4 text-4xl md:text-6xl font-semibold">
          Get Started For Free
        </div>
        <div className="mb-20 text-white">
          Get your first 25 responses for free when you sign up today <span><img className="inline h-6" src={fingerImg} alt="Down"/></span>
        </div>
        <Link to="/signup" className="bg-pink-800 hover:bg-orange-600 text-white text-2xl font-semibold py-4 px-8 mb-10  rounded-2xl mx-auto mt-8 transition duration-200 ease-in-out transform hover:scale-105">
            Start Now
        </Link>
      </div>
    </div>
  );
};

export default Brief;
