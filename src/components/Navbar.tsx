import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParkIcon from '@mui/icons-material/Park';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SpeedIcon from '@mui/icons-material/Speed';
import Person2Icon from '@mui/icons-material/Person2';
import { Switch } from '@mui/material';

const NavBar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(localStorage.getItem('profile') || '{}');
    const dropdownRef = useRef<HTMLDivElement>(null);


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
        <nav className="bg-black h-20 shadow-md sticky top-0 z-40">
            <div className="container mx-auto h-full">
                <div className="flex items-center h-full">
                    <div className="mr-6">
                        <Link to="/"><a href="" className="pl-2 font-bold text-2xl tracking-tight text-white"><SpeedIcon className="mr-2 mb-1" fontSize="large" />ReallyMail</a></Link>
                    </div>
                    
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 flex justify-center">
                        <Link to="/pricing" className="mx-2 text-white font-bold hover:text-gray-300">Pricing</Link>
                        {/* <Link to="/reviews" className="mx-2 text-white font-bold hover:text-gray-300">Reviews</Link> */}
                        <Link to="/about" className="mx-2 text-white font-bold hover:text-gray-300">About</Link>
                        <Link to="/contact" className="mx-2 text-white font-bold hover:text-gray-300">Contact</Link>
                        <Link to="/blog" className="mx-2 text-white font-bold hover:text-gray-300">Blog</Link>
                    </div>


                    <div className="flex-1 text-right">
                        <Link to="/login">
                            <button className="mr-2 transition ease-in-out delay-10 duration-150 hover:text-gray-100 hover:underline text-white font-semibold hover:black-white py-2 px-4 rounded-full">
                                Login
                            </button>
                        </Link>
                        <Link to="/waitlist">
                            <button className="mr-2 transition bg-gray-500 ease-in-out delay-10 duration-150 hover:bg-cyan-500 text-white font-semibold hover:black-white py-2 px-4 rounded-full">
                                Join Waitlist
                            </button>
                        </Link>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
