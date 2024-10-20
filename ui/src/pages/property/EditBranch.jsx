import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';


function EditBranch() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the branch ID from the URL
  const [branchData, setBranchData] = useState({
    Name: '',
    Location: '',
  });

  useEffect(() => {
    // Fetch the existing branch data
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/branch/${id}`);
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
    e.preventDefault();

    try {
      const response = await axios.put(`${API_BASE_URL}/branch/update/${id}`, branchData);
      if (response.status === 200) {
        navigate('/branch-management'); // Redirect to the branch management page after updating
      }
    } catch (error) {
      console.error('Error updating branch:', error.response?.data || error.message);
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update Branch
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBranch;
