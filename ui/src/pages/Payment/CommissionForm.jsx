import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from '../auth/CheckAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [loading, setLoading] = useState(false);
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
    setLoading(true)

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
      // console.log(response.data);

      // Navigate to '/payments' after successful submission

      toast.success('Commission Added Successfully!', { autoClose: 500 });
      setTimeout(() => {
        navigate('/payments');
        setLoading(false);
      }, 1000);
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
      toast.error('Failed to add commission', { autoClose: 500 });
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full">
        {/* {message && (
          <p className="mb-4 text-center text-sm text-green-600 bg-green-100 p-2 rounded-md">
            {message}
          </p>
        )} */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                onWheel={(e) => e.target.blur()}
                required
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                min='0'
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                rows="1"
                placeholder="Add a note (optional)"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payment Type
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
                className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Payment Type</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            {paymentType !== "Cash" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="mt-1 p-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter transaction ID"
                  required
                />
              </div>
            )}
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
          </div>
          <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Add Commissions'
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckAuth(CommissionForm);
