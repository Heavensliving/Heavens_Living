import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function EditBranch() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the branch ID from the URL
  const [branchData, setBranchData] = useState({
    Name: '',
    Location: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the existing branch data
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/branch/${id}`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setBranchData(response.data);
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    };

    fetchBranchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBranchData({
      ...branchData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.put(`${API_BASE_URL}/branch/update/${id}`, branchData,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      if (response.status === 200) {
    
        toast.success('Branch Updated Successfully!', { autoClose: 500 });
        setTimeout(() => {
          navigate('/branch-management');
          setLoading(false);
        }, 1000); // Redirect to the branch management page after updating
      }
    } catch (error) {
      console.error('Error updating branch:', error.response?.data || error.message);
       toast.error(error.response.data.message, { autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">
              Branch Name
            </label>
            <input
              type="text"
              name="Name"
              id="Name"
              placeholder="Branch Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={branchData.Name}
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
              value={branchData.Location}
              onChange={handleChange}
              required
            />
          </div>

          <ToastContainer />
          <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Update Branch'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBranch;
