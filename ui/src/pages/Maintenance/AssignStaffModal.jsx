import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AssignStaffModal = ({ isOpen, onClose, onAssign, staffMembers }) => {
  const [selectedStaff, setSelectedStaff] = useState('');

  const handleSubmit = (e) => {
    console.log(onAssign)
    e.preventDefault();
    if (selectedStaff) {
      onAssign(selectedStaff); 
      setSelectedStaff(''); 
      onClose(); 
    }
  };

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-1/3 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Assign Staff</h2>
        {staffMembers.length === 0 ? ( 
          <p className="text-red-500">No staff members available to assign.</p>
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
              <option value="" disabled>Select a staff member</option>
              {staffMembers.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.Name} 
                </option>
              ))}
            </select>
            <div className="flex justify-end mt-4">
              <button type="button" className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
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


