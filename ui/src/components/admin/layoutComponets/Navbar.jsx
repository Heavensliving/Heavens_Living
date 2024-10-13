import React from 'react';
import { FaBell, FaCog, FaSearch } from 'react-icons/fa';
import pageConfig from '../../../Utils/NavbarUtils';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const currentPage = pageConfig[location.pathname];
    const isHomePage = location.pathname === '/';

    return (
        <nav className="bg-gray-100 p-4">
            <div className="container px-4 py-3 flex justify-between items-center">
                {/* Left Heading */}
                <h1 className="text-3xl font-semibold text-gray-700">{currentPage.title}</h1>

                {/* Right Icons and Profile Section */}
                <div className="flex items-center space-x-2">
                    {/* Center Search Input */}
                    {isHomePage && (
                        <div className="relative hidden md:flex flex-grow mx-4"> {/* Hidden on small screens */}
                            <input
                                type="text"
                                placeholder="Search..."
                                className="px-4 py-2 pl-10 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FaSearch className="h-5 w-5" />
                            </span>
                        </div>
                    )}
                    <button className="relative p-2 bg-white rounded-full shadow">
                        <FaBell className="h-6 w-6 text-gray-400" />
                        {/* Notification Badge */}
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                    </button>
                    <button className="p-2 bg-white rounded-full shadow">
                        <FaCog className="h-6 w-6 text-gray-400" />
                    </button>

                    <div className="flex items-end">
                        <div className="flex flex-col items-end ml-2 hidden lg:flex"> {/* Hidden on small screens */}
                            <span className="text-gray-700">John Doe</span>
                            <span className="text-gray-500 text-sm">Admin</span>
                        </div>
                        <div className="ml-2 h-10 w-10 rounded-full overflow-hidden">
                            {/* Profile Image */}
                            <img src="https://cdn-icons-png.freepik.com/256/9449/9449192.png?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
