import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // FontAwesome icons
import API_BASE_URL from "../../config";
import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";
import { useNavigate } from "react-router-dom";

const DailyRentPage = () => {
  const [dailyRents, setDailyRents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedRentId, setSelectedRentId] = useState(null); // Selected rent ID for deletion
  const navigate = useNavigate();

  // Fetch all DailyRents
  const fetchDailyRents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/DailyRent`);
      setDailyRents(response.data);
    } catch (error) {
      console.error("Error fetching daily rents:", error);
    }
  };

  // Edit DailyRent
  const handleEdit = (id) => {
    alert(`Edit DailyRent with ID: ${id}`);
    // You can redirect to the edit page if you have one
    // navigate(`/editDailyRent/${id}`);
  };

  // Open Delete Confirmation Modal
  const handleDelete = (id) => {
    setSelectedRentId(id);
    setIsModalOpen(true);
  };

  // Confirm Delete Action
  const ConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/DailyRent/delete/${selectedRentId}`);
      fetchDailyRents(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting daily rent:", error);
    }
    setIsModalOpen(false); // Close the modal after deletion
  };

  // Search filter for dailyRents
  const filteredDailyRents = dailyRents.filter((dailyRent) =>
    dailyRent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchDailyRents();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-6">Daily Rent Management</h1>

      {/* Search Bar */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 px-4 py-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Add People Button */}
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          onClick={() => navigate("/AddDailyRent")} // Corrected typo: naviagate -> navigate
        >
          Add People
        </button>
      </div>

      {/* Display DailyRent entries in a table */}
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
            {filteredDailyRents.map((dailyRent, index) => (
              <tr key={dailyRent._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{dailyRent.name}</td>
                <td className="py-2 px-4">{dailyRent.contactNo}</td>
                <td className="py-2 px-4">{dailyRent.email}</td>
                <td className="py-2 px-4">{dailyRent.address}</td>
                <td className="py-2 px-4">{dailyRent.DailyRent}</td>
                <td className="py-2 px-4 flex space-x-4">
                  <FaEdit
                    className="text-blue-500 cursor-pointer hover:text-blue-700"
                    onClick={() => handleEdit(dailyRent._id)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer hover:text-red-700"
                    onClick={() => handleDelete(dailyRent._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Deleting */}
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
};

export default DailyRentPage;
