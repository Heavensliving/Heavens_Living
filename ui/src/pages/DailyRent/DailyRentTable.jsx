import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const DailyRentTable = ({ dailyRents, onRowClick, onEdit, onDelete, admin }) => {
  // Function to handle disabling actions for property admins
  const isPropertyAdmin = admin.role === 'propertyAdmin';

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Contact</th>
            <th className="py-2 px-4">Room</th>
            <th className="py-2 px-4">Check In</th>
            <th className="py-2 px-4">Check Out</th>
            <th className="py-2 px-4">Rent</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dailyRents.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 py-4">
                No items found
              </td>
            </tr>
          ) : (
            dailyRents.map((dailyRent, index) => {
              // Determine if the row should be highlighted based on vacate status
              const rowClass = dailyRent.vacate ? "bg-red-100" : "hover:bg-gray-50";

              return (
                <tr
                  key={dailyRent._id}
                  className={`border-b cursor-pointer ${rowClass}`}
                  onClick={(e) => {
                    // Only allow row click for non-propertyAdmins or if vacate is false
                    if (!isPropertyAdmin) {
                      onRowClick(dailyRent._id);
                    }
                    e.stopPropagation();
                  }}
                  style={{
                    cursor: isPropertyAdmin ? 'not-allowed' : 'pointer',
                  }}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {dailyRent.name}
                    {dailyRent.vacate && (
                      <div className="text-xs text-red-600">Vacated</div>
                    )}
                  </td>
                  <td className="py-2 px-4">{dailyRent.contactNo}</td>
                  <td className="py-2 px-4">{dailyRent.roomNo}</td>
                  <td className="py-2 px-4">
                    {new Date(dailyRent.checkIn).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(dailyRent.checkOut).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{dailyRent.DailyRent}</td>
                  <td className="py-2 px-4 flex space-x-4">
                    <FaEdit
                      className={`cursor-pointer ${isPropertyAdmin ? 'text-gray-400' : 'text-blue-500'} hover:text-blue-600`}
                      onClick={(e) => {
                        if (!isPropertyAdmin) {
                          e.stopPropagation();
                          onEdit(dailyRent._id);
                        }
                      }}
                      style={{
                        cursor: isPropertyAdmin ? 'not-allowed' : 'pointer',
                      }}
                    />
                    <FaTrash
                      className={`cursor-pointer ${isPropertyAdmin ? 'text-gray-400' : 'text-red-500'} hover:text-red-600`}
                      onClick={(e) => {
                        if (!isPropertyAdmin) {
                          e.stopPropagation();
                          onDelete(dailyRent._id);
                        }
                      }}
                      style={{
                        cursor: isPropertyAdmin ? 'not-allowed' : 'pointer',
                      }}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DailyRentTable;
