import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const AssignStaffModal = ({ isOpen, onClose, onAssign, staffMembers }) => {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [timeNeeded, setTimeNeeded] = useState(""); // State for Timeneeded

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStaff && timeNeeded) {
      // Ensure both fields are filled
      onAssign(selectedStaff, timeNeeded); // Pass both selected staff and timeNeeded
      setSelectedStaff("");
      setTimeNeeded(""); // Clear the timeNeeded field
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 md:ml-60 lg:ml-60 xl:ml-60 sm:ml-16 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 sm:p-6  max-w-sm sm:max-w-md md:max-w-xl lg:max-w-xl shadow-lg relative overflow-y-auto max-h-screen">
        <h2 className="text-lg font-bold mb-4 text-center">Assign Staff</h2>

        {/* Close icon */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="h-6 w-6" />
        </button>

        {staffMembers.length === 0 ? (
          <p className="text-red-500 text-center">
            No staff members available to assign.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="staff-select" className="block mb-2">
              Staff Name:
            </label>
            <select
              id="staff-select"
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
            >
              <option value="" disabled>
                Select a staff member
              </option>
              {staffMembers.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.Name}
                </option>
              ))}
            </select>

            <label htmlFor="time-needed" className="block mt-4 mb-2">
              Time Needed (in hours):
            </label>
            <input
              type="number"
              id="time-needed"
              value={timeNeeded}
              onChange={(e) => setTimeNeeded(e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
              required
              min="1"
            />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Assign
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignStaffModal;
