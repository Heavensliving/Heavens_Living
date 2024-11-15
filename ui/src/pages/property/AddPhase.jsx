import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

function AddPhase() {
  const admin = useSelector(store => store.auth.admin);
  const { id } = useParams();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send POST request to backend API
      const response = await axios.post(`${API_BASE_URL}/phase/add`, {
        Name: name,
        Location: location,
        Branch: id
      },
      {headers: { 'Authorization': `Bearer ${admin.token}` }}
    );
      if (response.status === 201) {
        // On success, show a success message and reset the form
        setSuccessMessage('Phase added successfully!');
        setName('');
        setLocation('');
        navigate(`/phase-management/${id}`); // Redirect to phase management page
      }
    } catch (error) {
      // Show error message if something goes wrong
      setErrorMessage('Failed to add phase. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">Add Phase</h2>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {/* Phase Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Phase Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div> 
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add Phase
        </button>
      </form>
    </div>
  );
}

export default AddPhase;
