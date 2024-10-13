import React, { useState } from 'react';
import { FaEllipsisH, FaTrash, FaUsers, FaCaretDown, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null); // State to control which dropdown is active
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  const staffData = [
    { name: 'John Doe', id: '#123456', type: 'Full-Time', contact: '+1 234 567 890', status: 'Active', statusColor: 'text-green-500' },
    { name: 'Jane Smith', id: '#654321', type: 'Part-Time', contact: '+1 987 654 321', status: 'Inactive', statusColor: 'text-red-500' }
  ];

  // Function to toggle dropdown visibility
  const toggleMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index); // Open or close the menu
  };

  // Function to handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtered staff data based on the search term
  const filteredData = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to navigate to the staff details page
  const handleRowClick = (id) => {
    navigate(`/staff-details`); // Navigate to staff details page with the staff ID
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col">
      {/* Staff Card */}
      <div className="w-full mb-6 flex justify-start">
        <div className="w-full sm:w-48 bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
          <div className="flex items-center">
            <FaUsers className="text-blue-600 text-2xl mr-2" />
            <div>
              <h2 className="text-lg font-semibold">Total Staffs</h2>
              <p className="text-xl font-bold">{staffData.length}</p> {/* Display total staff count */}
            </div>
          </div>
        </div>
      </div>

      {/* Top Search Bar with Buttons */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 w-full md:w-2/3 border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
        />

        {/* Buttons */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          {/* Sort Button with Dropdown Icon */}
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Sort by
            <FaCaretDown className="ml-2 text-gray-500" />
          </button>

          {/* Add Staff Button */}
          <button
            onClick={() => navigate('/add-staff')}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Add Staff
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow w-full bg-white p-4 md:p-6 rounded-lg shadow-md overflow-x-auto">
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
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(item.id)} // Navigate to details page on row click
                >
                  <td className="py-4">{index + 1}</td>
                  <td className="py-4">{item.name}</td>
                  <td className="py-4">{item.id}</td>
                  <td className="py-4">{item.type}</td>
                  <td className="py-4">{item.contact}</td>
                  <td className={`py-4 ${item.statusColor}`}>{item.status}</td>
                  <td className="py-4 flex justify-center items-center space-x-4">
                    {/* Edit Icon */}
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        console.log(`Editing ${item.name}`);
                      }}
                    />
                    {/* Delete Icon */}
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        console.log(`Deleting ${item.name}`);
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
      </div>
    </div>
  );
};

export default StaffManagement;
