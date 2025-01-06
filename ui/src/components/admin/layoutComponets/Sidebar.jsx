import React from 'react';
import { FaHome, FaUserGraduate, FaUsers, FaBuilding, FaUtensils, FaMoneyBill, FaTools } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo1 from '../../../assets/hAsset 4.png';
import logo2 from '../../../assets/h-whiteAsset 2.png';

const links = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/students', label: 'Student Management', icon: <FaUserGraduate /> },
    { path: '/staffs', label: 'Staff Management', icon: <FaUsers /> },
    { path: '/properties', label: 'Property Management', icon: <FaBuilding /> },
    { path: '/mess', label: 'Mess Management', icon: <FaUtensils /> },
    { path: '/payments', label: 'Payments', icon: <FaMoneyBill /> },
    { path: '/maintanance', label: 'Maintenance', icon: <FaTools /> },
    { path: '/investment', label: 'Investment', icon: <FaMoneyBill /> },
];

const Sidebar = () => {
    return (
        <>

        <div className='flex'>

            <div
                className={`fixed h-full left-0 bg-side-bar text-white transform transition-transform z-40
                            w-16 md:w-60 lg:w-60`} // Always 16 on small screens, 60 on md and lg
            >
                {/* Logo and Name Section */}
                <div className="flex justify-center mt-1">
                    {/* Show logo2 on small screens, logo1 on md and larger screens */}
                    <img src={logo2} alt="Logo" className="w-26 h-16 block md:hidden" />
                    <img src={logo1} alt="Logo" className="w-26 h-16 hidden md:block" />
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
        </>
    );
};

export default Sidebar;
