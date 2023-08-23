import React, { useState, useEffect } from 'react';
import Image from '../assets/content.svg';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Link, useNavigate } from 'react-router-dom';
import Parallax from './Parallax';
import MailboxImg from '../../assets/Mailbox.png';
import CashImg from '../../assets/Cash.png';
import CarImg from '../../assets/Car.png';
import TiresImg from '../../assets/Tires.png';
import fingerImg from '../../assets/finger.png';
import ChatGPTImg from '../../assets/ChatGPTLogo.png';

import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { sendInboundEmail } from '../../actions/autoInbound';
import { CircularProgress } from '@mui/material';
import { Helmet } from 'react-helmet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';
import GmailLogo from "../../assets/GmailLogo.png";
import OutlookLogo from "../../assets/Outlook.png"; // Outlook logo
import ZohoLogo from "../../assets/Zoho.png"; // Outlook logo
import LandingImg1 from "../../assets/Landing1.png";
import LandingImg2 from "../../assets/Landing2.png";
import LandingImg3 from "../../assets/Landing3.png";
import { IconButton, Badge, Avatar } from '@mui/material';
import FlashingHeader from '../Widgets/FlashingHeader';


 

export const LandingPage: React.FC = () => {

  const [messageLength, setMessageLength] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState<boolean>(false);
  const navigate = useNavigate();


  const handleTextareaChange = (e: any) => {
    const textareaLength = e.target.value.length;
    setMessageLength(textareaLength);
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);


    if (name==='' || email==='' || message==='') {
      alert("Please complete all fields");
      setIsLoading(false);
      return;
    } else if (messageLength<45) {
      alert("Please write until the progress bar is full so sure we have enough information");
      setIsLoading(false);
      return;
    }

    // Post the values to backend
    console.log({ name, email, message });

    await dispatch(sendInboundEmail(name, email, message, 'zacyungblut@outlook.com'));

    // Clear the form fields
    setEmail('');
    setMessage('');
    setName('');
    setMessageLength(0); 
    setIsLoading(false);

    toast.success('Received your message!', {
      className: 'bg-green-500 text-white font-semibold p-3 rounded-lg', // add your Tailwind CSS classes here
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    navigate("/waitlist");

  };




  return (
    <>
      <Helmet>
        <title>ReallyMail</title>
        <meta
          name="description"
          content="ReallyMail is a productivity email client that makes doing your emails effortless."
        />
      </Helmet>
      <div className="flex flex-col h-fit font-sans bg-gradient-to-b from-black to-slate-900 relative">
        <main className="container mx-auto px-4 flex-grow">

            <FlashingHeader />

            <div className="w-1/2 mx-auto">
              <h3 className="text-sm md:text-3xl font-base mb-6 text-gray-100 text-center">
                <span className="underline">Everything</span> you've wanted your email to do.
              </h3>
              <h3 className="text-xs md:text-md font-lighter mb-6 text-gray-50 text-center">
                powered by ChatGPT. <img className="w-4 ml-2 h-auto inline" src={ChatGPTImg} />
              </h3>
            </div>
            
            <div className="flex justify-center items-center mx-auto flex-col">
              {/* <div className="flex text-white text-lg items-center gap-4"><img className="w-6 h-auto" src={GmailLogo} /> + </div> */}
              <Link to="/waitlist" className="bg-emerald-600 hover:bg-cyan-600 text-white text-2xl font-semibold py-4 px-10 rounded-full mx-auto my-6 transition duration-200 ease-in-out transform hover:scale-105">
                Join Waitlist
              </Link>
            </div>
            <div className="flex justify-center mt-8 mx-3 mb-12">
              <div className="flex items-center space-x-2">
                <VerifiedIcon className="text-white" style={{ 'color': '#34d399' }} />
                <span className="text-white">No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2 ml-8">
                <VerifiedIcon className="text-white" style={{ 'color': '#34d399' }} />
                <span className="text-white">Start For Free</span>
              </div>
            </div>
        </main>
        <img src={MailboxImg} alt="ReallyMailbox" className="invisible lg:visible top-0 z-5 lg:-ml-10 left-0 w-80 h-80 -mt-40" />

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-emerald-600 to-cyan-400"></div>
      </div>

      <div className="flex flex-col  items-center h-fit font-sans bg-gradient-to-b from-cyan-400 to-15% to-gray-100 relative">

        <div className="bg-white flex md:flex-row flex-col shadow-lg rounded-2xl md:space-x-16 p-8 md:p-20 md:mx-auto mb-0 -mt-32 md:mt-0 mx-4 md:w-10/12 justify-between">

          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/Sg3Ywnhvz8Q" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>

          <div className="flex flex-col  md:w-1/2">
            <h1 className="text-left text-black md:mt-0 mt-8 tracking-wide text-5xl font-bold">Be Part of the Future</h1>
            <h4 className="text-gray-700 text-xl mt-4 mb-8">Discover the plethora of features only possible in an AI-first email client.</h4>
            <button onClick={()=>navigate("/waitlist")} className="mt-auto mr-auto text-xl rounded-3xl border-2 font-semibold hover:bg-cyan-500 hover:shadow-md hover:text-white hover:border-transparent transition duration-200 ease-in-out text-emerald-500 border-emerald-500 py-2 px-5">Join Waitlist</button>
          </div>
        </div>

        <div className="bg-white flex md:flex-row flex-col shadow-lg rounded-2xl md:space-x-16  p-8 md:p-20 md:mx-auto mb-0 mt-16 mx-4 md:w-10/12 justify-between">
          <div className="flex flex-col  md:w-1/2">
            <h1 className="text-left text-black md:mt-0 tracking-wide text-5xl font-bold">Gamified to the Max</h1>
            <h4 className="text-gray-700 text-xl mt-4 mb-8">Make doing your emails simple and exciting, while still having the control and power you need to go as fast as you want.</h4>
            <button onClick={()=>navigate("/waitlist")} className="mt-auto mr-auto text-xl rounded-3xl border-2 font-semibold hover:bg-cyan-500 hover:shadow-md hover:text-white hover:border-transparent transition duration-200 ease-in-out text-emerald-500 border-emerald-500 py-2 px-5">Join Waitlist</button>
          </div>
          <img src={LandingImg3} className="h-auto md:w-1/2 md:mb-0 mt-6" />
        </div>

        <div className="h-fit mb-20">
          <h2 className="text-center text-3xl text-black font-semibold mb-10 mt-20">Available for</h2>
          <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 md:space-x-10">
            <div className="bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out hover:shadow-inner font-semibold text-lg h-16 px-6 py-3 rounded-3xl w-full md:w-1/3 shadow-lg flex items-center">
              <IconButton>
                <img
                  src={GmailLogo}
                  className="h-6 w-auto"
                />
              </IconButton>
              <span className="ml-2">Gmail</span>
            </div>
            <div className="bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out hover:shadow-inner font-semibold text-lg h-16 px-6 py-3 rounded-3xl w-full md:w-1/3 shadow-lg flex items-center">
              <IconButton>
                <img
                  src={OutlookLogo}
                  className="h-6 w-auto"
                />
              </IconButton>
              <span className="ml-2 mr-4">Outlook</span>
            </div>
            <div className="bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out hover:shadow-inner font-semibold text-lg h-16 px-6 py-3 rounded-3xl w-full md:w-1/3 shadow-lg flex items-center">
              <IconButton>
                <img
                  src={ZohoLogo}
                  className="h-6 w-auto"
                />
              </IconButton>
              <span className="ml-2 mr-4">Zoho</span>
            </div>
          </div>
        </div>



        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent to-emerald-500"></div>

      </div>


    </>
  );
};

export default LandingPage;


// https://www.youtube.com/watch?v=Sg3Ywnhvz8Q