/* eslint-disable react/prop-types */
import { useState } from 'react';
import { FaTrash, FaSignOutAlt, FaSignInAlt, FaDollarSign, FaDownload } from 'react-icons/fa';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";


const StudentTable = ({ students, onRowClick, onDelete, onStatusChange, admin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

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
      // console.log(`Student ${newStatus} successfully:`, response.data);

      selectedStudent.currentStatus = newStatus;
      onStatusChange(selectedStudent._id, newStatus);
      closeModal(); // Close modal after successful action
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };


  const downloadPDF = (students) => {
    const doc = new jsPDF();

    // Set font and size for the title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    // Calculate center position for the title
    const title = "Residents Details";
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getTextWidth(title);
    const xPosition = (pageWidth - textWidth) / 2;

    // Add centered title
    doc.text(title, xPosition, 20); // Adjusted Y position to make room for the table

    // Prepare table data
    const tableData = students.map((student, index) => [
      index + 1,
      student.name,
      student.contactNo,
      student.roomNo,
      new Date(student.joinDate).toISOString().slice(0, 10).split('-').reverse().join('-'),
      student.monthlyRent,
      student.paymentStatus,
    ]);

    doc.autoTable({
      startY: 30,
      head: [["#", "Name", "Contact", "Room", "Join Date", "Monthly Rent", "Payment Status"]],
      body: tableData,
      theme: "grid",
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
      },
    });

    // Save the PDF
    doc.save("Flora_Inn.pdf");
  };

  return (
    <>
      <div className="flex justify-center my-2">
        <button
          onClick={() => downloadPDF(students)}
          className="bg-side-bar text-white px-3 py-1 rounded hover:bg-[#373082] flex items-center"
        >
          <FaDownload className="mr-2" /> Download PDF
        </button>
      </div>
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-white text-blue-800">
          <tr className="border-b border-gray-300">
            <th className="py-2 px-2 font-normal text-xs md:text-sm">#</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm text-start">Name</th>
            {/* <th className="py-2 px-2 font-normal text-xs md:text-sm">ID</th> */}
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Contact</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Join Date</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Room</th>
            <th className="py-2 px-2 font-normal text-xs md:text-sm">Payment</th>
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
                className={`border-b border-gray-300 cursor-pointer ${student.vacate
                  ? "bg-red-100"
                  : student.currentStatus === "checkedOut"
                    ? "bg-yellow-100"
                    : ""
                  }`}
                onClick={() => {
                  onRowClick(student._id);
                }}
              >
                <td className="py-2 px-2 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {index + 1}
                </td>
                <td className="py-2 px-2 text-gray-700 font-medium text-xs md:text-sm text-start">
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
                {/* <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.studentId}
                </td> */}
                <td className="py-2 px-2 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.contactNo}
                </td>
                <td className="py-2 px-2 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {new Date(student.joinDate).toISOString().slice(0, 10).split('-').reverse().join('-')}
                </td>
                <td className="py-2 px-2 text-center text-gray-700 font-medium text-xs md:text-sm">
                  {student.roomNo}
                </td>
                <td className="py-2 px-2 text-center text-xs md:text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${student.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {student.paymentStatus}
                  </span>
                </td>
                <td className="py-6 px-2 text-center text-xs md:text-sm flex space-x-2 justify-center">
                  {admin.role === "Property-Admin" ? (
                    <>
                      {/* Status Toggle Button */}
                      <button
                        className={`bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded text-blue-800 ${student.vacate
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const numericId = student.studentId.replace(/[A-Za-z]/g, ''); // Extract numeric part
                          navigate('/feePayment', { state: { studentId: numericId } });
                        }}
                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                      >
                        <FaDollarSign />
                      </button>

                      {/* Delete Button */}
                      <button
                        className={`bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded ${admin.role === "Main-Admin" ? "" : student.vacate ? "text-gray-400 cursor-not-allowed" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (admin.role === "Main-Admin" || !student.vacate) onDelete(student._id);
                        }}
                        disabled={student.vacate && admin.role !== "Main-Admin"}
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Make Payment Button */}
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/feePayment'); // Call your payment function with studentId
                        }}
                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                      >
                        <FaDollarSign />
                      </button> */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const numericId = student.studentId.replace(/[A-Za-z]/g, ''); // Extract numeric part
                          navigate('/feePayment', { state: { studentId: numericId } });
                        }}
                        className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                      >
                        <FaDollarSign />
                      </button>


                      {/* Delete Button */}
                      <button
                        className={`bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded ${student.vacate && admin.role !== "Main-Admin" ? "text-gray-400 cursor-not-allowed" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (admin.role === "Main-Admin" || !student.vacate) onDelete(student._id);
                        }}
                        disabled={student.vacate && admin.role !== "Main-Admin"}
                      >
                        <FaTrash />
                      </button>
                    </>
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
