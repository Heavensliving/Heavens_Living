import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';


function ManagePeople() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate()
  const [people, setPeople] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false); // To control delete modal visibility
  const [personToDelete, setPersonToDelete] = useState(null); // To track the person being deleted
  const [isDeleting, setIsDeleting] = useState(false); // To show a loader during deletion

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/people/get-people`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );

        setPeople(response.data.data || []);
      } catch (error) {
        console.error('Error fetching people:', error);
        setError('Failed to fetch people.');
      }
    };

    fetchPeople();
  }, []);

  const handleDelete = async () => {
    if (!personToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/people/delete-person/${personToDelete._id}`,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      setPeople(people.filter((person) => person._id !== personToDelete._id));
      setDeleteModal(false); // Close modal after successful deletion
    } catch (error) {
      console.error('Error deleting person:', error);
      setError('Failed to delete person.');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (person) => {
    setPersonToDelete(person);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setPersonToDelete(null);
    setDeleteModal(false);
  };

  // Filter people based on search term
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-100 p-6">
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* Search input */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Contact Number</th>
              <th className="py-3 px-6 text-left">People ID</th>
              <th className="py-3 px-6 text-left">Meal Type</th>
              <th className="py-3 px-6 text-left">Monthly Amount</th>
              <th className="py-3 px-6 text-left">Time Period</th>
              <th className="py-3 px-6 text-left">Join Date</th>
              <th className="py-3 px-6 text-left">Days Left</th>
              <th className="py-3 px-6 text-left">Payment Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredPeople.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No people found
                </td>
              </tr>
            ) : (
              filteredPeople.map((person) => (
                <tr key={person._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{person.name}</td>
                  <td className="py-3 px-6 text-left">{person.contactNumber}</td>
                  <td className="py-3 px-6 text-left">{person.studentId || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{person.mealType}</td>
                  <td className="py-3 px-6 text-left">{person.monthlyRent}</td>
                  <td className="py-3 px-6 text-left">
                    {person.timePeriod.months} Months / {person.timePeriod.days} Days
                  </td>
                  <td className="py-3 px-6 text-left">{new Date(person.joinDate).toLocaleDateString('en-GB')}</td>

                  <td className="py-3 px-6 text-left text-yellow-500">{person.daysLeft} </td>
                  <td className="py-3 px-6 text-left">
                    <span className={person.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}>
                      {person.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-6 flex justify-center items-center space-x-4">
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={() => navigate(`/editPeople/${person._id}`)}
                    />
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => openDeleteModal(person)} // Open delete confirmation modal
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">
              Are you sure you want to delete{' '}
              <span className="font-bold">{personToDelete?.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePeople;
