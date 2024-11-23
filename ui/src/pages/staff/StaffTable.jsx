import { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';

const StaffTable = ({ staffs, onRowClick, onDeleteClick, searchTerm }) => {
  const admin = useSelector((store) => store.auth.admin);
  const navigate = useNavigate();

  // Local state for managing staff data
  const [localStaffs, setLocalStaffs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Initialize local state with incoming props
  useEffect(() => {
    setLocalStaffs(staffs);
  }, [staffs]);

  // Filtered data based on searchTerm
  const filteredData = useMemo(
    () =>
      localStaffs.filter(
        (staff) =>
          staff.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          staff.StaffId.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [localStaffs, searchTerm]
  );

  // Handle status toggle
  const handleStatusToggle = (staffId, newStatus) => {
    const staff = localStaffs.find((staff) => staff._id === staffId);
    setSelectedStaff(staff);
    setNewStatus(newStatus);
    setIsModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedStaff) return;

    try {
      await axios.patch(
        `${API_BASE_URL}/staff/${selectedStaff._id}/Status`,
        { Status: newStatus },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );

      // Update the local state to reflect the change
      setLocalStaffs((prevStaffs) =>
        prevStaffs.map((staff) =>
          staff._id === selectedStaff._id ? { ...staff, Status: newStatus } : staff
        )
      );
      setIsModalOpen(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error updating staff status:', error);
    }
  };

  return (
    <>
      <table className="w-full text-center min-w-full">
        <thead className="border-b">
          <tr className="text-gray-600 border-b">
            <th className="py-4">#</th>
            <th className="py-4">Name</th>
            <th className="py-4">ID</th>
            <th className="py-4">Employee Type</th>
            <th className="py-4">Contact Number</th>
            <th className="py-4">Status</th>
            <th className="py-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((staff, index) => (
              <tr
                key={staff._id}
                className="border-b cursor-pointer hover:bg-gray-100"
                onClick={() => onRowClick(staff._id)}
              >
                <td className="py-4">{index + 1}</td>
                <td className="py-4">{staff.Name || 'N/A'}</td>
                <td className="py-4">{staff.StaffId || 'N/A'}</td>
                <td className="py-4">{staff.Type || 'N/A'}</td>
                <td className="py-4">{staff.Contactnumber || 'N/A'}</td>
                <td className="py-4 px-4 text-center text-xs md:text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${staff.Status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {staff.Status || 'N/A'}
                  </span>
                </td>
                <td className="py-4 flex justify-center items-center space-x-4">
                  <FaEdit
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/staffs/edit/${staff._id}`);
                    }}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(staff._id);
                    }}
                  />
                  {staff.Status === 'On Duty' ? (
                    <FaToggleOn
                      className="text-green-600 text-xl cursor-pointer hover:text-green-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(staff._id, 'Off Duty');
                      }}
                    />
                  ) : (
                    <FaToggleOff
                      className="text-red-600 text-xl cursor-pointer hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusToggle(staff._id, 'On Duty');
                      }}
                    />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-gray-500">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={`Are you sure you want to change the status of ${selectedStaff?.Name} to "${newStatus}"?`}
        confirmLabel="Confirm"
      />
    </>
  );
};

export default StaffTable;
