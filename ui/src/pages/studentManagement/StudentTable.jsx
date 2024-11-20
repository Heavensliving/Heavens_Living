import React, { useState } from 'react';
import { FaTrash, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';

const StudentTable = ({ students, onRowClick, onDelete, onStatusChange, admin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus =
        selectedStudent.currentStatus === "checkedOut" ? "checkedIn" : "checkedOut";
      const response = await axios.patch(
        `${API_BASE_URL}/students/${selectedStudent._id}/currentStatus`,
        { currentStatus: newStatus },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      console.log(`Student ${newStatus} successfully:`, response.data);

      selectedStudent.currentStatus = newStatus;
      onStatusChange(selectedStudent._id, newStatus);
      closeModal(); // Close modal after successful action
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-white text-blue-800">
          <tr className="border-b border-gray-300">
            <th className="py-2 px-2 font-normal text-xs md:text-sm">#</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Name</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Id</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Join Date</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Contact Number</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Room No</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Payment Status</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr
                key={student._id}
                className={`border-b border-gray-300 ${student.vacate
                  ? "bg-red-100"
                  : student.currentStatus === "checkedOut"
                    ? "bg-yellow-100"
                    : ""
                  } ${admin.role === "mainAdmin" || (admin.role === "propertyAdmin" && !student.vacate) ? "cursor-pointer" : "cursor-not-allowed"}`}
                onClick={() => {
                  if (admin.role === "mainAdmin" || (admin.role === "propertyAdmin" && !student.vacate)) {
                    onRowClick(student._id);
                  }
                }}
              >
                <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {index + 1}
                </td>
                <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.name}{" "}
                  {student.vacate && (
                    <span className="text-sm text-red-600 font-bold">
                      (Vacated)
                    </span>
                  )}
                  {student.currentStatus === "checkedOut" && (
                    <span className="text-sm text-yellow-600 font-bold">
                      (Checked Out)
                    </span>
                  )}
                </td>

                <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.studentId}
                </td>
                <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {new Date(student.joinDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.contactNo}
                </td>
                <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.roomNo}
                </td>
                <td className="py-4 px-4 text-center text-xs md:text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${student.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {student.paymentStatus}
                  </span>
                </td>
                <td className="py-2 px-2 text-center text-xs md:text-sm">
                  {admin.role === "propertyAdmin" ? (
                    <>
                      {/* Status Toggle Button */}
                      <button
                        className={`hover:underline text-blue-800 ${student.vacate
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                          }`}
                        disabled={student.vacate}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(student);
                        }}
                      >
                        {student.currentStatus === "checkedOut" ? (
                          <FaSignInAlt />
                        ) : (
                          <FaSignOutAlt />
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        className={`ml-4 text-red-600 hover:underline text-red-500 ${admin.role === "mainAdmin" ? "" : student.vacate ? "text-gray-400 cursor-not-allowed" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (admin.role === "mainAdmin" || !student.vacate) onDelete(student._id);
                        }}
                        disabled={student.vacate && admin.role !== "mainAdmin"}
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <button
                      className={`text-red-600 hover:underline ${student.vacate && admin.role !== "mainAdmin" ? "text-gray-400 cursor-not-allowed" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (admin.role === "mainAdmin" || !student.vacate) onDelete(student._id);
                      }}
                      disabled={student.vacate && admin.role !== "mainAdmin"}
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleStatusToggle}
        title={`Confirm ${selectedStudent?.currentStatus === "checkedOut"
          ? "Check In"
          : "Check Out"
          }`}
        message={`Are you sure you want to ${selectedStudent?.currentStatus === "checkedOut" ? "check in" : "check out"
          } this student?`}
        confirmLabel={
          selectedStudent?.currentStatus === "checkedOut" ? "Check In" : "Check Out"
        }
      />
    </>
  );
};

export default StudentTable;
