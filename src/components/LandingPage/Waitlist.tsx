import React, { useState } from 'react';
import Image from '../assets/content.svg';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { toast } from 'react-toastify';
import { subscribeToWaitlist } from '../../actions/emailMarketing';
import WinderLogo from "../../assets/Winder.png";


export const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.includes('@') || firstName==="") {
      alert("Please fill in the fields correctly");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    
    toast.promise(dispatch(subscribeToWaitlist(email, firstName)).then(resp => {

      if (resp.valid) {
        
      } else {

      }
      setIsLoading(false);
    }),
    {
      pending: 'Joining...',
      success: 'Successfuly signed up for the waitlist!',
      error: 'Error',
  },
  {
      toastId: 'subToWaitlist',
      theme: "light",
      position: "bottom-left",
      autoClose: 5000,
  }

);

  };

  return (
    <>
      <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-white to-gray-50 relative">
        <main className="container mx-auto px-4 flex-grow">
          <div className="w-3/4 mx-auto">

          </div>
          {/* <img className="w-40 h-auto" src={WinderLogo} /> */}


        <div className="container max-w-4xl my-20 mx-auto px-4 py-8 mb-12 shadow-lg shadow-purple-300 bg-gradient-to-r from-purple-500 to-purple-400 bg-opacity-50 rounded-2xl">
          <div className="text-4xl md:text-7xl pt-2 text-center text-white font-extrabold my-2 mb-5">Join the waitlist</div>
          <h3 className="text-md md:text-base font-base mb-10 text-gray-900 text-center">
            Be first in line to get access to{' '}
            <span className="font-semibold underline">the dating app of the future</span>
          </h3>

          <form className="w-full max-w-lg mx-auto"onSubmit={handleSubmit}>
            <div className="flex flex-wrap">
              <div className="flex flex-wrap mb-4">
                <div className="w-1/2 px-2 mt-4">
                  <label className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2" htmlFor="name">
                    First Name
                  </label>
                  <input className="appearance-none shadow-md block w-full truncate bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name" type="text" placeholder="John" value={firstName} onChange={(n) => setFirstName(n.target.value)} />
                </div>
                <div className="w-1/2 px-2 mt-4">
                  <label className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2" htmlFor="name">
                    Email
                  </label>
                  <input className="appearance-none shadow-md block w-full truncate bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="jsmith@uwo.ca" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

            </div>
            <div className="flex items-center justify-center">
              {!isLoading ? <button className="bg-black mx-auto mt-6 text-2xl hover:-translate-y-px hover:bg-gray-900 text-white font-bold mb-3 py-3 px-10 transition duration-200 rounded-lg focus:outline-none focus:shadow-outline" type="submit">
                Submit
              </button> : <CircularProgress className="items-center justify-center" size={28} style={{ color: '#000000' }} />}
            </div>
          </form>
          {/* <img src={TiresImg} alt="Tires" className=" absolute invisible -mr-4 lg:visible bottom-44 z-5 left-0 lg:w-40  xl:w-64 h-auto " /> */}
          <div className="flex justify-center items-center pt-6 pb-2 ">
            <span className="mr-3 text-sm text-gray-700 ">We'll send you updates periodically with reminders and more information</span>
          </div>

        </div>

        {/* <h1 className="text-7xl pt-10 text-white text-center font-semibold">Dominate Your Industry</h1> */}

        {/* <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 py-10">
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

        <div className="flex flex-col gap-4 mb-20 md:gap-0 md:items-stretch md:flex-row justify-center mt-6">
          <div className="bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
            <div className="text-3xl font-bold text-white">
              Hyper Personalized
            </div>
            <div className="text-sm text-gray-200 mt-3 px-8">
              ChatGPT's unparalleled authenticity responds just like a human
            </div>
          </div>
          <div className=" bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
            <div className="text-3xl font-bold text-white">
              Subject Detection
            </div>
            <div className="text-sm text-gray-200 mt-3 px-8">
              Add a custom subject line to detect, or let us do the heavy lifting
            </div>
          </div>
          <div className=" bg-gray-600 bg-opacity-10 text-center mx-4 py-8 p-6 rounded-2xl md:w-1/4">
            <div className="text-3xl font-bold text-white">
              Quick Responses
            </div>
            <div className="text-sm text-gray-200 mt-3 px-8">
              SpeedLead responds to inbound leads within 90 seconds
            </div>
          </div>
        </div> */}


        </main>
      </div>
    </>
  );
};

export default Waitlist;
