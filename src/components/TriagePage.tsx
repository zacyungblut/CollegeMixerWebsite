import React from 'react';
import { CircularProgress } from '@mui/material';

const TriagePage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <CircularProgress className="mr-4" style={{ 'color': '#000000' }} size={24} />
      <p className="text-black text-center text-2xl font-semibold">
        Loading your experience
      </p>
    </div>
  );
};

export default TriagePage;
