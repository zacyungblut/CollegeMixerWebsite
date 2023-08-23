import React, { useState } from 'react';
import GmailLogo from "../assets/Google.png";
import { CircularProgress } from '@mui/material';
import { useAppDispatch } from '../hooks/hooks';
import { sendInboundEmail } from '../actions/autoInbound';

const Popup = () => {


  return (
    <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 text-center mx-auto transition-transform duration-300`}>
        <button
          className="bg-gray-700 text-center text-white px-4 py-2 rounded shadow font-semibold focus:outline-none"
        >
          <CircularProgress className="mr-2 -mb-0.5" style={{ color: '#ffffff' }} size={16} />
          Loading
        </button>
    </div>
  );
}

export default Popup;
