import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import PendingIssues from './pendingIssue';
import OngoingIssues from './OnGoingIssue';
import ResolvedIssues from './ResolvedIssue';

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
        const response = await axios.get('http://localhost:3000/api/maintenance/get');
        const records = response.data;

        // Filter records based on status
        const inProcess = records.filter(record => record.Status === 'pending').length;
        const completed = records.filter(record => record.Status === 'resolved').length;
        const total = records.length; 
        const unassigned = records.filter(record => !record.AssignedTo).length; 

        // Update stats state
        setStats({ inProcess, completed,total,unassigned });
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v8m4-4H8"
            />
          </svg>
          Add Maintenance
        </button>

        <h1 className="text-xl font-bold text-left mb-4">Maintenance Overview</h1>

        <div className="flex space-x-5 mb-8">
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-blue-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l2 2"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-blue-600">{stats.inProcess}</h2> 
            <p className="text-sm text-gray-600">In Process</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-green-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2l4 -4"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-green-600">{stats.completed}</h2> 
            <p className="text-sm text-gray-600">Completed Maintenance</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-yellow-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-yellow-600">{stats.unassigned}</h2> 
            <p className="text-sm text-gray-600">Hold Maintenance</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-48 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-gray-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-600">{stats.total}</h2>
            <p className="text-sm text-gray-600">Total Maintenance</p>
          </div>
        </div>

        <div className="flex space-x-5 flex-grow">
          <PendingIssues />
          <OngoingIssues />
          <ResolvedIssues />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceComponent;
