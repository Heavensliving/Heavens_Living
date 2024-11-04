import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    otherReason: '',
    paymentMethod: '',
    transactionId: '',
    amount: '',
    date: '',
    propertyName: '',
    propertyId: '',
  });

  const navigate = useNavigate(); // For navigation after form submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/expense/addExpense', formData);
      console.log('Expense added:', response.data);
      // Redirect to the expenses list or another page
      navigate('/expenses'); // Change to your desired route
    } catch (error) {
      console.error('Error adding expense:', error);
      if (error.response && error.response.data) {
        alert(`Failed to add expense: ${error.response.data.error}`);
      } else {
        alert('Failed to add expense. Please check the input data and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {['title', 'type', 'category', 'paymentMethod', 'amount', 'date'].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-gray-700 mb-2 capitalize">{field}</label>
              <input
                type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          ))}

          {/* Add two fields in one line */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-2">Other Reason</label>
              <input
                type="text"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Add another two fields in one line for Property Name and Property ID */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-gray-700 mb-2">Property Name</label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 mb-2">Property ID</label>
              <input
                type="text"
                name="propertyId"
                value={formData.propertyId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
