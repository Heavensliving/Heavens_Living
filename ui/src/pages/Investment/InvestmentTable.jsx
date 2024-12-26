// ui/src/pages/Investment/InvestmentTable.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importing React Icons (Edit and Trash)
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InvestmentsTable = () => {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // State for the filter input
  const navigate = useNavigate();

  const admin = useSelector((state) => state.auth.admin);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/investment`, {
        headers: { 'Authorization': `Bearer ${admin?.token}` },
      })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setInvestments(response.data.data);
          setFilteredInvestments(response.data.data); // Initialize filtered data
        } else {
          setError('Invalid data format. No investments found.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch investments');
        setLoading(false);
      });
  }, [admin]);

  // Filter investments based on the filter input
  useEffect(() => {
    const filtered = investments.filter(investment =>
      investment.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredInvestments(filtered);
  }, [filter, investments]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-50"> {/* Added padding and background color */}
      {/* Filter Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Investment Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)} // Update filter state on input change
          className="px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-green-500" // Styling for the input
        />
      </div>

      {/* "Add New" Button */}
      <div className="flex justify-end mb-4">
        <button
          className="px-6 py-3 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition duration-200" 
          onClick={() => navigate("/addInvestment")}
        >
          Add New
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full table-auto bg-white"> {/* Added background color to the table */}
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Investment Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Property Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Property ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Investment Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Amount Invested</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Investment Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestments.map((investment) => (
              <tr key={investment._id} className="hover:bg-gray-100 transition duration-200"> {/* Added transition for smooth hover effect */}
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.name}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.propertyName}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.propertyId}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.type}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">${investment.amount}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{new Date(investment.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 transition duration-200"> {/* Added transition for smooth hover effect */}
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition duration-200"> {/* Added transition for smooth hover effect */}
                    <FaTrash className="h-5 w-5" />
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

export default InvestmentsTable;