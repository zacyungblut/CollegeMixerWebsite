import React, { useState } from 'react';
import powerImg from '../../assets/power.jpg';
import { Link, useNavigate } from 'react-router-dom';
import fingerImg from '../../assets/finger.png';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';
import { sendInboundEmail } from '../../actions/autoInbound';
import { CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


const Contact = () => {

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
      alert("Please write enough until the progress bar is full to make sure we have enough information");
      setIsLoading(false);
      return;
    }

    // Post the values to backend
    console.log({ name, email, message });

    await dispatch(sendInboundEmail(name, email, message, 'zacyungblut@outlook.com'));

    // Clear the form fields
    setName('');
    setEmail('');
    setMessage('');
    setMessageLength(0);
    setIsLoading(false);
    showSnackbar();

    navigate("/waitlist")

  };

  function showSnackbar() {
    setTimeout(()=>setSuccessSnackbarOpen(true), 100);
    setTimeout(()=>setSuccessSnackbarOpen(false), 5000);
  }


  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-b from-black via-slate-950 via-90% to-slate-900 to-95% relative">
      {
        <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 text-center mx-auto transition-transform duration-300 ${successSnackbarOpen ? 'translate-y-5 shadow-lg' : '-translate-y-11'}`}>
          <div
            className="bg-green-500 hover:bg-blue-400 text-center cursor-default text-white px-4 py-2 rounded font-semibold focus:outline-none"
          >
            <CheckCircleIcon className="mr-2" style={{ color: '#ffffff' }} /> Received your message
          </div>
        </div>
      }
      <div className="flex flex-row items-center justify-between md:mx-10 lg:mx-20 pt-20 pb-8">
        <div className="w-full text-center">
            <h1 className="text-white text-4xl mb-4 md:text-7xl font-semibold">
                Experience <span className="py-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Magic</span>
            </h1>
            <h3 className="text-gray-100 text-lg lg:px-64 md:text-2xl mt-6 ml-2">We use SpeedLead ourselves to help create exceptional client experiences. Find out how we can do the same for your business.</h3>
        </div>

      </div>

      <form className="w-full max-w-lg mx-auto p-4" onSubmit={handleSubmit}>
        <div className="flex flex-wrap mb-4">
          <div className="w-1/2 px-2 mt-4">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="name">
              First Name
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="name" type="text" placeholder="John" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="w-1/2 px-2 mt-4">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap mb-6">
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-white text-xs font-bold mb-2" htmlFor="message">
              Message
            </label>
            <textarea className="appearance-none block w-full bg-white text-gray-700 border border-gray-200 rounded-lg py-3 px-4 mb-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 h-32 resize-none" onChange={handleTextareaChange} id="message" placeholder="Please enter your message here" value={message}></textarea>
            <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden mt-1">
              <div className="h-full rounded-full transition-all duration-150" style={{ width: `${messageLength * 100 / 65}%`, backgroundColor: `rgb(${255 - messageLength * 255 / 65}, ${messageLength * 255 / 65}, 0)` }}></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          {!isLoading ? (
            <button
              className="bg-white mx-auto hover:bg-cyan-600 hover:text-white text-black font-bold mb-3 py-2 px-4 transition duration-200 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Get a Response
            </button>
          ) : (
            <CircularProgress
              className="mx-auto"
              size={28}
              style={{ color: '#ffffff' }}
            />
          )}
        </div>
      </form>

      
    </div>
  );
};

export default Contact;
