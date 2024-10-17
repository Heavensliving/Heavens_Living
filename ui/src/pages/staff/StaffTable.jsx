import React, { useMemo } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StaffTable = ({ staffs, onRowClick, onDeleteClick, searchTerm }) => {
  const navigate = useNavigate();

  const filteredData = useMemo(
    () =>
      staffs.filter((staff) =>
        staff.Name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [staffs, searchTerm]
  );

  return (
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
                  className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                    staff.Status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="py-4 text-gray-500">No data found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StaffTable;
