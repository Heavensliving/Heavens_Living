import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddPhase() {
  const admin = useSelector(store => store.auth.admin);
  const { id } = useParams();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
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
        toast.success('Phase Added Successfully!', { autoClose: 500 });
        setTimeout(() => {
          navigate(`/phase-management/${id}`);
          setLoading(false);
        }, 1000);
        setName('');
        setLocation('');
        
      }
    } catch (error) {
      // Show error message if something goes wrong
      setErrorMessage('Failed to add phase. Please try again.');
      toast.error(error.response.data.message, { autoClose: 2000 });
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
        <ToastContainer />
          <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Add Phase'
            )}
          </button>
      </form>
    </div>
  );
}

export default AddPhase;
