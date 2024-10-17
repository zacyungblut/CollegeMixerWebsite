import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation, Link } from "react-router-dom"
import Waitlist from './components/Waitlist';
import Privacy from './components/Privacy';
import Support from './components/Support';
import InternalDashboard from './components/InternalDashboard';
import ReferFriend from './components/ReferFriend';
import Casting from './components/Casting';
import Omnidash from './components/Omnidash';
import styled from 'styled-components';

const FullHeightContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const { pathname } = useLocation();

  return (
    <FullHeightContainer>
      <Routes>
        <Route path="/" element={<Waitlist />} />
        <Route path="/dashboard" element={<Omnidash />} />
        <Route path="/policy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<InternalDashboard />} />
        <Route path="/casting" element={<Casting />} />
        <Route path="/refer-friend" element={<ReferFriend />} />
      </Routes>
    </FullHeightContainer>
  )
}

export default App
