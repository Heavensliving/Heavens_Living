import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ref, deleteObject, getStorage } from "firebase/storage";
import app from "../../firebase";
import { useSelector } from "react-redux";
import DailyRentTable from "./DailyRentTable"; // Import the new table component
import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";
const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
import CheckAuth from "../auth/CheckAuth";

const storage = getStorage();

const DailyRentPage = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [dailyRents, setDailyRents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRentId, setSelectedRentId] = useState(null);
  const navigate = useNavigate();

  const fetchDailyRents = async () => {
    if (!admin) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/DailyRent`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      setDailyRents(response.data);
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

  const filteredDailyRents = dailyRents.filter((dailyRent) =>
    dailyRent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`/dailyRent/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/dailyRent/edit/${id}`);
  };

  useEffect(() => {
    fetchDailyRents();
  }, []);

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
          className="bg-side-bar text-white py-2 px-4 rounded hover:bg-[#373082]"
          onClick={() => navigate("/AddDailyRent")}
        >
          Add People
        </button>
      </div>

      <DailyRentTable
        dailyRents={filteredDailyRents}
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
          admin?.role === "propertyAdmin"
            ? "Confirm Vacate"
            : "Confirm Delete"
        }
        message={
          admin?.role === "propertyAdmin"
            ? `Are you sure you want to vacate this student?`
            : `Are you sure you want to delete this student?`
        }
        confirmLabel={
          admin?.role === "propertyAdmin"
            ? "Vacate"
            : "Delete"
        }
      />
    </div>
  );
};

export default CheckAuth(DailyRentPage);
