import React from 'react';
import { FaHome, FaUserGraduate, FaUsers, FaBuilding, FaUtensils, FaMoneyBill, FaTools } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const links = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/students', label: 'Student Management', icon: <FaUserGraduate /> },
    { path: '/staffs', label: 'Staff Management', icon: <FaUsers /> },
    { path: '/properties', label: 'Property Management', icon: <FaBuilding /> },
    { path: '/mess', label: 'Mess Management', icon: <FaUtensils /> },
    { path: '/payments', label: 'Payments', icon: <FaMoneyBill /> },
    { path: '/maintanance', label: 'Maintanance', icon: <FaTools /> },
];

const Sidebar = () => {
    return (
        <div className='flex'>
            <div
                className={`fixed h-full left-0 bg-side-bar text-white transform transition-transform z-40 
                            w-16 md:w-60 lg:w-60`} // Always 16 on small screens, 60 on md and lg
            >
                {/* Logo and Name Section */}
                <div className="md:p-6 px-2 py-6 flex items-center justify-center ">
                    <img src="https://cdn-icons-png.freepik.com/256/12452/12452420.png?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid" alt="Logo" className="w-12 h-12" />
                    <h1 className="text-3xl font-semibold ml-3 hidden md:block">Heavens</h1> {/* Show only on md and larger screens */}
                </div>

                {/* Links Section */}
                <ul className="flex flex-col items-center sm:items-start space-y-4 mt-6">
                    {links.map((link) => (
                        <li key={link.path} className="w-full">
                            <NavLink
                                to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center text-sm w-full px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-white text-blue-600' : 'hover:bg-gray-700 hover:text-white'}`
                                }
                            >
                                <span className="mr-3 text-xl border-2 border-white rounded-full p-1 transition-colors">
                                    {link.icon}
                                </span>
                                <span className="hidden md:inline">{link.label}</span> {/* Show label only on md and larger screens */}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
