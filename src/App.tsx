import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation, Link } from "react-router-dom"
import Waitlist from './components/LandingPage/Waitlist';



function App() {
  const { pathname } = useLocation();


  return (
    <>
      <Routes>
        <Route path="/" element={<><Waitlist /></>} />
      </Routes>
    </>
  )
}

export default App
