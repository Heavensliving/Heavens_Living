import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PendingIssues from './pendingIssue';
import OngoingIssues from './OnGoingIssue';
import ResolvedIssues from './ResolvedIssue';
import { FaCheckCircle, FaPauseCircle, FaTools } from 'react-icons/fa';
import { MdAssignment } from 'react-icons/md';
import API_BASE_URL from '../../config';


const MaintenanceComponent = () => {
  const [stats, setStats] = useState({ inProcess: 0, completed: 0, onHold: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddMaintenanceClick = () => {
    navigate('/add-maintanence');
  };

  useEffect(() => {
    const fetchMaintenanceComponent = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`);
        const records = response.data;

        // Filter records based on status
        const inProcess = records.filter(record => record.Status === 'pending').length;
        const completed = records.filter(record => record.Status === 'resolved').length;
        const total = records.length;
        const unassigned = records.filter(record => !record.AssignedTo).length;

        // Update stats state
        setStats({ inProcess, completed, total, unassigned });
      } catch (error) {
        setError('Error fetching maintenance stats');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceComponent();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative h-screen">
      <div className="mt-4 p-4 h-full flex flex-col">
        <button onClick={handleAddMaintenanceClick} className="absolute top-4 right-4 flex items-center bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600">
          +
          Add Maintenance
        </button>

        <h1 className="text-xl font-bold text-left mb-4">Maintenance Overview</h1>

        <div className="flex space-x-5 mb-8">
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <FaTools className="text-blue-500 text-2xl mb-4" />
            <h2 className="text-base font-bold text-blue-600">{stats.inProcess}</h2>
            <p className="text-sm text-gray-600">In Process</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <FaCheckCircle className="text-green-500 text-3xl mb-2" />
            <h2 className="text-base font-bold text-green-600">{stats.completed}</h2>
            <p className="text-sm text-gray-600">Completed Maintenance</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <FaPauseCircle className="text-yellow-500 text-3xl mb-2" />
            <h2 className="text-base font-bold text-yellow-600">{stats.unassigned}</h2>
            <p className="text-sm text-gray-600">Hold Maintenance</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-48 h-28 relative">
            <MdAssignment className="text-blue-500 text-3xl mb-3" />
            <h2 className="text-base font-bold text-gray-600">{stats.total}</h2>
            <p className="text-sm text-gray-600">Total Maintenance</p>
          </div>
        </div>

        <div className="flex space-x-5 flex-grow">
          <PendingIssues />
          <OngoingIssues />
        </div>
        <ResolvedIssues />
      </div>
    </div>
  );
};

export default MaintenanceComponent;
