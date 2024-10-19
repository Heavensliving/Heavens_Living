import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to import axios

const ResolvedIssues = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/maintenance/get');
        // Filter records where the status is 'resolved'
        const resolvedRecords = response.data.filter(record => record.Status === 'resolved');
        setRecords(resolvedRecords);
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
    <div className="bg-white shadow-md rounded-lg p-4 w-1/2 mt-4 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Resolved Issues</h2>
      <div className="flex-grow"> {/* Allow scrolling if too many records */}
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Resolved By</th>
              <th className="p-2 text-sm font-bold text-grey-700">Status</th>
            </tr>
          </thead>
          <tbody>
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
    </div>
  );
};

export default ResolvedIssues;
