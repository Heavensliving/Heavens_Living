import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const DailyRentTable = ({ dailyRents, onRowClick, onEdit, onDelete, admin }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Contact No</th>
            <th className="py-2 px-4">Room No</th>
            <th className="py-2 px-4">Check In Date</th>
            <th className="py-2 px-4">Check Out Date</th>
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
              // Property Admin: Show only rows where vacate is false
              if (admin.role === "propertyAdmin" && dailyRent.vacate === true) {
                return null;
              }

              // Main Admin: Show all rows, highlight vacated rows in red
              return (
                <tr
                  key={dailyRent._id}
                  className={`border-b cursor-pointer ${
                    admin.role === "mainAdmin" && dailyRent.vacate
                      ? "bg-red-100 hover:bg-red-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => onRowClick(dailyRent._id)}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {dailyRent.name}
                    {admin.role === "mainAdmin" && dailyRent.vacate && (
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
                      className="text-blue-500 cursor-pointer hover:text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(dailyRent._id);
                      }}
                    />
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(dailyRent._id);
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
