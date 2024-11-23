import React, { useEffect, useState } from 'react';
import { FaBuilding, FaCalendar, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

const StatsSection = () => {
  const admin = useSelector(store => store.auth.admin);
  const [totalStudents, setTotalStudents] = useState();
  const [totalStaffs, setTotalStaffs] = useState(); 
  const [totalDailyRent, setTotalDailyRent] = useState(); 
  const [totalProperties, setTotalProperties] = useState(); 

  useEffect(() => {
    if (!admin) return;
    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/students`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        ); 
        const nonVacatedStudents = response.data.filter(student => student.vacate == false);
        setTotalStudents(nonVacatedStudents.length); 
      } catch (error) {
        console.error('Error fetching total students:', error);
      }
    };

    fetchTotalStudents();
  }, []);

  useEffect(() => {
    if (!admin) return;
    const fetchTotalStaffs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/staff`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        ); 
        setTotalStaffs(response.data.length); 
      } catch (error) {
        console.error('Error fetching total staff:', error);
      }
    };

    fetchTotalStaffs();
  }, []);

  useEffect(() => {
    if (!admin) return;
    const fetchTotalDailyRent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/dailyRent`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        ); 
        const activeDailyRents = response.data.filter(rent => rent.vacate === false);
        setTotalDailyRent(activeDailyRents.length); 
      } catch (error) {
        console.error('Error fetching total staff:', error);
      }
    };

    fetchTotalDailyRent();
  }, []);

  useEffect(() => {
    if (!admin) return;
    const fetchTotalProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        ); 
        setTotalProperties(response.data.length); 
      } catch (error) {
        console.error('Error fetching total properties:', error);
      }
    };

    fetchTotalProperties();
  }, []);

  return (
    <div className="p-4 sm:p-6 rounded-lg mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        <Link to={'/students'}>
          <div className="flex items-center p-4 rounded-lg bg-blue-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 mr-4">
              <FaUserGraduate className="text-white text-3xl" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-md sm:text-lg font-semibold">Total Students</h2>
              <p className="text-xl sm:text-2xl font-bold">{totalStudents}</p>
            </div>
          </div>
        </Link>

        <Link to={'/staffs'}>
          <div className="flex items-center p-4 rounded-lg bg-green-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mr-4">
              <FaUserTie className="text-white text-3xl" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-md sm:text-lg font-semibold">Total Staffs</h2>
              <p className="text-xl sm:text-2xl font-bold">{totalStaffs}</p>
            </div>
          </div>
        </Link>

        <Link to={'/properties'}>
          <div className="flex items-center p-4 rounded-lg bg-red-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 mr-4">
              <FaBuilding className="text-white text-3xl" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-md sm:text-lg font-semibold">Total Properties</h2>
              <p className="text-xl sm:text-2xl font-bold">{totalProperties}</p>
            </div>
          </div>
        </Link>
        
        <Link to={'/dailyRent'}>
          <div className="flex items-center p-4 rounded-lg bg-blue-100">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 mr-4">
              <FaCalendar className="text-white text-3xl" />
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-md sm:text-lg font-semibold">Daily Rent</h2>
              <p className="text-xl sm:text-2xl font-bold">{totalDailyRent}</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StatsSection;
