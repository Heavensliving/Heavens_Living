import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';
import CheckAuth from '../auth/CheckAuth';

const CommissionTable = () => {
  const admin = useSelector(store => store.auth.admin);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!admin) return;
    const fetchCommissions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/commission/`, {
          headers: { 'Authorization': `Bearer ${admin.token}` },
        });
        setCommissions(response.data); // Adjust based on the actual response structure
      } catch (error) {
        console.error('Error fetching commission data:', error);
        setError('Failed to fetch commissions');
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [admin.token]);

  // Filter commissions based on the search term
  const filteredCommissions = commissions.filter((commission) =>
    commission.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <input
        type="text"
        placeholder="Search by Agent Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
      />
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">#</th> {/* Index Column */}
            <th className="py-2 px-4 border">Agent Name</th>
            <th className="py-2 px-4 border">Amount</th>
            <th className="py-2 px-4 border">Note</th>
            <th className="py-2 px-4 border">Payment Type</th>
            <th className="py-2 px-4 border">Transaction ID</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Property Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredCommissions.length > 0 ? (
            filteredCommissions.map((commission, index) => (
              <tr key={commission._id}>
                <td className="py-2 px-4 border">{index + 1}</td> {/* Display index number */}
                <td className="py-2 px-4 border">{commission.agentName}</td>
                <td className="py-2 px-4 border">{commission.amount}</td>
                <td className="py-2 px-4 border">{commission.note || 'N/A'}</td>
                <td className="py-2 px-4 border">{commission.paymentType}</td>
                <td className="py-2 px-4 border">{commission.transactionId || 'N/A'}</td>
                <td className="py-2 px-4 border">
                  {new Date(commission.createdAt).toLocaleDateString('en-GB') || 'N/A'}
                </td>
                <td className="py-2 px-4 border">{commission.propertyName}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-2 px-4 text-center border text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckAuth(CommissionTable);
