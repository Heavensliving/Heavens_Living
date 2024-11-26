import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';  // Make sure to import toast
import 'react-toastify/dist/ReactToastify.css';
import CheckAuth from '../auth/CheckAuth';

const AddMaintanence = () => {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    navigate('/maintanance'); // Adjust this path based on your routes
  };

  const [formData, setFormData] = useState({
    Name: '',
    issue: '',
    description: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    if (!admin) return;
    e.preventDefault(); 
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/maintenance/add`, formData,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      setSuccessMessage('Maintenance issue added successfully!');
      setErrorMessage('');
      setFormData({
        Name: '',
        issue: '',
        description: '',
      });

      // Display success toast
      toast.success('Maintenance issue added successfully!', { autoClose: 500 });

      // Navigate to maintenance page after successful submission
      handleClick();
    } catch (error) {
      console.error('Error adding maintenance issue:', error);
      
      if (error.response) {
        setErrorMessage(`Error: ${error.response.data.message || 'Failed to add maintenance issue. Please try again.'}`);
        // Display error toast
        toast.error(`Error: ${error.response.data.message || 'Failed to add maintenance issue. Please try again.'}`, { autoClose: 500 });
      } else {
        setErrorMessage('No response from server. Please check your connection.');
        // Display error toast for no response
        toast.error('No response from server. Please check your connection.', { autoClose: 500 });
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-4 bg-white shadow-md rounded">
      
      {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="Name">Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="issue">Issue:</label>
          <select
            name="issue"
            value={formData.issue}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3"
          >
            <option value="">Select an issue</option> {/* Default option */}
            <option value="electrical">Electrical</option>
            <option value="water">Water</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="food">Food</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="description">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border rounded w-full py-2 px-3"
            rows="3"
          />
        </div>
       
        <ToastContainer />
                <button
                    type="submit"
                    className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${
                        loading ? 'cursor-not-allowed' : ''
                    }`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                    ) : (
                        'Update Item'
                    )}
                </button>
      </form>
    </div>
  );
};

export default CheckAuth(AddMaintanence);
