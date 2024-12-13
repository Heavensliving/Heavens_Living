import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CommissionTable = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/commission/');
        setCommissions(response.data); // Adjust based on the actual response structure
      } catch (error) {
        console.error('Error fetching commission data:', error);
        setError('Failed to fetch commissions');
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  // Filter commissions based on the search term
  const filteredCommissions = commissions.filter((commission) =>
    commission.agentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            <th className="py-2 px-4 border">Property ID</th>
            <th className="py-2 px-4 border">Property Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredCommissions.map((commission, index) => (
            <tr key={commission._id}>
              <td className="py-2 px-4 border">{index + 1}</td> {/* Display index number */}
              <td className="py-2 px-4 border">{commission.agentName}</td>
              <td className="py-2 px-4 border">{commission.amount}</td>
              <td className="py-2 px-4 border">{commission.note || 'N/A'}</td>
              <td className="py-2 px-4 border">{commission.paymentType}</td>
              <td className="py-2 px-4 border">{commission.transactionId || 'N/A'}</td>
              <td className="py-2 px-4 border">{commission.propertyId}</td>
              <td className="py-2 px-4 border">{commission.propertyName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionTable;