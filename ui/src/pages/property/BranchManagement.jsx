import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBuilding, FaFilter, FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import API_BASE_URL from '../../config';



function BranchManagement() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null); // To store the branch ID to delete
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branch`);
      setBranches(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Failed to fetch branches. Please try again later.');
      setLoading(false);
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch?.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const phasePageRender = (id) =>{
    navigate(`/phase-management/${id}`);
  }

  const handleUpdate = (id) => {
    navigate(`/update/${id}`);
  };

  const handleDelete = (id) => {
    setBranchToDelete(id); // Set the branch ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const ConfirmDelete = async () => {
    if (branchToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/branch/delete/${branchToDelete}`);
        fetchBranches(); // Refresh the branch list after deletion
        setIsModalOpen(false); // Close the modal
      } catch (error) {
        console.error('Failed to delete branch:', error);
        alert('Error deleting branch. Please try again.');
      }
    }
  };

  if (loading) return <p>Loading branches...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      {/* Total Branches Card Section */}
      <div className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
        <FaBuilding className="text-blue-600 text-2xl mr-2" />
        <div>
          <p className="text-gray-500 text-sm">Total Branches</p>
          <p className="font-bold text-lg">{branches.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-2/3 lg:w-3/4 xl:w-1/2 mr-4"
        />

        <div className="flex space-x-2">
          {/* Filter Button */}
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FaFilter className="mr-2" />
            Filter
          </button>

          {/* Add Branch Button */}
          <button
            onClick={() => navigate('/add-branch')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" />
            Add Branch
          </button>
        </div>
      </div>

      {/* Branches Section */}
      {filteredBranches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBranches.map(branch => (
            <div key={branch._id}
              className="bg-white p-4 rounded-lg border border-gray-300 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex justify-between mb-2">
                <div onClick={() => phasePageRender(branch._id)} className="flex-grow">
                  <h3 className="text-lg font-semibold">{branch.Name}</h3>
                  <p className="text-gray-600">{branch.BranchId}</p>
                  <p className="text-gray-600">{branch.Location}</p>
                </div>

                {/* Icons for Update and Delete */}
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleUpdate(branch._id)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(branch._id)} className="text-red-600 hover:text-red-800">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No branches found</p>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={ConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this branch?`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default BranchManagement;
