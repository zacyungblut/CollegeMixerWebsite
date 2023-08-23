import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch } from 'react-redux';
import { signin, signup, verifyEmail } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import Verifying from '../assets/Verifying.svg';


function VerifyEmail() {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  function getQueryParam(paramName: any) {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(paramName);
  }

  async function verifyEmailLocal() {
    const email = getQueryParam('email');
    const token = getQueryParam('token');
    if (email!==null && token!==null) {
        const resp = await dispatch(verifyEmail(email, token));
        console.log('resp is ', resp);
        if (resp.valid===true) {
          navigate("/app");
        }
    }
  }

  useEffect(() => {
    console.log('test');
    verifyEmailLocal();

  }, [])
  


  
  return (
    <div className="bg-gray-50 min-h-screen font-sans leading-normal tracking-normal">
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-4">

                <Link to="/" className="text-center w-full max-w-md mx-auto"><a href="" className="pl-2 font-bold text-2xl tracking-tight text-black"><SpeedIcon className="mr-2 mb-1" fontSize="large" /></a></Link>
            </div>
        <div className="w-full max-w-lg mx-auto shadow-2xl rounded-xl p-4 px-8 mt-16">
            
            <div className="text-center mb-4">

                <div className="flex justify-center"><img src={Verifying} alt="Wave" className="w-40 h-auto m-4" /></div>

                <h1 className="text-4xl p-4 font-bold mb-8 mt-2 text-gray-800">Verifying...</h1>
                <div className="text-center mb-14"><CircularProgress style={{ 'color': '#000000' }} /></div> 
            </div>
            
        </div>
        </div>
    </div>
    )
}

export default VerifyEmail
