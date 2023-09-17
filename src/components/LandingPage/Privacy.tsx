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

    if (email.endsWith('@uwo.ca')) {
      alert("You'll need your school email for when you make your account, but for now please enter your personal email")
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
          <img className="w-40 h-auto mx-auto mt-10" src={WinderLogo} />


        <div className="container max-w-4xl my-20 mx-auto px-8 text-white py-8 mb-12 shadow-lg shadow-purple-300 bg-gradient-to-r from-purple-500 to-purple-400 bg-opacity-50 rounded-2xl">
        Privacy Policy for Winder

Last updated: [Date]
1. Introduction

Welcome to Winder, the dating app that connects people from around the world. We respect the privacy of our users and are committed to protecting it through our compliance with this policy.
2. Information We Collect

2.1. Personal Data

When you register with Winder, we may ask you to provide certain personal information including:

    Name
    Age
    Gender
    Email Address
    Location
    Profile Pictures
    Bio/Description

2.2. Usage Data

We may also collect information on how the app is accessed and used. This may include:

    Your IP address
    Device information
    Browser type and version
    Usage statistics

3. How We Use Your Information

We use the information we collect:

    To provide and maintain our service.
    To notify you about changes to our app.
    To allow you to participate in interactive features.
    To provide customer support.
    For analysis and improvement of the app.

4. Disclosure of Your Information

We do not sell or rent personal information to third parties. However, we may disclose aggregated information about our users, which does not identify any individual, for business purposes.
5. Security

We take precautions to protect your information. When you submit sensitive information via the app, your information is protected both online and offline.
6. Accessing and Correcting Your Information

You can review and change your personal information by logging into the app and visiting your account profile page.
7. Data Retention

We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for.
8. Children Under the Age of 13

Winder is not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13.
9. Changes to the Privacy Policy

Any changes we make to our privacy policy in the future will be posted on this page with an updated revision date.
10. Contact Information

For questions or comments about this privacy policy and our privacy practices, contact us:

support@winderapp.com

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
