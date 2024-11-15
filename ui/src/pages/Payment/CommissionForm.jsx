import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';

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
  const navigate = useNavigate(); // Corrected spelling of 'navigate'

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/commission/add`, {
        agentName,
        amount,
        note,
        paymentType,
        transactionId,
        propertyId,
        propertyName,
      },
      {headers: { 'Authorization': `Bearer ${admin.token}` }}
    );
      setMessage(response.data.message);
      
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
    <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-md shadow-md p-4 max-w-md w-full">
        {message && <p className="text-green-500">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Type</label>
            <input
              type="text"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Transaction ID</label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Property ID</label>
            <input
              type="text"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Property Name</label>
            <input
              type="text"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Add Commission
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommissionForm;
