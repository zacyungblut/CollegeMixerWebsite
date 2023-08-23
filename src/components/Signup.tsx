import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch } from 'react-redux';
import { signin, signup, verify } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';


const initialState = { email: '', password: '' };


function Signup() {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');

  


  const handleChange = (e: any) => {setForm({ ...form, [e.target.name]: e.target.value })};

  function isValidEmail(email: string) {
    const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return regex.test(email);
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
  
    async function trySignup() {
      if (isValidEmail(form.email)===false) {
          alert('Please enter a valid email');
          return;
      }
      setIsLoggingIn(true);
      try {
        const resp = await dispatch(signup(form));
  
        if (resp.valid===true) {
            navigate(`/verify-email?email=${form.email}`);
        } else  {
            alert('An account already exists with this email');
            setIsLoggingIn(false);
            return;
        }
      } finally {
        setIsLoggingIn(false);
      }
    }

    trySignup();

  };

  useEffect(()=> {
    // navigate("/waitlist");
  }, [])
  
  useEffect(() => {
    // navigate("/waitlist");
    // return;

    if (userToken!=='') {
        navigate("/app")
    } else {
        return;
    }
  }, [userToken])
  


  return (
    <div className="bg-gray-50 min-h-screen font-sans leading-normal tracking-normal">
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-4">

                <Link to="/" className="text-center w-full max-w-md mx-auto"><a href="" className="pl-2 font-bold text-2xl tracking-tight text-black"><SpeedIcon className="mr-2 mb-1" fontSize="large" /></a></Link>
            </div>
        <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto shadow-2xl rounded-xl p-4 px-8 mt-16">
            
            <div className="text-center mb-4">

                <h1 className="text-4xl p-4 font-bold mb-2 text-gray-800">Create Your Account</h1>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Email
                    </label>
                    <input
                        className="autofocus appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-password"
                        type="text"
                        name="email"
                        placeholder="zac@company.com"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Password
                    </label>
                    <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-password"
                        type="password"
                        name="password"
                        placeholder="********"
                        onChange={handleChange}
                    />
                </div>
            </div>
            {isLoggingIn ? <div className="text-center"><CircularProgress style={{ 'color': '#000000' }} /></div> : <button className="hover:bg-emerald-600 bg-emerald-500 shadow-xl hover:shadow-emerald-300 hover:shadow-2xl transition duration-150 shadow-emerald-200 text-white font-bold py-2 px-4 rounded-full w-full" type="submit">
                Create
            </button>}
            <div className="mb-24 text-center mt-8">Already have an account? <span className="font-bold hover:text-orange-600 underline"><Link to="/login">Login</Link></span></div>
        </form>
        </div>
    </div>
    )
}

export default Signup
