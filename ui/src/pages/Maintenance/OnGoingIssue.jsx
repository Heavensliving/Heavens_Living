import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OngoingIssues = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/maintenance/get'); // Adjust the endpoint as necessary
        setRecords(response.data);
        console.log(response.data);
      } catch (err) {
        setError('Error fetching maintenance records');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRecords();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-1/3 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Ongoing Issues</h2>
      <div className="flex-grow max-h-40">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Assigned To</th>
              <th className="p-2 text-sm font-bold text-gray-700">Time Needed</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record._id} className="hover:bg-gray-100">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{record.Name}</td>
                <td className="p-2">{record.issue}</td>
                <td className="p-2">{record.AssignedTo}</td>
                <td className="p-2">{record.Timeneeded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OngoingIssues;
