// StudentTable.js
import React from 'react';
import { FaTrash } from 'react-icons/fa';

const StudentTable = ({ students, onRowClick, onDelete }) => {
  return (
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
            <td colSpan="8" className="py-4 text-center text-gray-500">No data found</td>
          </tr>
        ) : (
          students.map((student, index) => (
            <tr key={student._id} className="border-b border-gray-300 cursor-pointer hover:bg-gray-100" onClick={() => onRowClick(student._id)}>
              <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{index + 1}</td>
              <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.name}</td>
              <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.studentId}</td>
              <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{new Date(student.joinDate).toLocaleDateString()}</td>
              <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.contactNo}</td>
              <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.roomNo}</td>
              <td className="py-4 px-4 text-center text-xs md:text-sm">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${student.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {student.paymentStatus}
                </span>
              </td>
              <td className="py-2 px-2 text-center text-xs md:text-sm">
                <button className="text-red-600 hover:underline" onClick={(e) => {
                  onDelete(student._id);
                  e.stopPropagation();
                }}>
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default StudentTable;
