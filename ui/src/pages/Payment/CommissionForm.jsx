import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';
import CheckAuth from '../auth/CheckAuth';

const CommissionForm = () => {
  const admin = useSelector(store => store.auth.admin);
  const [agentName, setAgentName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [message, setMessage] = useState('');
  const [properties, setProperties] = useState([]); // State for storing fetched properties
  const navigate = useNavigate();

  // Fetching properties when the component mounts
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
  }, [admin]); // Ensures token is correctly passed in the headers

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/commission/add`, {
        agentName,
        amount,
        note,
        paymentType,
        transactionId,
        propertyId, // Send the propertyId selected from the dropdown
        propertyName,
      },
      { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      
      setMessage(response.data.message);
      console.log(response.data);

      // Navigate to '/payments' after successful submission
      navigate('/payments');

      // Reset form fields after successful submission
      setAgentName('');
      setAmount('');
      setNote('');
      setPaymentType('');
      setTransactionId('');
      setPropertyId('');
      setPropertyName('');
    } catch (error) {
      console.error('Error adding commission:', error);
      setMessage('Failed to add commission');
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full">
        {message && (
          <p className="mb-4 text-center text-sm text-green-600 bg-green-100 p-2 rounded-md">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Agent Name
            </label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter agent name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              rows="4"
              placeholder="Add a note (optional)"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Type
            </label>
            <input
              type="text"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter payment type"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transaction ID
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter transaction ID (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Name
            </label>
            <select
              value={propertyName}
              onChange={(e) => {
                const selectedProperty = properties.find(
                  (property) => property.name === e.target.value
                );
                setPropertyName(e.target.value);
                setPropertyId(selectedProperty ? selectedProperty._id : '');
              }}
              required
              className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property._id} value={property.name}>
                  {property.propertyName}
                </option>
              ))}
            </select>
          </div>
          
          {/* Displaying the selected propertyId */}
          {propertyId && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Property ID
              </label>
              <input
                type="text"
                value={propertyId}
                readOnly
                className="mt-1 p-3 border border-gray-300 rounded-md w-full bg-gray-200"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium p-3 rounded-md w-full transition duration-300"
          >
            Add Commission
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckAuth(CommissionForm);
