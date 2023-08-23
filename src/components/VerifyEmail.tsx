import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch } from 'react-redux';
import { signin, signup, resendVerification } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifyImage from '../assets/VerifyImage.svg';


function VerifyEmail() {

  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  function getQueryParam(paramName: any) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(paramName);
  }

  async function resendVerificationLocal() {
    setLoading(true);
    const email = getQueryParam('email');
    await dispatch(resendVerification(email));
    setLoading(false);
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans leading-normal tracking-normal">
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-4">
                <Link to="/" className="text-center w-full max-w-md mx-auto"><a href="" className="pl-2 font-bold text-2xl tracking-tight text-black"><SpeedIcon className="mr-2 mb-1" fontSize="large" /></a></Link>
            </div>
        <div className="w-full max-w-lg mx-auto shadow-2xl rounded-xl p-4 px-8 mt-16">
            <div className="text-center mb-4">
                <div className="flex justify-center"><img src={VerifyImage} alt="Wave" className="w-20 h-auto m-4" /></div>
                <h1 className="text-4xl p-4 font-bold mb-2 text-gray-800">Verify your email</h1>
            </div>
            <div className=" mt-2">We sent a verification email with a link to your inbox.</div>
            <div className="mt-6">Make sure to check your <a className="font-bold">spam folder</a> if it doesn't appear in your inbox.</div>
            {loading ? <div className="justify-center items-center flex mx-auto my-auto pt-6"><CircularProgress className="justify-center mx-auto items-center" style={{ 'color': '#000000' }} size={32} /></div> : <div className="cursor-pointer text-center mt-8 mb-16 font-bold hover:text-rose-700 underline"><a onClick={resendVerificationLocal}>Resend Verification</a></div>}
        </div>
        </div>
    </div>
    )
}

export default VerifyEmail
