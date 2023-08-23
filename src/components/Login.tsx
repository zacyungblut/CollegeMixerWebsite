import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { signin } from '../actions/auth';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { CircularProgress } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';


const initialState = { email: '', password: '' };


function Login() {
  const [form, setForm] = useState(initialState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');
  const isValidated = useAppSelector((state: any) => state.user.isValidated);
  const userTokenFromSlice = useAppSelector((state: any) => state.user.token);

  


  const handleChange = (e: any) => {setForm({ ...form, [e.target.name]: e.target.value })};


    const handleSubmit = (e: any) => {
        e.preventDefault();

        async function tryLogin() {
            setIsLoggingIn(true);
            const resp = await dispatch(signin(form));
            if (resp.valid===true) {
                navigate("/app")
            } else if (resp.result==="User is not verified") {
                navigate(`/verify-email?email=${form.email}`);
                return;
            }
             else {
                setIsLoggingIn(false);
                alert(resp.result);
                return;
            }
        }
        
        tryLogin();
    }

    useEffect(() => {
        if (isValidated || userTokenFromSlice || userToken!=='') {
            navigate("/app")
        } else {
            return;
        }

    }, [])
    



  return (
    <div className="bg-gray-50 min-h-screen font-sans leading-normal tracking-normal">
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-4">

                <Link to="/" className="text-center w-full max-w-md mx-auto"><a href="" className="pl-2 font-bold text-2xl tracking-tight text-black"><SpeedIcon className="mr-2 mb-1" fontSize="large" /></a></Link>
            </div>
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto shadow-2xl rounded-xl p-4 mt-16">
            
            <div className="text-center mb-4 mt-4">

                <h1 className="text-4xl font-bold mb-2 text-gray-800">Login</h1>
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
            {isLoggingIn ? <div className="text-center"><CircularProgress style={{ 'color': '#000000' }} /></div> : <button className="hover:bg-emerald-600 bg-emerald-500 shadow-xl hover:shadow-2xl transition duration-150 shadow-emerald-200 text-white font-bold py-2 px-4 rounded-full w-full" type="submit">
                Login
            </button>}
            {/* <div className="mb-24 text-center mt-8">Don't have an account? <span className="font-bold hover:text-orange-600 underline"><Link to="/signup">Sign Up</Link></span></div> */}
        </form>
        </div>
    </div>
    )
}

export default Login
