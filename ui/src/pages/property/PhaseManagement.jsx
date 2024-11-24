import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBuilding, FaFilter, FaPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

function PhaseManagement() {
  const admin = useSelector(store => store.auth.admin);
  const { id } = useParams();
  const [phases, setPhases] = useState([]); 
  const [branchId, setBranchId] = useState('');
  const [branch, setBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState(null); // To store the phase ID to delete
  const navigate = useNavigate();
  
 
  useEffect(() => {
    fetchPhases();
    fetchBranch();
  }, []);

  const fetchPhases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/phase/phases/${id}`,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      setBranchId(response.data._id)
      // Extract the phases array from the response data
      setPhases(response.data.Phases || []); // Ensure that the phases is always an array
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching phases:', error); // Log any error
      setErrorMessage('Failed to fetch phases. Please try again later.');
      setLoading(false);
    }
  };
  const fetchBranch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branch/${id}`,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      setBranch(response.data)
      setLoading(false);
    } catch (error) {
      console.error('Error fetching phases:', error); // Log any error
      setErrorMessage('Failed to fetch phases. Please try again later.');
      setLoading(false);
    }
  };

  const filteredPhases = phases.filter(phase =>
    phase?.Name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdate = (id) => {
    navigate(`/updatePhase/${id}`);
  };

  const handleDelete = (id) => {
    setPhaseToDelete(id); // Set the phase ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (phaseToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/phase/delete/${phaseToDelete}`,{
          params: { branchId },
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });
        fetchPhases(); // Refresh the phase list after deletion
        setIsModalOpen(false); // Close the modal
      } catch (error) {
        console.error('Failed to delete phase:', error);
        alert('Error deleting phase. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>{errorMessage}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      {/* Total Phases Card Section */}
      <div className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
        <FaBuilding className="text-blue-600 text-2xl mr-2" />
        <div>
          <p className="text-gray-500 text-sm">Total Phases in {branch.Name}</p>
          <p className="font-bold text-lg">{phases.length}</p>
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
          {/* <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FaFilter className="mr-2" />
            Filter
          </button> */}

          {/* Add Phase Button */}
          <button
            onClick={() => navigate(`/add-phase/${id}`)}
            className="flex items-center px-4 py-2 bg-side-bar text-white rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" />
            Add Phase
          </button>
        </div>
      </div>

      {/* Phases Section */}
      {filteredPhases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhases.map(phase => (
            <div key={phase._id} className="bg-white p-4 rounded-lg border border-gray-300 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <div className="flex justify-between mb-2">
                <div onClick={() => navigate(`/properties/${phase._id}`)} className="flex-grow">
                  <h3 className="text-lg font-semibold">{phase.Name}</h3>
                  <p className="text-gray-600">{phase.PhaseId}</p>
                  <p className="text-gray-600">{phase.Location}</p>
                </div>

                {/* Icons for Update and Delete */}
                <div className="flex items-center space-x-2">
                  <button onClick={() => handleUpdate(phase._id)} className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(phase._id)} className="text-red-600 hover:text-red-800">
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No phases found</p>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this phase?`}
        confirmLabel="Delete"
      />
    </div>
  );
}

export default PhaseManagement;
