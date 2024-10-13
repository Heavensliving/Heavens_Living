import React, { useState } from 'react';
import { FaUser, FaDollarSign, FaCheckCircle, FaSignInAlt, FaSignOutAlt, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';

const StudentManagement = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Sample student data
  const initialStudents = [
    { id: 1, name: 'John Doe', joinDate: '01/01/2023', contactNumber: '9876543210', roomNo: 'A101', paymentStatus: 'Paid' },
    { id: 2, name: 'Jane Smith', joinDate: '02/01/2023', contactNumber: '1234567890', roomNo: 'B202', paymentStatus: 'Unpaid' },
  ];

  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate metrics
  const totalStudents = students.length;
  const paymentPending = students.filter(student => student.paymentStatus === 'Unpaid').length;
  const paymentCompleted = students.filter(student => student.paymentStatus === 'Paid').length;
  const checkedIn = 0;
  const checkedOut = 0;

  // Handle row click action (e.g., navigate to student details)
  const handleRowClick = (studentId) => {
    // Replace this with your desired action, such as navigating to a student details page
    navigate(`/students-details`)
  };

  const handleOpenModal = ()=> {
    setIsModalOpen(true);
  }

  const handleConfirmDelete = ()=>{
    setIsModalOpen(false);
    console.log("Deleted")
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-blue-500 p-3 rounded-full">
            <FaUser className="text-white text-xl" />
          </div>
          <div className="text-left ml-4">
            <h3 className="font-bold">Total Students</h3>
            <p className="text-2xl">{totalStudents}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-red-500 p-3 rounded-full">
            <FaDollarSign className="text-white text-xl" />
          </div>
          <div className="text-left ml-4">
            <h3 className="font-bold">Payment Pending</h3>
            <p className="text-2xl">{paymentPending}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-green-500 p-3 rounded-full">
            <FaCheckCircle className="text-white text-xl" />
          </div>
          <div className="text-left ml-4">
            <h3 className="font-bold">Payment Completed</h3>
            <p className="text-2xl">{paymentCompleted}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-yellow-500 p-3 rounded-full">
            <FaSignInAlt className="text-white text-xl" />
          </div>
          <div className="text-left ml-4">
            <h3 className="font-bold">Checked In</h3>
            <p className="text-2xl">{checkedIn}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="bg-gray-500 p-3 rounded-full">
            <FaSignOutAlt className="text-white text-xl" />
          </div>
          <div className="text-left ml-4">
            <h3 className="font-bold">Checked Out</h3>
            <p className="text-2xl">{checkedOut}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border rounded-full py-2 px-4 w-full md:w-1/2 lg:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Sorting Option and Add Student Button */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="relative">
            <select className="border rounded-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 appearance-none">
              <option value="">Sort by...</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
            <span className="absolute inset-y-0 right-1 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>

          <button 
          onClick={()=>navigate('/add-student')}
          className="bg-blue-800 text-white rounded-full py-2 px-6 hover:bg-blue-900">
            Add Student
          </button>
        </div>
      </div>

      <main className="flex-1 bg-white p-4 rounded-lg shadow overflow-x-auto">
        {/* New Section for Student Details */}
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
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student ,index) => (
                <tr 
                  key={student.id} 
                  className="border-b border-gray-300 cursor-pointer hover:bg-gray-100" 
                  onClick={() => handleRowClick(student.id)} // Make row clickable
                >
                  <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{index + 1}</td>
                  <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.name}</td>
                  <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.id}</td>
                  <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.joinDate}</td>
                  <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.contactNumber}</td>
                  <td className="py-4 px-4 text-center text-gray-700 font-medium text-xs md:text-sm">{student.roomNo}</td>
                  <td className="py-4 px-4 text-center text-xs md:text-sm">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      student.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {student.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center text-xs md:text-sm">
                    <button className="text-red-800 hover:underline" onClick={(e) => {
                      setIsModalOpen(true)
                      e.stopPropagation(); // Prevent row click
                    }}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
       {/* Delete Modal */}
       <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Detele"
        message={`Are you sure you want to delete ?`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default StudentManagement;
