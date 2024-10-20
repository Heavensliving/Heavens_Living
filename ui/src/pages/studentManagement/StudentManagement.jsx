import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import MetricCard from './MetricCard';
import StudentTable from './StudentTable';
import SearchAndSort from '../../components/reUsableComponet/SearchAndSort';
import { FaUser, FaDollarSign, FaCheckCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import app from '../../firebase';
import { ref, deleteObject, getStorage } from 'firebase/storage';
import API_BASE_URL from '../../config';

const storage = getStorage();

const StudentManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('All'); // Default to "All"

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/students`);
        setStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = students.length;
  const paymentPending = students.filter(student => student.paymentStatus === 'Pending').length;
  const paymentCompleted = students.filter(student => student.paymentStatus === 'Paid').length;
  const checkedIn = students.filter(student => student.currentStatus === 'checkedIn').length;
  const checkedOut = students.filter(student => student.currentStatus === 'vacated').length;

  const handleRowClick = (studentId) => navigate(`/students/${studentId}`);

  const handleDelete = (studentID) => {
    setDeleteStudentId(studentID);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const studentToDelete = students.find(student => student._id === deleteStudentId);
      const propertyId = studentToDelete.property
      const filePaths = [studentToDelete?.adharFrontImage, studentToDelete?.adharBackImage, studentToDelete?.photo].filter(Boolean);

      // Delete images from Firebase Storage
      await Promise.all(filePaths.map(async (filePath) => {
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      }));

      // Delete student record from the database
      await axios.delete(`${API_BASE_URL}/students/delete/${deleteStudentId}`, {
        params: { propertyId } // Pass propertyId as query parameter
      });
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== deleteStudentId));

      // Close modal
      setIsModalOpen(false);
      navigate('/students');
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const sortingOptions = [
    { value: 'All', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
  ];

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortedStudents = () => {
    let sorted = filteredStudents;

    // Filter based on paymentStatus
    if (sortOption === 'Pending') {
      sorted = filteredStudents.filter(student => student.paymentStatus === 'Pending');
    } else if (sortOption === 'Paid') {
      sorted = filteredStudents.filter(student => student.paymentStatus === 'Paid');
    }

    // Return the sorted or filtered list
    return sorted;
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Total Students" value={totalStudents} icon={<FaUser />} color="bg-blue-500" />
        <MetricCard title="Payment Pending" value={paymentPending} icon={<FaDollarSign />} color="bg-red-500" />
        <MetricCard title="Payment Completed" value={paymentCompleted} icon={<FaCheckCircle />} color="bg-green-500" />
        <MetricCard title="Checked In" value={checkedIn} icon={<FaSignInAlt />} color="bg-yellow-500" />
        <MetricCard title="Checked Out" value={checkedOut} icon={<FaSignOutAlt />} color="bg-gray-500" />
      </div>

      <SearchAndSort
        searchQuery={searchQuery}
        handleSearchChange={(e) => setSearchQuery(e.target.value)}
        sortingOptions={sortingOptions}
        onSortChange={handleSortChange}
        addNewEntryPath="/add-student"
      />

      <main className="flex-1 bg-white p-4 rounded-lg shadow overflow-x-auto">
        <StudentTable students={sortedStudents()} onRowClick={handleRowClick} onDelete={handleDelete} />
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this student?`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default StudentManagement;
