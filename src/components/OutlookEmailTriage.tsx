import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { outlookCallback } from '../actions/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const TriagePage = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  const query = useQuery();
  const code = query.get('code');
  const [userToken, setUserToken] = useState(localStorage.getItem('profile') || '');

  async function tryConnectOutlook() {

    if (userToken && code) {
      const resp = await dispatch(outlookCallback(userToken, code));
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
      alert("You must be log in, or your login has expired")
      navigate("/login");
      return;
    }
  }

  useEffect(() => {
    if (userToken!=='') {
      tryConnectOutlook();
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
