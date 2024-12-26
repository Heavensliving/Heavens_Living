import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject, getStorage } from "firebase/storage";
import app from "../../firebase";
import { useSelector } from "react-redux";
import DailyRentTable from "./DailyRentTable"; // Import the new table component
import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from "../auth/CheckAuth";
import SearchAndSort from "../../components/reUsableComponet/SearchAndSort";
import MetricCard from "../studentManagement/MetricCard";
import { FaCheckCircle, FaDollarSign, FaUser } from "react-icons/fa";

const storage = getStorage();

const DailyRentPage = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [dailyRents, setDailyRents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertySort, setPropertySort] = useState('');
  const [selectedRentId, setSelectedRentId] = useState(null);
  const navigate = useNavigate();

  const fetchDailyRents = async () => {
    if (!admin) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/DailyRent`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setDailyRents(response.data.reverse());
    } catch (error) {
      console.error("Error fetching daily rents:", error);
    }
  };

  const handleDelete = (id) => {
    setSelectedRentId(id);
    setIsModalOpen(true);
  };

  const ConfirmDeleteDailyRent = async () => {
    try {
      const rentToDelete = dailyRents.find((rent) => rent._id === selectedRentId);
      if (!rentToDelete) return;

      const filePaths = [
        rentToDelete?.adharFrontImage,
        rentToDelete?.adharBackImage,
        rentToDelete?.photo,
      ].filter(Boolean);

      for (const filePath of filePaths) {
        const imageRef = ref(storage, filePath);
        try {
          await deleteObject(imageRef);
          console.log(`Successfully deleted file: ${filePath}`);
        } catch (firebaseError) {
          console.error(`Error deleting file from Firebase: ${filePath}`, firebaseError);
        }
      }

      await axios.delete(`${API_BASE_URL}/DailyRent/delete/${selectedRentId}`, {
        headers: {
          'Authorization': `Bearer ${admin.token}`,
          'Role': admin.role
        }
      });
      fetchDailyRents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting daily rent:", error);
    }
  };

   const filteredStudents = dailyRents.filter(dailyRent =>
    dailyRent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDailyRenters = dailyRents.filter(dailyRent => dailyRent.vacate == false).length;
  const paymentPending = dailyRents.filter(dailyRent => dailyRent.paymentStatus === 'Pending' && dailyRent.vacate == false).length;
  const paymentCompleted = dailyRents.filter(dailyRent => dailyRent.paymentStatus === 'Paid' && dailyRent.vacate == false).length;

  const handleRowClick = (id) => {
    navigate(`/dailyRent/${id}`);
  };

  const sortingOptions = [
    { value: 'All', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Vacated', label: 'Vacated' }          
  ];

  const handlePropertySortChange = (e) => {
    setPropertySort(e.target.value);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleEdit = (id) => {
    navigate(`/dailyRent/edit/${id}`);
  };

  useEffect(() => {
    fetchDailyRents();
  }, []);

  const sortedStudents = () => {
    let sorted = filteredStudents;

    if (sortOption === 'Pending') {
      sorted = filteredStudents.filter(student => student.paymentStatus === 'Pending' && student.vacate !== true); // Exclude vacated students
    } else if (sortOption === 'Paid') {
      sorted = filteredStudents.filter(student => student.paymentStatus === 'Paid' && student.vacate !== true); // Exclude vacated students
    } else if (sortOption === 'CheckedOut') {
      sorted = filteredStudents.filter(student => student.currentStatus === 'checkedOut' && student.vacate !== true); // Only vacated students
    } else if (sortOption === 'Vacated') {
      sorted = filteredStudents.filter(student => student.vacate === true); // Only vacated students
    } else if (sortOption === 'All') {
      sorted = filteredStudents.filter(student => student.vacate !== true);
    }

    if (propertySort) {
      sorted = sorted.filter(student => student.pgName === propertySort);
    }

    return sorted;
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6 mt-6">
        <MetricCard title="Total Daily Renters" value={totalDailyRenters} icon={<FaUser />} color="bg-blue-500" onClick={() => setSortOption('All')}/>
        <MetricCard title="Payment Pending" value={paymentPending} icon={<FaDollarSign />} color="bg-red-500" onClick={() => setSortOption('Pending')} />
        <MetricCard title="Payment Completed" value={paymentCompleted} icon={<FaCheckCircle />} color="bg-green-500" onClick={() => setSortOption('Paid')}/>
      </div>

      <SearchAndSort
        searchQuery={searchQuery}
        handleSearchChange={(e) => setSearchQuery(e.target.value)}
        sortingOptions={sortingOptions}
        onSortChange={handleSortChange}
        addNewEntryPath="/AddDailyRent"
      />

      {/* New field for sorting by pgName */}
      <div className="mb-4">
        <label htmlFor="propertySort" className="block text-sm font-medium text-gray-700">Filter by Property</label>
        <select
          id="propertySort"
          value={propertySort}
          onChange={handlePropertySortChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Property</option>
          {[...new Set(dailyRents.map(dailyRent => dailyRent.pgName))].map(pgName => (
            <option key={pgName} value={pgName}>{pgName}</option>
          ))}
        </select>
      </div>

      <DailyRentTable
        dailyRents={sortedStudents()}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
        admin={admin}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={ConfirmDeleteDailyRent}
        title={
          admin?.role === "Property-Admin"
            ? "Confirm Vacate"
            : "Confirm Delete"
        }
        message={
          admin?.role === "Property-Admin"
            ? `Are you sure you want to vacate this rent person?`
            : `Are you sure you want to delete this rent person?`
        }
        confirmLabel={
          admin?.role === "Property-Admin"
            ? "Vacate"
            : "Delete"
        }
      />
    </div>
  );
};

export default CheckAuth(DailyRentPage);
