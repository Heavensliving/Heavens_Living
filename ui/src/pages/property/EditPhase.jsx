import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditPhase() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the phase ID from the URL
  const [phaseData, setPhaseData] = useState({
    Name: '',
    Location: '',
    // Add other phase-related fields as necessary
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the existing phase data
    const fetchPhaseData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/phase/${id}`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
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
    setLoading(true);

    try {
      const response = await axios.put(`${API_BASE_URL}/phase/update/${id}`, phaseData,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      if (response.status === 200) {
        toast.success('Phase Updated Successfully!', { autoClose: 500 });
        setTimeout(() => {
          navigate(`/phase-management/${id}`);
          setLoading(false);
        }, 1000);// Redirect to the phase management page after updating
      }
    } catch (error) {
      console.error('Error updating phase:', error.response?.data || error.message);
      toast.error(error.response.data.message, { autoClose: 2000 });
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

          <ToastContainer />
          <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Update Phase'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPhase;
