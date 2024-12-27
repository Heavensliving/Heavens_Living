import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditInvestment = () => {
  const { id } = useParams(); // Get the investment ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    propertyId: '',
    type: '',
    amount: '',
  });
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin); // Access the admin from Redux

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/investment/${id}`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setFormData(response.data.data);
      } catch (err) {
        setError('Failed to fetch investment details');
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setProperties(response.data);
      } catch (err) {
        setError('Failed to fetch properties');
      }
    };

    fetchInvestment();
    fetchProperties();
  }, [id, admin]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/investment/update/${id}`, formData, {
        headers: { 'Authorization': `Bearer ${admin?.token}` },
      });
      setSuccessMessage('Investment updated successfully!');
      navigate('/investment'); // Redirect to the investments list after successful update
    } catch (err) {
      setError('Failed to update investment');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Investment</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Investor Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Property Name</label>
          <select
            id="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            required
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property._id} value={property._id}>
                {property.propertyName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Investment Type</label>
          <input
            type="text"
            id="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
          />
        </div>

        <div>
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200">Update Investment</button>
        </div>
      </form>
    </div>
  );
};

export default EditInvestment;
