import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParkIcon from '@mui/icons-material/Park';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpeedIcon from '@mui/icons-material/Speed';
import Person2Icon from '@mui/icons-material/Person2';
import { Switch } from '@mui/material';
import RocketIcon from '@mui/icons-material/Rocket';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../slices/userSlice';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';



const NavBar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('profile') || '{}');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // useEffect(() => {
    //     setIsDropdownOpen(false);
    //     setUser(JSON.parse(localStorage.getItem('profile') || '{}'));
    //   }, [localStorage.getItem('profile')]);

    return (
        <nav className="bg-white h-16 shadow-sm sticky top-0 z-50">
            <div className="px-4 mx-auto h-full">
                <div className="flex justify-between mx-auto items-center h-full">
                    <div className="mr-6">
                        <Link to="/"><div className="pl-2 font-bold text-2xl tracking-tight text-black"><SpeedIcon className="mr-2 mb-1" fontSize="large" />Winder</div></Link>
                    </div>
                    
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center">

                    </div>


                    <div className="flex-1 text-right">
                        <div className="flex justify-end">
                            <Link to="/upgrade"><button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emeralde-600 hover:to-emerald-700 box-shadow hover:shadow-lg text-white font-semibold px-3 py-1.5  rounded shadow-md mr-8 transition duration-300">
                                <RocketIcon className="mr-1 -mt-0.5" />
                                Upgrade
                            </button></Link>
                            <div className="relative">
                                <AccountCircleIcon style={{'fontSize': '36px'}} className="cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />
                                {isDropdownOpen && (
                                    <div className="absolute right-0 py-2 bg-gray-50 rounded-md shadow-md origin-top-right" ref={dropdownRef}>
                                        <Link to="/app?page=settings"><div className="cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100">
                                                Settings
                                            </div></Link>
                                        <Link to="/"><div className="cursor-pointer block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100" onClick={() => { localStorage.removeItem('profile'); dispatch(resetAuth());}}>
                                                Logout
                                            </div></Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
