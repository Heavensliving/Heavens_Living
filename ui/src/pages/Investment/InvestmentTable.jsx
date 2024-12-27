import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InvestmentsTable = () => {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState(null);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/investment`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setInvestments(response.data.data);
        setFilteredInvestments(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch investments');
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [admin]);

  useEffect(() => {
    let updatedInvestments = investments;

    if (searchTerm) {
      updatedInvestments = updatedInvestments.filter(investment =>
        investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      updatedInvestments = updatedInvestments.filter(investment => {
        const investmentDate = new Date(investment.createdAt);
        return (
          investmentDate.getDate() === filterDateObj.getDate() &&
          investmentDate.getMonth() === filterDateObj.getMonth() &&
          investmentDate.getFullYear() === filterDateObj.getFullYear()
        );
      });
    }

    setFilteredInvestments(updatedInvestments);
  }, [searchTerm, filterDate, investments]);

  const handleDelete = async () => {
    if (investmentToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/investment/delete/${investmentToDelete}`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setInvestments(investments.filter(investment => investment._id !== investmentToDelete));
        setIsModalOpen(false);
      } catch (err) {
        setError('Failed to delete investment');
      }
    }
  };

  const openModal = (id) => {
    setInvestmentToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInvestmentToDelete(null);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-50">
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onConfirm={handleDelete} 
        confirmLabel="Delete"
        message="Are you sure you want to delete this investment?" 
      />
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name or property..."
          className="px-4 py-2 border rounded shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-2 border rounded shadow-sm"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          className="px-6 py-3 bg-green-500 text-white rounded shadow-md hover:bg-green-600 transition duration-200" 
          onClick={() => navigate("/addInvestment")}
        >
          Add New
        </button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full table-auto bg-white">
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
              <tr key={investment._id} className="hover:bg-gray-100 transition duration-200">
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.name}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.propertyName}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.propertyId}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{investment.type}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">${investment.amount}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b">{new Date(investment.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-sm text-gray-700 border-b flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 transition duration-200" onClick={() => navigate(`/editInvestment/${investment._id}`)}>
                    <FaEdit className="h-5 w-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition duration-200" onClick={() => openModal(investment._id)}>
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
