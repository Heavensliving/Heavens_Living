// import React, { useEffect, useState } from 'react';
// import { FaBuilding, FaCalendar, FaUserGraduate, FaUserTie } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const StatsSection = () => {
//   const admin = useSelector(store => store.auth.admin);
//   const [loading, setLoading] = useState(true);
//   const [totalStudents, setTotalStudents] = useState();
//   const [totalStaffs, setTotalStaffs] = useState(); 
//   const [totalDailyRent, setTotalDailyRent] = useState(); 
//   const [totalProperties, setTotalProperties] = useState(); 

//   useEffect(() => {
//     if (!admin) return;
//     const fetchTotalStudents = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/students`,
//           { headers: { 'Authorization': `Bearer ${admin.token}` } }
//         ); 
//         const nonVacatedStudents = response.data.filter(student => student.vacate == false);
//         setTotalStudents(nonVacatedStudents.length); 
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching total students:', error);
//         setLoading(false)
//       }
//     };

//     fetchTotalStudents();
//   }, []);

//   useEffect(() => {
//     if (!admin) return;
//     const fetchTotalStaffs = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/staff`,
//           { headers: { 'Authorization': `Bearer ${admin.token}` } }
//         ); 
//         setTotalStaffs(response.data.length); 
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching total staff:', error);
//         setLoading(false)
//       }
//     };

//     fetchTotalStaffs();
//   }, []);

//   useEffect(() => {
//     if (!admin) return;
//     const fetchTotalDailyRent = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/dailyRent`,
//           { headers: { 'Authorization': `Bearer ${admin.token}` } }
//         ); 
//         const activeDailyRents = response.data.filter(rent => rent.vacate === false);
//         setTotalDailyRent(activeDailyRents.length); 
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching total staff:', error);
//         setLoading(false)
//       }
//     };

//     fetchTotalDailyRent();
//   }, []);

//   useEffect(() => {
//     if (!admin) return;
//     const fetchTotalProperties = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/property`,
//           { headers: { 'Authorization': `Bearer ${admin.token}` } }
//         ); 
//         setTotalProperties(response.data.length); 
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching total properties:', error);
//         setLoading(false)
//       }
//     };

//     fetchTotalProperties();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 sm:p-6 rounded-lg mb-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//         <Link to={'/students'}>
//           <div className="flex items-center p-4 rounded-lg bg-blue-100">
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 mr-4">
//               <FaUserGraduate className="text-white text-3xl" />
//             </div>
//             <div className="flex flex-col justify-center">
//               <h2 className="text-md sm:text-lg font-semibold">Total Students</h2>
//               <p className="text-xl sm:text-2xl font-bold">{totalStudents}</p>
//             </div>
//           </div>
//         </Link>

//         <Link to={'/staffs'}>
//           <div className="flex items-center p-4 rounded-lg bg-green-100">
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mr-4">
//               <FaUserTie className="text-white text-3xl" />
//             </div>
//             <div className="flex flex-col justify-center">
//               <h2 className="text-md sm:text-lg font-semibold">Total Staffs</h2>
//               <p className="text-xl sm:text-2xl font-bold">{totalStaffs}</p>
//             </div>
//           </div>
//         </Link>

//         <Link to={'/properties'}>
//           <div className="flex items-center p-4 rounded-lg bg-red-100">
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 mr-4">
//               <FaBuilding className="text-white text-3xl" />
//             </div>
//             <div className="flex flex-col justify-center">
//               <h2 className="text-md sm:text-lg font-semibold">Total Properties</h2>
//               <p className="text-xl sm:text-2xl font-bold">{totalProperties}</p>
//             </div>
//           </div>
//         </Link>
        
//         <Link to={'/dailyRent'}>
//           <div className="flex items-center p-4 rounded-lg bg-blue-100">
//             <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 mr-4">
//               <FaCalendar className="text-white text-3xl" />
//             </div>
//             <div className="flex flex-col justify-center">
//               <h2 className="text-md sm:text-lg font-semibold">Total Daily Renters</h2>
//               <p className="text-xl sm:text-2xl font-bold">{totalDailyRent}</p>
//             </div>
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default StatsSection;


import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCalendar, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatsSection = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState();
  const [totalStaffs, setTotalStaffs] = useState();
  const [totalDailyRent, setTotalDailyRent] = useState();
  const [totalProperties, setTotalProperties] = useState();

  useEffect(() => {
    if (!admin) return;
    const fetchData = async () => {
      try {
        const [studentsRes, staffsRes, dailyRentRes, propertiesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/students`, { headers: { Authorization: `Bearer ${admin.token}` } }),
          axios.get(`${API_BASE_URL}/staff`, { headers: { Authorization: `Bearer ${admin.token}` } }),
          axios.get(`${API_BASE_URL}/dailyRent`, { headers: { Authorization: `Bearer ${admin.token}` } }),
          axios.get(`${API_BASE_URL}/property`, { headers: { Authorization: `Bearer ${admin.token}` } }),
        ]);

        setTotalStudents(studentsRes.data.filter((student) => student.vacate === false).length);
        setTotalStaffs(staffsRes.data.length);
        setTotalDailyRent(dailyRentRes.data.filter((rent) => rent.vacate === false).length);
        setTotalProperties(propertiesRes.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [admin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-2">
    {/* Responsive grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Link
        to={'/students'}
        className="flex items-center bg-white border-l-4 border-green-500 rounded-lg shadow-md p-4 w-full max-w-full box-border"
      >
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full text-green-500 text-3xl">
          <FaUserGraduate />
        </div>
        <div className="ml-auto mr-4 text-right flex flex-col items-end">
          <h2 className="text-lg">Residents</h2>
          <p className="text-2xl mx-auto font-bold">{totalStudents}</p>
        </div>
      </Link>
  
      <Link
        to={'/staffs'}
        className="flex items-center bg-white border-l-4 border-blue-500 rounded-lg shadow-md p-4 w-full max-w-full box-border"
      >
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full text-blue-500 text-3xl">
          <FaUserTie />
        </div>
        <div className="ml-auto mr-4 text-right flex flex-col items-end">
          <h2 className="text-lg">Total Staffs</h2>
          <p className="text-2xl mx-auto font-bold">{totalStaffs}</p>
        </div>
      </Link>
  
      <Link
        to={'/properties'}
        className="flex items-center bg-white border-l-4 border-red-500 rounded-lg shadow-md p-4 w-full max-w-full box-border"
      >
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full text-red-500 text-3xl">
          <FaBuilding />
        </div>
        <div className="ml-auto mr-4 text-right flex flex-col items-end">
          <h2 className="text-lg">Properties</h2>
          <p className="text-2xl mx-auto font-bold">{totalProperties}</p>
        </div>
      </Link>
  
      <Link
        to={'/dailyRent'}
        className="flex items-center bg-white border-l-4 border-yellow-500 rounded-lg shadow-md p-4 w-full max-w-full box-border"
      >
        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-full text-yellow-500 text-3xl">
          <FaCalendar />
        </div>
        <div className="ml-auto mr-4 text-right flex flex-col items-end">
          <h2 className="text-lg">Daily Renters</h2>
          <p className="text-2xl mx-auto font-bold">{totalDailyRent}</p>
        </div>
      </Link>
    </div>
  </div>
   
  );
};  

export default StatsSection;
