
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';

const OngoingIssues = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`);
        const resolvedRecords = response.data.filter(record => record.Status === 'pending' && record.AssignedTo);
        setRecords(resolvedRecords);
      } catch (err) {
        setError('Error fetching maintenance records');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRecords();
  }, []);

  const calculateTimeRemaining = (assignedAt, timeNeeded) => {
    if (!assignedAt || !timeNeeded) return { hours: 0, minutes: 0 };
    const assignedTime = new Date(assignedAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - assignedTime;

    const timeNeededMs = timeNeeded * 60 * 60 * 1000;
    const remainingTimeMs = timeNeededMs - timeDifference;

    const remainingHours = Math.max(Math.floor(remainingTimeMs / (1000 * 60 * 60)), 0);
    const remainingMinutes = Math.max(Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)), 0);

    return { hours: remainingHours, minutes: remainingMinutes };
  };

  const handleResolve = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/maintenance/updateStatus/${id}`, { status: 'resolved' });
      window.location.reload()
      // Refresh the records after successful update
      setRecords(records.filter(record => record._id !== id));
    } catch (err) {
      console.error('Error resolving issue', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-2/3 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Ongoing Issues</h2>
      <div className="flex-grow">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Assigned To</th>
              <th className="p-2 text-sm font-bold text-gray-700">Time Needed</th>
              <th className="p-2 text-sm font-bold text-gray-700">Time Remaining</th>
              <th className="p-2 text-sm font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record._id} className="hover:bg-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{record.Name}</td>
                <td className="p-2">{record.issue}</td>
                <td className="p-2">{record.AssignedTo}</td>
                <td className="p-2">{record.Timeneeded} hours</td>
                <td className="p-2 text-red-700">
                  {(() => {
                    const { hours, minutes } = calculateTimeRemaining(record.AssignedAt, record.Timeneeded);
                    return `${hours} hours ${minutes} minutes`;
                  })()}
                </td>
                <td className="p-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleResolve(record._id)}
                  >
                    Resolve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OngoingIssues;
