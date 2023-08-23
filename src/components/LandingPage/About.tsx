import React from 'react';
import powerImg from '../../assets/power.jpg';
import { Link } from 'react-router-dom';
import fingerImg from '../../assets/finger.png';


const About = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black via-slate-950 via-90% to-slate-900 to-95% relative">
      <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 py-20">
        <div className="ml-4 w-1/2">
            <h1 className="text-white text-4xl md:text-7xl font-semibold">
                Built To Help You Save <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">Time</span>
            </h1>
            <h3 className="text-gray-100 text-xl md:text-2xl mt-6 ml-2">People who consistently use ReallyMail save on average <span className="underline">1-2 hours per week.</span></h3>
        </div>
        <img
          className="w-1/2 md:w-2/5 mr-4 rounded-3xl"
          src={powerImg}
          alt="Your Image Description"
        />
      </div>

      <div className="flex flex-col gap-4 md:gap-0 md:items-stretch md:flex-row justify-center mt-6 mb-2">
        <div className="bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
          <div className="text-3xl font-bold text-white">
            Incredible Filtering
          </div>
          <div className="text-sm text-gray-200 mt-3 px-8">
            Rest assured knowing you'll always see the most important emails first
          </div>
        </div>
        <div className=" bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
          <div className="text-3xl font-bold text-white">
            High Throughput
          </div>
          <div className="text-sm text-gray-200 mt-3 px-8">
            Connect multiple email accounts, send and receive emails at light speed 
          </div>
        </div>
        <div className=" bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
          <div className="text-3xl font-bold text-white">
            Keep Tabs
          </div>
          <div className="text-sm text-gray-200 mt-3 px-8">
            Have advanced AI take detailed notes on every contact, process, and event
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 py-20">
        <div className="ml-4 mr-10">
            <h1 className="text-white text-4xl md:text-6xl font-semibold">
                Empowering you to work <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-600">effortlessly</span>
            </h1>
        </div>
        <div className="max-w-3/4 ml-2">
          <h3 className="text-gray-100 text-sm md:text-lg mt-6 ml-2">
          <div>The average professional spends 28% of their work day reading and answering emails according to McKinsey and Harvard Business Review. That amounts to 2.6 hours spent and 120 messages received per day!</div>
          <br></br>
          <div>ReallyMail gives you back time to learn, create, and explore by making email easy. Don't just take our word for it, experience the magic for yourself.</div>
          </h3>
        </div>
      </div>

      <div className="text-center  shadow-2xl rounded-3xl mx-2 px-4 md:mx-20 lg:mx-64 xl:mx-80 py-12 mb-10 mt-10">
        <div className="text-white mb-4 text-4xl md:text-6xl font-semibold">
          Get Started For Free
        </div>
        <div className="mb-20 text-white">
          Get your first 100 emails for free when you sign up today <span><img className="inline h-6" src={fingerImg} alt="Down"/></span>
        </div>
        <Link to="/signup" className="bg-cyan-600 hover:bg-cyan-700 text-white hover:shadow-md hover:shadow-cyan-900 text-2xl font-semibold py-4 px-8 mb-10  rounded-2xl mx-auto mt-8 transition duration-200 ease-in-out transform hover:scale-105">
            Start Now
        </Link>
      </div>
    </div>
  );
};

export default About;
