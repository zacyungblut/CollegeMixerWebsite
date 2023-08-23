import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { googleCallback } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const TriagePage = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');

  const query = useQuery();
  const code = query.get('code');

  async function tryConnectGoogle() {

    if (userToken && code) {
      const resp = await dispatch(googleCallback(userToken, code));
      if (resp.valid===true) {
        toast.success("Email connected!", 
        {
          position: "top-center",
        });
        navigate("/app");
      } else {
        if (resp.result==="This email is already registered") {
          alert(resp.result);
          navigate("/login");
          return;
        }
        return;
      }
    }
    if (userToken === '') {
      alert("You must log in, or your login has expired")
      navigate("/login");
      return;
    }
  }

  useEffect(() => {
    if (userToken!=='') {
      tryConnectGoogle();
    }

  }, [userToken])
  


  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <CircularProgress className="mr-4" style={{ 'color': '#000000' }} size={24} />
      <p className="text-black text-center text-2xl font-semibold">
        Connecting to your email provider
      </p>
    </div>
  );
};

export default TriagePage;
