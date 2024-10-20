import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';


function EditPhase() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the phase ID from the URL
  const [phaseData, setPhaseData] = useState({
    Name: '',
    Location: '',
    // Add other phase-related fields as necessary
  });

  useEffect(() => {
    // Fetch the existing phase data
    const fetchPhaseData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/phase/${id}`);
        setPhaseData(response.data);
      } catch (error) {
        console.error('Error fetching phase data:', error);
      }
    };

    fetchPhaseData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPhaseData({
      ...phaseData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API_BASE_URL}/phase/update/${id}`, phaseData);
      if (response.status === 200) {
        navigate('/phase-management'); // Redirect to the phase management page after updating
      }
    } catch (error) {
      console.error('Error updating phase:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
              Phase Name
            </label>
            <input
              type="text"
              name="Name"
              id="Name"
              placeholder="Phase Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={phaseData.Name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="Location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="Location"
              id="Location"
              placeholder="Location"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={phaseData.Location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Add more fields as necessary for the phase data */}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update Phase
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPhase;
