import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvestmentForm = ({ admin }) => {
  const [formData, setFormData] = useState({
    name: '',
    propertyId: '',
    type: '',
    amount: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [properties, setProperties] = useState([]);
  const [propertyName, setPropertyName] = useState('');

  useEffect(() => {
    if (!admin) return;

    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [admin]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));

    // Autofill propertyId when a property is selected
    if (id === 'propertyName') {
      const selectedProperty = properties.find(
        (property) => property.propertyName === value // Make sure the correct field is used here
      );
      if (selectedProperty) {
        setFormData((prevData) => ({
          ...prevData,
          propertyId: selectedProperty._id,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      setError('Amount must be a positive number');
      return;
    }
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${API_BASE_URL}/investment/add`, formData);
      console.log('Investment added:', response.data);
      setSuccessMessage('Investment added successfully!');
      // Optionally reset the form
      setFormData({ name: '', propertyId: '', type: '', amount: '' });
      setPropertyName(''); // Reset property name
    } catch (error) {
      console.error('Error adding investment:', error);
      setError(error.response?.data?.message || 'Error adding investment. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Investment</h2>
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
            value={propertyName}
            onChange={(e) => {
              const selectedProperty = properties.find(
                (property) => property.propertyName === e.target.value // Ensure correct property name
              );
              setPropertyName(e.target.value);
              setFormData((prevData) => ({
                ...prevData,
                propertyId: selectedProperty ? selectedProperty._id : '',
              }));
            }}
            required
            className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a property</option>
            {properties.map((property) => (
              <option key={property._id} value={property.propertyName}>
                {property.propertyName} {/* Make sure the property name is correct */}
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
          <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 transition duration-200">Add Investment</button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentForm;
