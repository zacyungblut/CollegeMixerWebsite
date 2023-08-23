import React, { useState, useEffect } from 'react';
import Racecar from "../assets/Racecar.png";
import Rocket from "../assets/Rocket.png";
import { CircularProgress } from '@mui/material';
import { useAppDispatch } from '../hooks/hooks';
import { sendInboundEmail } from '../actions/autoInbound';
import SpeedIcon from '@mui/icons-material/Speed';
import { Link } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Divider from "@mui/material/Divider";

const Popup = (completedStep: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('dweebnationofficial@gmail.com');
  const [name, setName] = useState('GoogleTester');
  const [message, setMessage] = useState('Hi there, what services do you have available? System: This email was sent from oauth222@gmail.com');
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [openStep, setOpenStep] = useState({1: true, 2: false, 3: false});
  // const [completedStep, setCompletedStep] = useState({1: true, 2: false, 3: false});

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleTextareaChange = (e: any) => {
    const textareaLength = e.target.value.length;
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    if (name === '' || email === '' || message === '') {
      alert("Please complete all fields");
      setIsLoading(false);
      return;
    }

    await dispatch(sendInboundEmail(name, 'zacyungblut@outlook.com', message, email));

    setIsLoading(false);
    setIsOpen(false);
  };

  const changeStep = (num: 1 | 2 | 3) => {

    setOpenStep({1: false, 2: false, 3: false, [num]: !openStep[num]});

  }

  useEffect(() => {

    if (completedStep.completedStep[1]===false) {
      setIsOpen(true);
    } else if (completedStep.completedStep[2]===false) {
      setIsOpen(true);
      setOpenStep({1: false, 2: true, 3: false});
    } else if (completedStep.completedStep[3]===false) {
      setIsOpen(true);
      setOpenStep({1: false, 2: false, 3: true});
    }

  }, [])
  

  return (
    <div className={`fixed bottom-14 right-4 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-y-10' : 'translate-y-full'}`}>
      {!isOpen && (
        <button
          onClick={togglePopup}
          className={`bg-white text-black px-4 py-2 rounded hover:bg-gray-100 font-semibold focus:outline-none shadow shadow-red-600 border-sunset border-[1px] `}
        >
          <img
            src={Racecar}
            className="w-6 -mt-3 h-auto inline mr-4 justify-center items-center"
          ></img>
          {isOpen ? 'Close' : 'Onboarding'}
        </button>
      )}
      {isOpen && (
        <div className="bg-white mt-2 p-6 rounded w-96 relative shadow shadow-red-600 border-sunset border-[1px]">
          <button
            onClick={togglePopup}
            className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-600 focus:outline-none py-0.5 px-2 rounded-full bg-gray-50 hover:bg-gray-100 "
          >
            &times;
          </button>
          <div className="flex"><SpeedIcon className="mr-2 -mt-0.5" fontSize="large" /><h2 className="text-2xl mb-2 mx-2 font-semibold">Onboarding</h2></div>
          <h3 className="text-sm text-gray-700">Get started skyrocketing your productivity! <img className="inline ml-1 -mt-0.5 h-5 w-auto" src={Rocket} /></h3>
          <ol className="list-decimal list-inside mt-2 text-sm text-gray-600 mb-4">
            <div className="underline cursor-pointer flex justify-between font-semibold text-xl py-2 text-gray-800 hover:text-gray-600" onClick={() => changeStep(1)}>
              <div>Connect an email account</div><div className="flex"> <div className={`transform transition-transform duration-150 ${openStep[1]===true ? "rotate-90 mr-0.5" : "rotate-0"}`}><ChevronRightIcon className={`-mt-0.5`} fontSize="large" /></div>
              {completedStep.completedStep[1]===false ? <CheckBoxOutlineBlankIcon fontSize="large" /> : <CheckBoxIcon fontSize="large" style={{ color: '#ef4444' }} />}</div>
            </div>
            { openStep[1]===false ? null : <>
            <h3 className="text-sm text-gray-700 pr-20">Start by connecting  Gmail, Outlook, or Zoho email account.</h3>
            <Link to="/app/connect"><div className="cursor-pointer bg-red-500 rounded-2xl shadow-md hover:shadow-lg p-2 text-center mx-10 my-5 text-white font-bold text-lg hover:bg-red-600 transition duration-200">Connect</div></Link>
            </>}
            {/* <div className="py-2 underline cursor-pointer flex justify-between font-semibold text-xl text-gray-800 hover:text-gray-600" onClick={() => changeStep(2)}>
              <div>2. Create an auto-inbound</div><div className="flex"> <div className={`transform transition-transform duration-150 ${openStep[2]===true ? "rotate-90 mr-0.5" : "rotate-0"}`}><ChevronRightIcon className={`-mt-0.5`} fontSize="large" /></div>
              {completedStep.completedStep[2]===false ? <CheckBoxOutlineBlankIcon fontSize="large" /> : <CheckBoxIcon fontSize="large" style={{ color: '#ef4444' }} />}</div>
            </div> */}
            { openStep[2]===false ? null : <>
            <h3 className="text-sm text-gray-700 pr-20">Create and configure your first auto-response campaign using the email you connected in the previous step.</h3>
            <Link to="/app/campaign/create"><div className="cursor-pointer shadow-md hover:shadow-lg bg-red-500 rounded-2xl p-2 text-center mx-10 my-5 text-white font-bold text-lg hover:bg-red-600 transition duration-200">Create</div></Link>
            </>}            
            {/* <div className="underline cursor-pointer flex justify-between font-semibold text-xl py-2 text-gray-800 hover:text-gray-600" onClick={() => changeStep(3)}>
              <div>3. Get your first response</div><div className="flex"> <div className={`transform transition-transform duration-150 ${openStep[3]===true ? "rotate-90 mr-0.5" : "rotate-0"}`}><ChevronRightIcon className={`-mt-0.5`} fontSize="large" /></div>
              {completedStep.completedStep[3]===false ? <CheckBoxOutlineBlankIcon fontSize="large" /> : <CheckBoxIcon fontSize="large" style={{ color: '#ef4444' }} />}</div>
            </div> */}
            { openStep[3]===false ? null : <> 
            {/* <h3 className="text-sm text-gray-700 pr-20">Test out your campaign by sending your first email, and checking out the response!</h3> */}
            {/* <Link to="/app/connect"><div className="cursor-pointer bg-red-500 rounded-2xl p-2 text-center mx-10 my-5 text-white font-bold text-lg hover:bg-red-600 transition duration-200">Connect</div></Link> */}
            </>}
          </ol>
          <Divider className="" />
          <div className="text-center mt-4 font-medium text-gray-600">Got questions? We've got answers.</div>
          <Link className="" to="/contact"><div className="p-2 mt-4 font-medium mb-1 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-150 text-center text">Reach Out</div></Link>
        </div>
        )}
    </div>
    );
}

export default Popup;
