import { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import { ref, deleteObject, getStorage } from 'firebase/storage';
import StaffTable from './StaffTable';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import SearchAndSort from '../../components/reUsableComponet/SearchAndSort';
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

// eslint-disable-next-line no-unused-vars
import app from '../../firebase'; 

const storage = getStorage();

const useStaffData = () => {
  const [staffs, setStaffs] = useState([]);
  const [originalStaffs, setOriginalStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let admin = useSelector(store => store.auth.admin);

  useEffect(() => {
    if (!admin) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/staff`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
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
  let admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const { staffs, setStaffs, originalStaffs, loading, error } = useStaffData();

  const [deleteStaffId, setDeleteStaffId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [propertySort, setPropertySort] = useState(localStorage.getItem('propertySort') || '');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'All');

  useEffect(() => {
    // Apply saved filters from local storage on initial load
    const applySavedFilters = () => {
      let filteredStaffs = originalStaffs;
  
      if (searchQuery) {
        filteredStaffs = filteredStaffs.filter(staff =>
          staff.Name && staff.Name.toLowerCase().includes(searchQuery.trimStart().toLowerCase())
        );
      }
  
      if (propertySort) {
        filteredStaffs = filteredStaffs.filter(staff => staff.property === propertySort);
      }
  
      if (sortOption !== 'All') {
        filteredStaffs = filteredStaffs.filter(staff => staff.Status === sortOption);
      }
  
      setStaffs(filteredStaffs);
    };
  
    applySavedFilters();
  }, [originalStaffs, searchQuery, propertySort, sortOption]);
  
  const handleRowClick = (id) => {
    // Save selected staff ID to local storage before navigation
    localStorage.setItem('selectedStaffId', id);
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
      const propertyId = staffToDelete.property;
      const filePaths = [
        staffToDelete?.Adharfrontside,
        staffToDelete?.Adharbackside,
        staffToDelete?.Photo,
      ].filter(Boolean);

      // Delete files from Firebase Storage
      for (const filePath of filePaths) {
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      }

      // Delete staff record from the database
      await axios.delete(`${API_BASE_URL}/staff/delete/${deleteStaffId}`, {
        params: { propertyId },
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      setStaffs(prevStaffs => prevStaffs.filter(staff => staff._id !== deleteStaffId));

      setIsModalOpen(false);
      navigate('/staffs');
    } catch (error) {
      console.error('Error during deletion:', error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    localStorage.setItem('searchQuery', value);
  };

  const onSortChange = (sortValue) => {
    setSortOption(sortValue);
    localStorage.setItem('sortOption', sortValue);

    if (sortValue === 'All') {
      setStaffs(originalStaffs);
    } else {
      const filteredStaffs = originalStaffs.filter(staff => staff.Status === sortValue);
      setStaffs(filteredStaffs);
    }
  };

  const handlePropertySortChange = (e) => {
    const selectedProperty = e.target.value;
    setPropertySort(selectedProperty);
    localStorage.setItem('propertySort', selectedProperty);

    if (selectedProperty === '') {
      setStaffs(originalStaffs);
    } else {
      const filteredStaffs = originalStaffs.filter(staff => staff.property === selectedProperty);
      setStaffs(filteredStaffs);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col">
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

      <SearchAndSort
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        sortingOptions={[
          { value: 'All', label: 'All' },
          { value: 'On Duty', label: 'On Duty' },
          { value: 'Off Duty', label: 'Off Duty' },
        ]}
        onSortChange={onSortChange}
        addNewEntryPath="/add-staff"
        addButtonLabel="Add Staff"
        currentSortLabel={sortOption}
      />

      <div className="mb-4">
        <label htmlFor="propertySort" className="block text-sm font-medium text-gray-700">
          Filter by Property
        </label>
        <select
          id="propertySort"
          value={propertySort}
          onChange={handlePropertySortChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Property</option>
          {[...new Set(originalStaffs.map(staff => staff.property))].map(propertyId => {
            const property = originalStaffs.find(staff => staff.property === propertyId);
            return (
              <option key={propertyId} value={propertyId}>
                {property?.propertyName || propertyId}
              </option>
            );
          })}
        </select>
      </div>

      <div className="flex-grow w-full bg-white p-4 md:p-6 rounded-lg shadow-md overflow-x-auto">
        <StaffTable
          staffs={staffs}
          onRowClick={handleRowClick}
          onDeleteClick={handleDelete}
          searchQuery={searchQuery}
        />
      </div>

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

export default CheckAuth(StaffManagement);
