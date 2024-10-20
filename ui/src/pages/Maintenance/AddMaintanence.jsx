import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

const AddMaintanence = () => {
  const navigate = useNavigate();

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
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(`${API_BASE_URL}/maintenance/add`, formData);
      setSuccessMessage('Maintenance issue added successfully!');
      setErrorMessage('');
      setFormData({
        Name: '',
        issue: '',
        description: '',
      
      });

      // Navigate to maintenance page after successful submission
      handleClick();
    } catch (error) {
      console.error('Error adding maintenance issue:', error);
      
      if (error.response) {
        setErrorMessage(`Error: ${error.response.data.message || 'Failed to add maintenance issue. Please try again.'}`);
      } else {
        setErrorMessage('No response from server. Please check your connection.');
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
       
        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddMaintanence;
