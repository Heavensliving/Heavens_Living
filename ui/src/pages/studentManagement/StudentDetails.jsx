import React, { useState, useRef, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBook, FaHeartbeat, FaCalendarAlt, FaUser, FaBed, FaDoorOpen, FaEllipsisH } from 'react-icons/fa'; // Importing icons
import DetailCard from './DetailCard'; // Import the DetailCard component
import TransactionDetails from './TransactionDetails';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import { useParams } from 'react-router-dom';

const StudentDetails = () => {
  const { studentId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [warnings, setWarnings] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [slideIn, setSlideIn] = useState(false); // State for sliding effect
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const student = {
  //   name: 'John Doe',
  //   id: 'HVNS22001',
  //   profileImage: 'https://img.freepik.com/free-vector/back-school-sketch-college-student-holding-bag-isolated-white-background_460848-14630.jpg?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid',
  //   location: 'New York, USA',
  //   address: '1234 Elm Street, Apt 567',
  //   phone: '+1 9876543210',
  //   email: 'john.doe@example.com',
  //   course: 'Computer Science',
  //   gender: 'Male',
  //   bloodGroup: 'O+',
  //   dob: '16/08/2002',
  //   college: 'XYZ University',
  //   yearOfStudy: '1st year',
  //   idProofs: [
  //     { type: 'Passport', image: 'https://img.freepik.com/free-vector/driver-license-illustration_1284-5032.jpg?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid' },
  //     { type: 'Driver’s License', image: 'https://img.freepik.com/free-vector/abstract-id-cards-template-with-photo_23-2148671196.jpg?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid' }
  //   ]
  // };

  // Array of detail items
  const details = [
    { label: 'Address', icon: FaMapMarkerAlt, detail: student.address },
    { label: 'Email', icon: FaEnvelope, detail: student.email },
    { label: 'Phone', icon: FaPhone, detail: student.phone },
    { label: 'DOB', icon: FaCalendarAlt, detail: student.dob },
    { label: 'College', icon: FaBook, detail: student.college },
    { label: 'Course', icon: FaBook, detail: student.course },
    { label: 'Year of Study', icon: FaBook, detail: student.yearOfStudy },
    { label: 'Blood Group', icon: FaHeartbeat, detail: student.bloodGroup },
  ];

  const parent = {
    name: 'Jane Doe',
    phone: '+1 1234567890',
    occupation: 'Engineer',
  };

  const parentDetails = [
    { label: 'Parent Name', icon: FaUser, detail: parent.name },
    { label: 'Parent Phone', icon: FaPhone, detail: parent.phone },
    { label: 'Parent Occupation', icon: FaBook, detail: parent.occupation },
  ];

  const stayDetails = {
    stayType: 'Hostel',
    roomType: 'Four Sharing',
    joinDate: '12/08/2023',
  };

  const stayDetailItems = [
    { label: 'Stay Type', icon: FaBed, detail: stayDetails.stayType },
    { label: 'Room Type', icon: FaDoorOpen, detail: stayDetails.roomType },
    { label: 'Join Date', icon: FaCalendarAlt, detail: stayDetails.joinDate },
  ];

  // Example transactions
  const transactions = [
    { id: 'TXN001', date: '01/10/2024', amount: 150, status: 'Paid', details: 'Payment for course materials' },
    { id: 'TXN002', date: '02/10/2024', amount: 200, status: 'Pending', details: 'Payment for tuition fee' },
    { id: 'TXN003', date: '01/10/2024', amount: 150, status: 'Failed', details: 'Payment for course materials' },
    { id: 'TXN004', date: '02/10/2024', amount: 200, status: 'Paid', details: 'Payment for tuition fee' },
    { id: 'TXN005', date: '01/10/2024', amount: 150, status: 'Pending', details: 'Payment for course materials' },
    { id: 'TXN006', date: '02/10/2024', amount: 200, status: 'Failed', details: 'Payment for tuition fee' }
  ];

   useEffect(() => {
        if (user?.token) {
            axios.get(`${API_BASE_URL}/movie/` + movieId, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            }).then(res => { setMovie(res.data) })
                .catch(err => console.log(err));
        }
    }, [user?.token, movieId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to handle transaction click
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setSlideIn(true);
    setIsTransactionOpen(true);
  };

  // Function to handle closing modal when clicking outside the image
  const handleModalClick = (e) => {
    if (e.target.id === 'modalBackground') {
      setIsModalOpen(false);
    }
  };

  // Function to open modal with selected image
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    // Attach event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenWarning = () => {
    setIsWarningModalOpen(true);
  }

  const handleConfirmWarning = () => {
    if (warnings < 3) {
      setWarnings(warnings + 1);
      setIsWarningModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Full-width Box */}
      <div className="bg-white shadow-lg rounded-xl mb-6 w-full max-w-screen-xl">
        <div className="relative">
          {/* Top 30% Background Color */}
          <div className="absolute inset-x-0 top-0 h-24 bg-side-bar rounded-t-lg" />

          {/* Profile Section */}
          <div className="flex justify-between items-center relative z-10 p-6">
            <div className="flex-shrink-0">
              <img
                src={student.profileImage}
                alt={student.name}
                className="w-32 h-32 rounded-full border-4 border-white cursor-pointer"
                onClick={() => handleImageClick(student.profileImage)}
              />
              <div className="mt-4 text-start">
                <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                {warnings === 1 && <span className="text-red-500 text-sm">1 Warning</span>}
                {warnings === 2 && <span className="text-yellow-500 text-sm">2 Warnings</span>}
                {warnings === 3 && <span className="text-black text-sm">Blacklisted</span>}
                <p className="text-gray-500">{student.id}</p>
              </div>
            </div>

            {/* Transaction History Section */}
            <div className="flex items-center space-x-8 relative mt-28 mr-5">
              <h2 className="text-lg font-bold text-gray-800 cursor-pointer" onClick={() => handleTransactionClick(transactions)}>Transaction History</h2>
              <FaEllipsisH
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={toggleDropdown} // Toggle dropdown on click
              />
              
              {/* Dropdown Menu for Options */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef} // Attach the ref to the dropdown
                  className="absolute top-5 right-0 mt-2 bg-white shadow-lg rounded-md z-20"
                >
                  <button onClick={() => console.log('Edit Student Details')} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Edit
                  </button>
                  <button onClick={handleOpenWarning} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                    Issue Warning
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* General Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-screen-xl p-4">
          {details.map((item, index) => (
            <DetailCard key={index} label={item.label} icon={item.icon} detail={item.detail} />
          ))}
        </div>

        {/* ID Proof Section */}
        <h2 className="text-lg font-bold text-gray-800 p-5">ID Proofs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-5">
          {student.idProofs.map((idProof, index) => (
            <div
              key={index}
              className="p-5 bg-white rounded-lg cursor-pointer flex flex-col items-center justify-center"
              onClick={() => handleImageClick(idProof.image)}
            >
              <h3 className="text-sm font-bold mb-2 text-center">{idProof.type}</h3> {/* Centered text */}
              <img
                src={idProof.image}
                alt={idProof.type}
                className="w-24 h-24 rounded-lg" // Adjust size as needed
              />
            </div>
          ))}
        </div>

      </div>

      {/* Parent Details Section */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Parent Details</h2>
      <div className="bg-white shadow-lg rounded-xl mb-6 w-full max-w-screen-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {parentDetails.map((item, index) => (
            <DetailCard key={index} label={item.label} icon={item.icon} detail={item.detail} />
          ))}
        </div>
      </div>

      {/* Stay Details Section */}
      <h2 className="text-lg font-bold text-gray-800 mb-4">Stay Details</h2>
      <div className="bg-white shadow-lg rounded-xl mb-6 w-full max-w-screen-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stayDetailItems.map((item, index) => (
            <DetailCard key={index} label={item.label} icon={item.icon} detail={item.detail} />
          ))}
        </div>
      </div>

      {/* Modal for Image Display */}
      {isModalOpen && (
        <div
          id="modalBackground"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleModalClick}
        >
          <div className="relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-0 right-0 text-red-600 text-5xl font-semibold p-2 focus:outline-none"
            >
              &times;
            </button>
            <img src={selectedImage} alt="Selected" className="max-w-full max-h-full" />
          </div>
        </div>
      )}


      {/* Transaction Details Sliding Panel */}
      {isTransactionOpen && (
        <TransactionDetails
          isOpen={isTransactionOpen}
          onClose={() => {
            setIsTransactionOpen(false);
            setSlideIn(false);
          }}
          transaction={selectedTransaction}
          slideIn={slideIn}
        />
      )}

      {/* Warning Modal */}
      <ConfirmationModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        onConfirm={handleConfirmWarning}
        title="Confirm Warning"
        message={`Are you sure you want to issue a warning to ${student.name}?`}
        confirmLabel="Issue Warning"
      />

    </div>
  );
};

export default StudentDetails; 