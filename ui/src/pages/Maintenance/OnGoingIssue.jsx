
import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';

const OnGoingIssue = () => {
  const admin = useSelector(store => store.auth.admin);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // Track selected record for resolving
  const [remark, setRemark] = useState(''); // State for remark input

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
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

  const handleResolve = (record) => {
    setSelectedRecord(record); // Open modal for the selected record when resolving
  };

  const handleSubmitRemark = async (skip = false) => {
    if (selectedRecord) {
      try {
        await axios.put(`${API_BASE_URL}/maintenance/updateStatus/${selectedRecord._id}`, {
          status: 'resolved',
          Remarks: skip ? '' : remark, // If skip is true, submit without a remark
        },
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
        setSelectedRecord(null); // Close modal after successful submission
        setRemark(''); // Reset remark input
        window.location.reload(); // Reload page to reflect changes
      } catch (error) {
        console.error('Error resolving issue', error);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedRecord(null); // Close modal
    setRemark(''); // Reset remark
  };

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
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Ongoing Issues</h2>
      <div className="flex-grow max-h-80 overflow-y-auto">
        <table className="w-full text-left">
          <thead className='text-center'>
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
          <tbody className='text-center'>
            {records.length === 0 ? (
              <tr>
                <td className="p-2 text-center" colSpan="7">
                  No ongoing issues
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
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
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={() => handleResolve(record)}
                    >
                      Resolve
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for adding remark or skipping */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Add Remark (Optional)</h2>
            <textarea
              className="w-full border rounded p-2 mb-4"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter remark"
            />
            <div className="flex justify-end">
              <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={() => handleSubmitRemark()}>
                Submit
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleSubmitRemark(true)}>
                Skip and Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnGoingIssue;
