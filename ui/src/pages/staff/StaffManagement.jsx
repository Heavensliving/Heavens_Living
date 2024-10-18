import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import { ref, deleteObject, getStorage } from 'firebase/storage';
import app from '../../firebase';
import StaffTable from './StaffTable';
import API_BASE_URL from '../../config';
import SearchAndSort from '../../components/reUsableComponet/SearchAndSort';

const storage = getStorage();

// Custom hook for fetching staff data
const useStaffData = () => {
  const [staffs, setStaffs] = useState([]);
  const [originalStaffs, setOriginalStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/staff`);
        setStaffs(res.data);
        setOriginalStaffs(res.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { staffs, setStaffs, originalStaffs, loading, error };
};

const StaffManagement = () => {
  const navigate = useNavigate();
  const { staffs, setStaffs, originalStaffs, loading, error } = useStaffData(); // Access original data
  const [deleteStaffId, setDeleteStaffId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRowClick = (id) => {
    navigate(`/staffs/${id}`);
  };

  const handleDelete = (staffID) => {
    setDeleteStaffId(staffID);
    setIsModalOpen(true);
  };

  const ConfirmDelete = async () => {
    if (!deleteStaffId) return;

    try {
      const staffToDelete = staffs.find(staff => staff._id === deleteStaffId);
      const filePaths = [
        staffToDelete?.Adharfrontside,
        staffToDelete?.Adharbackside,
        staffToDelete?.Photo
      ].filter(Boolean);

      // Delete files from Firebase Storage
      for (const filePath of filePaths) {
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      }

      // Delete staff record from the database
      await axios.delete(`${API_BASE_URL}/staff/delete/${deleteStaffId}`);
      console.log("Staff deleted successfully from the database!");

      // Update local state
      setStaffs(prevStaffs => prevStaffs.filter(staff => staff._id !== deleteStaffId));

      // Close modal
      setIsModalOpen(false);
      navigate('/staffs');
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  // Sorting options for the dropdown
  const sortingOptions = [
    { value: 'All', label: 'All' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort change
  const onSortChange = (sortValue) => {
    if (sortValue === 'All') {
      // Restore the full list when 'All' is selected
      setStaffs(originalStaffs);
    } else {
      // Filter based on status
      const filteredStaffs = originalStaffs.filter(staff => staff.Status === sortValue);
      setStaffs(filteredStaffs);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col">
      {/* Staff Card */}
      <div className="w-full mb-6 flex justify-start">
        <div className="w-full sm:w-48 bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaUsers className="text-blue-600 text-2xl mr-2" />
            <div>
              <h2 className="text-lg font-semibold">Total Staffs</h2>
              <p className="text-xl font-bold">{originalStaffs.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Replace the top search bar and buttons with SearchAndSort component */}
      <SearchAndSort
        searchQuery={searchTerm}
        handleSearchChange={handleSearchChange}
        sortingOptions={sortingOptions}
        onSortChange={onSortChange}
        addNewEntryPath="/add-staff"
        addButtonLabel="Add Staff"
      />

      {/* Table Section */}
      <div className="flex-grow w-full bg-white p-4 md:p-6 rounded-lg shadow-md overflow-x-auto">
        <StaffTable
          staffs={staffs}
          onRowClick={handleRowClick}
          onDeleteClick={handleDelete}
          searchTerm={searchTerm}
        />
      </div>

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={ConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete?"
        confirmLabel="Delete"
      />
    </div>
  );
};

export default StaffManagement;
