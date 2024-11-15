import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import API_BASE_URL from "../../config";
import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject, getStorage } from 'firebase/storage';
import app from '../../firebase';
import { useSelector } from "react-redux";

const storage = getStorage();

const DailyRentPage = () => {
  const admin = useSelector(store => store.auth.admin);
  const [dailyRents, setDailyRents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRentId, setSelectedRentId] = useState(null);
  const navigate = useNavigate();

  const fetchDailyRents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/DailyRent`,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      setDailyRents(response.data);
    } catch (error) {
      console.error("Error fetching daily rents:", error);
    }
  };

  const handleEdit = (id) => {
    alert(`Edit DailyRent with ID: ${id}`);
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

      await axios.delete(`${API_BASE_URL}/DailyRent/delete/${selectedRentId}`,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      fetchDailyRents();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting daily rent:", error);
    }
  };

  const filteredDailyRents = dailyRents.filter((dailyRent) =>
    dailyRent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDailyRents();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/dailyRent/${id}`);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-6">Daily Rent Management</h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={() => navigate("/AddDailyRent")}
        >
          Add People
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4">#</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Contact No</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Daily Rent</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDailyRents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No items found
                </td>
              </tr>
            ) : (
              filteredDailyRents.map((dailyRent, index) => (
                <tr key={dailyRent._id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(dailyRent._id)}>
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{dailyRent.name}</td>
                  <td className="py-2 px-4">{dailyRent.contactNo}</td>
                  <td className="py-2 px-4">{dailyRent.email}</td>
                  <td className="py-2 px-4">{dailyRent.address}</td>
                  <td className="py-2 px-4">{dailyRent.DailyRent}</td>
                  <td className="py-2 px-4 flex space-x-4">
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dailyRent/edit/${dailyRent._id}`);
                      }}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(dailyRent._id);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={ConfirmDeleteDailyRent}
        title="Confirm Delete"
        message={`Are you sure you want to delete this branch?`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default DailyRentPage;
