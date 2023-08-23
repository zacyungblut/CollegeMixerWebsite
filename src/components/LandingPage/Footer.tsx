import React from 'react';
import { Link } from 'react-router-dom';
import SpeedIcon from '@mui/icons-material/Speed';


const Footer: React.FC = () => {
    return (
        <footer className="bg-gradient-to-b from-emerald-500 to-emerald-600 text-white py-8 z-40">
            <div className="pl-4 container mx-auto">
                <div className="flex justify-between">
                    <div className="w-1/3">
                        <h3 className="font-bold mb-4">Company</h3>
                        <ul>
                            <li><Link to="/" className="text-gray-200 hover:text-white">Home</Link></li>
                            <li><Link to="/pricing" className="text-gray-200 hover:text-white">Pricing</Link></li>
                            <li><Link to="/about" className="text-gray-200 hover:text-white">About Us</Link></li>
                            <li><Link to="/privacy" className="text-gray-200 hover:text-white">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div className="w-1/3">
                        <h3 className="font-bold mb-4">Resources</h3>
                        <ul>
                            <li><Link to="/login" className="text-gray-200 hover:text-white">Login</Link></li>
                            <li><Link to="/signup" className="text-gray-200 hover:text-white">Signup</Link></li>
                            {/* <li><Link to="/features" className="text-gray-800 hover:text-gray-600">Features</Link></li> */}
                            <li><Link to="/contact" className="text-gray-200 hover:text-white">Contact Us</Link></li>
                            <li><Link to="/terms" className="text-gray-200 hover:text-white">Terms</Link></li>
                            <li><Link to="/disclosure" className="text-gray-200 hover:text-white">Disclosure</Link></li>
                        </ul>
                    </div>
                    <div className="w-1/3">
                        <h3 className="font-bold mb-4">Connect</h3>
                        <ul>
                        <li><a href="https://www.linkedin.com/company/90421983/" target="_blank" className="text-gray-200 hover:text-white">LinkedIn</a></li>
                            <li><a href="https://www.twitter.com/zacyungblut" target="_blank" className="text-gray-200 hover:text-white">Twitter</a></li>
                            <li><Link to="/blog" className="text-gray-200 hover:text-white">Blog</Link></li>
                            <li><a href="mailto:zac@speedlead.xyz" target="_blank" className="text-gray-200 hover:text-white">Email</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 text-sm">
                    <Link to="/"><a href="" className="font-bold text-gray-200 text-xl tracking-tight"><SpeedIcon className="mr-1 mb-1"/>ReallyMail</a></Link>
                    <div className="pb-2">
                        Copyright © {new Date().getFullYear()} Craigleith Software Ltd. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
