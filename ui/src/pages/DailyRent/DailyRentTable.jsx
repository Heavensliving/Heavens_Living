import { useState } from "react";
import { FaCopy, FaDollarSign, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DailyRentTable = ({ dailyRents, onRowClick, onEdit, onDelete, admin }) => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null); // Track the copied ID

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);

    // Reset copied ID after 1.5 seconds
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isPropertyAdmin = admin.role === 'Property-Admin';
  const isMainAdmin = admin.role === 'Main-Admin';

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-left bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Name</th>
            {/* <th className="py-2 px-4 text-center">ID</th> */}
            <th className="py-2 px-4 text-center">Room</th>
            <th className="py-2 px-4 text-center">Check In</th>
            <th className="py-2 px-4 text-center">Check Out</th>
            <th className="py-2 px-4 text-center">Days</th>
            <th className="py-2 px-4 text-center">Daily Rent</th>
            <th className="py-2 px-4 text-center">Total Rent</th>
            <th className="py-2 px-4 text-center">Payment</th>
            <th className="py-2 px-4 text-center">Actions</th>
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
              const rowClass = dailyRent.vacate ? "bg-red-100 cursor-pointer hover:bg-red-200" : "cursor-pointer hover:bg-gray-50";

              const allowRowClick =
                (isPropertyAdmin && !dailyRent.vacate) || isMainAdmin;

              return (
                <tr
                  key={dailyRent._id}
                  className={`border-b ${rowClass}
                    }`}
                  onClick={(e) => {
                      e.stopPropagation();
                      onRowClick(dailyRent._id);
                  }}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {dailyRent.name}
                    {dailyRent.vacate && (
                      <div className="text-xs text-red-600">Vacated</div>
                    )}
                  </td>

                  <td className="py-2 px-4 text-center">{dailyRent.roomNo}</td>
                  <td className="py-2 px-4 text-center">
                    {new Date(dailyRent.checkIn).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">
                    {new Date(dailyRent.checkOut).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 text-center">{dailyRent.days}</td>
                  <td className="py-2 px-4 text-center">{dailyRent.DailyRent}</td>
                  <td className="py-2 px-4 text-center">{dailyRent.totalAmount}</td>
                  <td className="py-4 px-4 text-center text-xs md:text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${dailyRent.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {dailyRent.paymentStatus === "Paid"
                        ? "Paid"
                        : `Pending - ${dailyRent.totalAmount - dailyRent.payingAmount}`}
                    </span>
                  </td>
                  <td className="py-4 px-4 flex space-x-4 ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(dailyRent.OccupantId)
                        navigate('/dailyRentPayment', { state: { studentId: dailyRent.OccupantId } });
                      }}
                      className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                    >
                      <FaDollarSign />
                    </button>
                    <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600">
                      <FaEdit
                        className={` 'text-white cursor-pointer' 
                          } `}
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(dailyRent._id);
                        }}
                        
                      />
                    </button>
                    <button className="bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600">
                      <FaTrash
                        className={`${allowRowClick ? 'text-white' : 'text-gray-400'
                          }`}
                        onClick={(e) => {
                          if (allowRowClick) {
                            e.stopPropagation();
                            onDelete(dailyRent._id);
                          }
                        }}
                        style={{
                          cursor: allowRowClick ? 'pointer' : 'not-allowed',
                        }}
                      />
                    </button>

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
