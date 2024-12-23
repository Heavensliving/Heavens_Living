import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';  // Import Link for navigation
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';

const ResolvedIssue = () => {
  const admin = useSelector(store => store.auth.admin);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestResolvedRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/getLatest`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setRecords(response.data);
      } catch (err) {
        setError('Error fetching maintenance records');
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResolvedRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>{error}</div>
      </div>
    );
  }


  return (
    <div className="bg-white shadow-md rounded-lg p-4  mt-4 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Latest Resolved Issues</h2>
      <div className="flex-grow max-h-80 overflow-y-auto"> {/* Allow scrolling if too many records */}
        <table className="w-full text-left">
          <thead className='text-center'>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Resolved By</th>
              <th className="p-2 text-sm font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {records.map((record, index) => (
              <tr key={record._id} className="hover:bg-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{record.Name}</td>
                <td className="p-2">{record.issue}</td>
                <td className="p-2">{record.AssignedTo}</td>
                <td className="p-2 text-green-700">{record.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add a link to the history page */}
      <div className="mt-4">
        <Link 
          to="/History" 
          className="bg-side-bar hover:bg-[#373082] text-white px-4 py-2 rounded"
        >
          Show History
        </Link>
      </div>
    </div>
  );
};

export default ResolvedIssue;
