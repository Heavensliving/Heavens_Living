// import React, { useState, useEffect, useRef } from 'react';
// import { FaBell, FaCog, FaSearch } from 'react-icons/fa';
// import pageConfig from '../../../Utils/NavbarUtils';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { adminLogout } from '../../../store/AuthSlice';
// import API_BASE_URL from '../../../config';
// import axios from 'axios';

// const Navbar = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const dispatch = useDispatch();
//     const admin = useSelector(store => store.auth.admin);

//     const [showDropdown, setShowDropdown] = useState(false); // State for dropdown
//     const dropdownRef = useRef(null); // Ref for dropdown container

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setShowDropdown(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const getPageTitle = (path) => {
//         const matchedPath = Object.keys(pageConfig).find((key) => {
//             const regex = new RegExp(`^${key.replace(/:\w+/g, '\\w+')}$`);
//             return regex.test(path);
//         });
//         return matchedPath ? pageConfig[matchedPath].title : 'Page Not Found';
//     };

//     const handleLogout = () => {
//         if (admin) {
//             axios.post(`${API_BASE_URL}/admin/logout`, {
//               headers: { 'Authorization': `Bearer ${admin.token}` }
//             });
//             dispatch(adminLogout());
//             navigate('/login');
//           }
//     };

//     const currentPage = getPageTitle(location.pathname);
//     const isHomePage = location.pathname === '/';

//     return (
//         <nav className="bg-gray-100 p-4">
//             <div className="container px-4 py-3 flex justify-between items-center">
//                 <h1 className="text-3xl font-semibold text-gray-700">{currentPage}</h1>

//                 <div className="flex items-center space-x-2">
//                     {isHomePage && (
//                         <div className="relative hidden md:flex flex-grow mx-4">
//                             <input
//                                 type="text"
//                                 placeholder="Search..."
//                                 className="px-4 py-2 pl-10 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
//                                 <FaSearch className="h-5 w-5" />
//                             </span>
//                         </div>
//                     )}
//                     <button className="relative p-2 bg-white rounded-full shadow">
//                         <FaBell className="h-6 w-6 text-gray-400" />
//                         <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
//                     </button>

//                     {/* Settings Button with Dropdown */}
//                     <div className="relative" ref={dropdownRef}>
//                         <button
//                             onClick={() => setShowDropdown(!showDropdown)}
//                             className="p-2 bg-white rounded-full shadow"
//                         >
//                             <FaCog className="h-6 w-6 text-gray-400" />
//                         </button>

//                         {showDropdown && (
//                             <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                                 <button
//                                     onClick={handleLogout}
//                                     className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
//                                 >
//                                     Logout
//                                 </button>
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex items-end">
//                         <div className="flex flex-col items-end ml-2 hidden lg:flex">
//                             <span className="text-gray-700">{admin?.adminName}</span>
//                             <span className="text-gray-500 text-sm">Admin</span>
//                         </div>
//                         <div className="ml-2 h-10 w-10 rounded-full overflow-hidden">
//                             <img src="https://cdn-icons-png.freepik.com/256/9449/9449192.png?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid" alt="Profile" className="h-full w-full object-cover" />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCog, FaSearch, FaArrowLeft } from 'react-icons/fa';  // Import back arrow
import pageConfig from '../../../Utils/navbarUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogout } from '../../../store/AuthSlice';
import API_BASE_URL from '../../../config';
import axios from 'axios';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const admin = useSelector(store => store.auth.admin);

    const [showDropdown, setShowDropdown] = useState(false); // State for dropdown
    const dropdownRef = useRef(null); // Ref for dropdown container

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getPageTitle = (path) => {
        const matchedPath = Object.keys(pageConfig).find((key) => {
            const regex = new RegExp(`^${key.replace(/:\w+/g, '\\w+')}$`);
            return regex.test(path);
        });
        return matchedPath ? pageConfig[matchedPath].title : 'Page Not Found';
    };

    const handleLogout = () => {
        if (admin) {
            axios.post(`${API_BASE_URL}/admin/logout`, {
                headers: { 'Authorization': `Bearer ${admin.token}` }
            });
            dispatch(adminLogout());
            navigate('/login');
        }
    };

    const currentPage = getPageTitle(location.pathname);
    const isHomePage = location.pathname === '/';

    // List of pages where back button should not be shown
    const noBackArrowPages = [
        '/',
        '/students',
        '/staffs',
        '/properties',
        '/mess',
        '/payments',
        '/maintanance',
    ];

    const showBackArrow = !noBackArrowPages.includes(location.pathname);

    return (
        <nav className="bg-gray-100 p-4">
            <div className="container px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* Show back arrow if it's not one of the listed pages */}
                    {showBackArrow && (
                        <button
                            onClick={() => navigate(-1)}  // Navigate one step back
                            className="p-2 bg-white rounded-full shadow"
                        >
                            <FaArrowLeft className="h-6 w-6 text-gray-400" />
                        </button>
                    )}

                    <h1 className="text-3xl font-semibold text-gray-700">{currentPage}</h1>
                </div>

                <div className="flex items-center space-x-2">
                    {isHomePage && (
                        <div className="relative hidden md:flex flex-grow mx-4">
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
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                    </button>

                    {/* Settings Button with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="p-2 bg-white rounded-full shadow"
                        >
                            <FaCog className="h-6 w-6 text-gray-400" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-end">
                        <div className="flex flex-col items-end ml-2 hidden lg:flex">
                            <span className="text-gray-700">{admin?.adminName}</span>
                            <span className="text-gray-500 text-sm">Admin</span>
                        </div>
                        <div className="ml-2 h-10 w-10 rounded-full overflow-hidden">
                            <img src="https://cdn-icons-png.freepik.com/256/9449/9449192.png?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid" alt="Profile" className="h-full w-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
