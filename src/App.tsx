import { useState, useEffect } from 'react'
import './App.css'
import { Route, Routes, useLocation, Link } from "react-router-dom"
import Waitlist from './components/Waitlist';
import Privacy from './components/Privacy';
import Support from './components/Support';
import Dashboard from './components/InternalDashboard';




function App() {
  const { pathname } = useLocation();


  return (
    <>
      <Routes>
        <Route path="/" element={<><Waitlist /></>} />
        <Route path="/policy" element={<><Privacy /></>} />
        <Route path="/support" element={<><Privacy /></>} />
        <Route path="/admin" element={<><Dashboard /></>} />
      </Routes>
    </>
  )
}

export default App
