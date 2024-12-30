// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
// import MetricCard from './MetricCard';
// import StudentTable from './StudentTable';
// import SearchAndSort from '../../components/reUsableComponet/SearchAndSort';
// import { FaUser, FaDollarSign, FaCheckCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
// import axios from 'axios';
// import { ref, deleteObject, getStorage } from 'firebase/storage';
// const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
// import { useSelector } from 'react-redux';
// import CheckAuth from '../auth/CheckAuth';
// // eslint-disable-next-line no-unused-vars
// import app from '../../firebase';

// const storage = getStorage();

// const StudentManagement = () => {
//   const admin = useSelector(store => store.auth.admin);
//   const navigate = useNavigate();
//   const [students, setStudents] = useState([]);
//   const [deleteStudentId, setDeleteStudentId] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortOption, setSortOption] = useState('All');
//   const [propertySort, setPropertySort] = useState(''); 
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!admin) return;
//     const fetchStudents = async () => {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/students`,
//           { headers: { 'Authorization': `Bearer ${admin.token}` } }
//         );
//         setStudents(res.data);
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching students:', error);
//         setLoading(false)
//       }
//     };
//     fetchStudents();
//   }, [admin]);

//   // Updated filtering logic to include both name and student ID
//   const filteredStudents = students.filter(student =>
//     student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) // Add this line
//   );

//   const totalStudents = students.filter(student => student.vacate == false).length;
//   const paymentPending = students.filter(student => student.paymentStatus === 'Pending' && student.vacate == false).length;
//   const paymentCompleted = students.filter(student => student.paymentStatus === 'Paid' && student.vacate == false).length;
//   const checkedIn = students.filter(student => student.currentStatus === 'checkedIn' && student.vacate == false).length;
//   const checkedOut = students.filter(student => student.currentStatus === 'checkedOut' && student.vacate == false).length;

//   const handleRowClick = (studentId) => navigate(`/students/${studentId}`);
//   const handleStatusChange = (studentId, newStatus) => {
//     setStudents((prevStudents) =>
//       prevStudents.map((student) =>
//         student._id === studentId ? { ...student, currentStatus: newStatus } : student
//       )
//     );
//   };
//   const handleDelete = (studentID) => {
//     setDeleteStudentId(studentID);
//     setIsModalOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       const studentToDelete = students.find(student => student._id === deleteStudentId);
//       const propertyId = studentToDelete.property;
//       const filePaths = [studentToDelete?.adharFrontImage, studentToDelete?.adharBackImage, studentToDelete?.photo].filter(Boolean);

//       // Delete images from Firebase Storage
//       await Promise.all(filePaths.map(async (filePath) => {
//         const imageRef = ref(storage, filePath);
//         await deleteObject(imageRef);
//       }));

//       await axios.delete(`${API_BASE_URL}/students/delete/${deleteStudentId}`, {
//         params: { propertyId },
//         headers: {
//            'Authorization': `Bearer ${admin.token}`,
//            'Role': admin.role 
//           } 
//       });
//       setStudents((prevStudents) => prevStudents.filter((student) => student._id !== deleteStudentId));

//       setIsModalOpen(false);
//       navigate('/students');
//     } catch (error) {
//       console.error("Error during deletion:", error);
//     }
//   };

//   const sortingOptions = [
//     { value: 'All', label: 'All' },
//     { value: 'Pending', label: 'Pending' },
//     { value: 'Paid', label: 'Paid' },
//     { value: 'CheckedOut', label: 'Checked Out' },  
//     { value: 'Vacated', label: 'Vacated' }          
//   ];


//   const handleSortChange = (option) => {
//     setSortOption(option);
//   };

//   const handlePropertySortChange = (e) => {
//     setPropertySort(e.target.value);
//   };

//   const sortedStudents = () => {
//     let sorted = filteredStudents;

//     if (sortOption === 'Pending') {
//       sorted = filteredStudents.filter(student => student.paymentStatus === 'Pending' && student.vacate !== true); // Exclude vacated students
//     } else if (sortOption === 'Paid') {
//       sorted = filteredStudents.filter(student => student.paymentStatus === 'Paid' && student.vacate !== true); // Exclude vacated students
//     } else if (sortOption === 'CheckedOut') {
//       sorted = filteredStudents.filter(student => student.currentStatus === 'checkedOut' && student.vacate !== true); // Only vacated students
//     } else if (sortOption === 'Vacated') {
//       sorted = filteredStudents.filter(student => student.vacate === true); // Only vacated students
//     }  else if (sortOption === 'All') {
//       sorted = filteredStudents.filter(student => student.vacate !== true); // Only vacated students
//     } else if (sortOption === 'CheckedIn') {
//       sorted = filteredStudents.filter(student => student.currentStatus === 'checkedIn' && student.vacate !== true);
//     }

//     if (propertySort) {
//       sorted = sorted.filter(student => student.pgName === propertySort);
//     }

//     return sorted;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen p-4 bg-gray-100">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
//         <MetricCard title="Total Students" value={totalStudents} icon={<FaUser />} color="bg-blue-500" onClick={() => setSortOption('All')}/>
//         <MetricCard title="Payment Pending" value={paymentPending} icon={<FaDollarSign />} color="bg-red-500" onClick={() => setSortOption('Pending')} />
//         <MetricCard title="Payment Completed" value={paymentCompleted} icon={<FaCheckCircle />} color="bg-green-500" onClick={() => setSortOption('Paid')}/>
//         <MetricCard title="Checked In" value={checkedIn} icon={<FaSignInAlt />} color="bg-yellow-500" onClick={() => setSortOption('CheckedIn')}/>
//         <MetricCard title="Checked Out" value={checkedOut} icon={<FaSignOutAlt />} color="bg-gray-500" onClick={() => setSortOption('CheckedOut')}/>
//       </div>

//       <SearchAndSort
//         searchQuery={searchQuery}
//         handleSearchChange={(e) => setSearchQuery(e.target.value)}
//         sortingOptions={sortingOptions}
//         onSortChange={handleSortChange}
//         addNewEntryPath="/add-student"
//       />

//       {/* New field for sorting by pgName */}
//       <div className="mb-4">
//         <label htmlFor="propertySort" className="block text-sm font-medium text-gray-700">Filter by Property</label>
//         <select
//           id="propertySort"
//           value={propertySort}
//           onChange={handlePropertySortChange}
//           className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//         >
//           <option value="">Select Property</option>
//           {[...new Set(students.map(student => student.pgName))].map(pgName => (
//             <option key={pgName} value={pgName}>{pgName}</option>
//           ))}
//         </select>
//       </div>

//       <main className="flex-1 bg-white p-4 rounded-lg shadow ">
//         <StudentTable students={sortedStudents()} onRowClick={handleRowClick}  onStatusChange={handleStatusChange} onDelete={handleDelete} admin={admin}/>
//       </main>

//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={confirmDelete}
//         title={
//           admin?.role === "propertyAdmin"
//             ? "Confirm Vacate"
//             : "Confirm Delete"
//         }
//         message={
//           admin?.role === "propertyAdmin"
//             ? `Are you sure you want to vacate this student?`
//             : `Are you sure you want to delete this student?`
//         }
//         confirmLabel={
//           admin?.role === "propertyAdmin"
//             ? "Vacate"
//             : "Delete"
//         }
//       />
//     </div>
//   );
// };

// export default CheckAuth(StudentManagement);


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import MetricCard from './MetricCard';
import StudentTable from './StudentTable';
import SearchAndSort from '../../components/reUsableComponet/SearchAndSort';
import { FaUser, FaDollarSign, FaCheckCircle, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { ref, deleteObject, getStorage } from 'firebase/storage';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
// eslint-disable-next-line no-unused-vars
import app from '../../firebase';

const storage = getStorage();

const StudentManagement = () => {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [sortOption, setSortOption] = useState(localStorage.getItem('sortOption') || 'All');
  const [propertySort, setPropertySort] = useState(localStorage.getItem('propertySort') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin) return;
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/students`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });
        setStudents(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [admin]);


  // Persist filter states to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('sortOption', sortOption);
    localStorage.setItem('propertySort', propertySort);
  }, [searchQuery, sortOption, propertySort]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = students.filter(student => student.vacate == false).length;
  const paymentPending = students.filter(student => student.paymentStatus === 'Pending' && student.vacate == false).length;
  const paymentCompleted = students.filter(student => student.paymentStatus === 'Paid' && student.vacate == false).length;
  const checkedIn = students.filter(student => student.currentStatus === 'checkedIn' && student.vacate == false).length;
  const checkedOut = students.filter(student => student.currentStatus === 'checkedOut' && student.vacate == false).length;

  const handleRowClick = (studentId) => navigate(`/students/${studentId}`);
  const handleStatusChange = (studentId, newStatus) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId ? { ...student, currentStatus: newStatus } : student
      )
    );
  };
  const handleDelete = (studentID) => {
    setDeleteStudentId(studentID);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const studentToDelete = students.find(student => student._id === deleteStudentId);
      const propertyId = studentToDelete.property;
      const filePaths = [studentToDelete?.adharFrontImage, studentToDelete?.adharBackImage, studentToDelete?.photo].filter(Boolean);

      // Delete images from Firebase Storage
      await Promise.all(filePaths.map(async (filePath) => {
        const imageRef = ref(storage, filePath);
        await deleteObject(imageRef);
      }));

      await axios.delete(`${API_BASE_URL}/students/delete/${deleteStudentId}`, {
        params: { propertyId },
        headers: {
          'Authorization': `Bearer ${admin.token}`,
          'Role': admin.role
        }
      });
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== deleteStudentId));

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
    { value: 'CheckedIn', label: 'Checked In' },
    { value: 'CheckedOut', label: 'Checked Out' },
    { value: 'Vacated', label: 'Vacated' },
    { value: 'Incomplete', label: 'Incomplete Profiles' }
  ];


  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handlePropertySortChange = (e) => {
    setPropertySort(e.target.value);
  };

  const sortedStudents = () => {
    let sorted = filteredStudents;

    if (sortOption === 'Pending') {
      sorted = filteredStudents.filter(student => student.paymentStatus === 'Pending' && student.vacate !== true); // Exclude vacated students
    } else if (sortOption === 'Paid') {
      sorted = filteredStudents.filter(student => student.paymentStatus === 'Paid' && student.vacate !== true); // Exclude vacated students
    } else if (sortOption === 'CheckedOut') {
      sorted = filteredStudents.filter(student => student.currentStatus === 'checkedOut' && student.vacate !== true); // Only vacated students
    } else if (sortOption === 'CheckedIn') {
      sorted = filteredStudents.filter(student => student.currentStatus === 'checkedIn' && student.vacate !== true);
    } else if (sortOption === 'Vacated') {
      sorted = filteredStudents.filter(student => student.vacate === true); // Only vacated students
    } else if (sortOption === 'All') {
      sorted = filteredStudents.filter(student => student.vacate !== true); // Only vacated students
    } else if (sortOption === 'CheckedIn') {
      sorted = filteredStudents.filter(student => student.currentStatus === 'checkedIn' && student.vacate !== true);
    } else if (sortOption === 'Incomplete') {
      sorted = filteredStudents.filter(student => student.profileCompletionPercentage != '100' && student.vacate !== true);
    }

    if (propertySort) {
      sorted = sorted.filter(student => student.pgName === propertySort);
    }

    return sorted;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Total Students" value={totalStudents} icon={<FaUser />} color="bg-blue-500" onClick={() => setSortOption('All')} />
        <MetricCard title="Payment Pending" value={paymentPending} icon={<FaDollarSign />} color="bg-red-500" onClick={() => setSortOption('Pending')} />
        <MetricCard title="Payment Completed" value={paymentCompleted} icon={<FaCheckCircle />} color="bg-green-500" onClick={() => setSortOption('Paid')} />
        <MetricCard title="Checked In" value={checkedIn} icon={<FaSignInAlt />} color="bg-yellow-500" onClick={() => setSortOption('CheckedIn')} />
        <MetricCard title="Checked Out" value={checkedOut} icon={<FaSignOutAlt />} color="bg-gray-500" onClick={() => setSortOption('CheckedOut')} />
      </div>

      <SearchAndSort
        searchQuery={searchQuery}
        handleSearchChange={(e) => setSearchQuery(e.target.value)}
        sortingOptions={sortingOptions}
        onSortChange={handleSortChange}
        addNewEntryPath="/add-student"
        currentSortLabel={sortOption}  // Dynamically pass the current sorting option
      />

      {/* New field for sorting by pgName */}
      <div className="mb-4">
        <label htmlFor="propertySort" className="block text-sm font-medium text-gray-700">Filter by Property</label>
        <select
          id="propertySort"
          value={propertySort}
          onChange={handlePropertySortChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">Select Property</option>
          {[...new Set(students.map(student => student.pgName))].map(pgName => (
            <option key={pgName} value={pgName}>{pgName}</option>
          ))}
        </select>
      </div>

      <main className="flex-1 bg-white p-4 rounded-lg shadow ">
        <StudentTable students={sortedStudents()} onRowClick={handleRowClick} onStatusChange={handleStatusChange} onDelete={handleDelete} admin={admin} />
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={
          admin?.role === "Property-Admin"
            ? "Confirm Vacate"
            : "Confirm Delete"
        }
        message={
          admin?.role === "Property-Admin"
            ? `Are you sure you want to vacate this student?`
            : `Are you sure you want to delete this student?`
        }
        confirmLabel={
          admin?.role === "Property-Admin"
            ? "Vacate"
            : "Delete"
        }
      />
    </div>
  );
};

export default CheckAuth(StudentManagement);
