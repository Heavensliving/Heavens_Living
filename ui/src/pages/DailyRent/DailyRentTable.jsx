import { FaEdit, FaTrash } from "react-icons/fa";
const DailyRentTable = ({ dailyRents, onRowClick, onEdit, onDelete, admin }) => {
  const isPropertyAdmin = admin.role === 'propertyAdmin';
  const isMainAdmin = admin.role === 'mainAdmin';

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
              const rowClass = dailyRent.vacate ? "bg-red-100" : "hover:bg-gray-50";

              const allowRowClick =
                (isPropertyAdmin && !dailyRent.vacate) || isMainAdmin;

              return (
                <tr
                  key={dailyRent._id}
                  className={`border-b ${rowClass} ${
                    allowRowClick ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (allowRowClick) {
                      e.stopPropagation();
                      onRowClick(dailyRent._id);
                    }
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
                      className={`${
                        allowRowClick ? 'text-blue-500' : 'text-gray-400'
                      } hover:text-blue-600`}
                      onClick={(e) => {
                        if (allowRowClick) {
                          e.stopPropagation();
                          onEdit(dailyRent._id);
                        }
                      }}
                      style={{
                        cursor: allowRowClick ? 'pointer' : 'not-allowed',
                      }}
                    />
                    <FaTrash
                      className={`${
                        allowRowClick ? 'text-red-500' : 'text-gray-400'
                      } hover:text-red-600`}
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
