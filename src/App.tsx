import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation, Link } from "react-router-dom"
import Waitlist from './components/LandingPage/Waitlist';
import Privacy from './components/LandingPage/Privacy';




function App() {
  const { pathname } = useLocation();


  return (
    <>
      <Routes>
        <Route path="/" element={<><Waitlist /></>} />
        <Route path="/policy" element={<><Privacy /></>} />
      </Routes>
    </>
  )
}

export default App
