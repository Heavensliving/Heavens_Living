import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaHeartbeat, FaBook, FaUser, FaBed, FaDoorOpen, FaGraduationCap, FaHome, FaBriefcase, FaEllipsisH, FaBroom, FaRestroom, FaPiggyBank, FaRupeeSign } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ProfileCircle from '../../components/reUsableComponet/ProfileCircle';
import IdProof from '../../components/reUsableComponet/IdProof';
import ImageModal from '../../components/reUsableComponet/ImageModal';
import TransactionDetails from './TransactionDetails';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import CheckAuth from '../auth/CheckAuth';

// Reusable component for displaying information
const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
  <p className={`text-gray-600 flex items-center ${className}`}>
    <Icon className="text-red-500 mr-2" /> <strong>{label}:</strong>&nbsp; {value}
  </p>
);

const StudentDetails = () => {
  const navigate = useNavigate()
  const admin = useSelector(store => store.auth.admin);
  const { studentId } = useParams();
  const [student, setStudent] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [warnings, setWarnings] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [slideIn, setSlideIn] = useState(false); // State for sliding effect
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true); // Loading state for profile image
  const [isErrorImage, setIsErrorImage] = useState(false); // Error state for profile image
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (admin?.token) {
      axios.get(`${API_BASE_URL}/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      })
        .then(res => { setStudent(res.data.result), setWarnings(res.data.result.warningStatus) })
        .catch(err => console.log(err));
    }
  }, [admin?.token, studentId]);

  useEffect(() => {
    const profileImageUrl = student.Photo;
    if (profileImageUrl && profileImageUrl.startsWith('http')) {
      setIsLoadingImage(true);
      setIsErrorImage(false);
      const img = new Image();
      img.src = profileImageUrl;
      img.onload = () => setIsLoadingImage(false);
      img.onerror = () => {
        setIsLoadingImage(false);
        setIsErrorImage(true);
      };
    } else {
      setIsLoadingImage(false);
      setIsErrorImage(true);
    }
  }, [student.Photo]);

  const studentData = {
    name: student.name,
    address: student.address,
    contactNo: student.contactNo,
    email: student.email,
    bloodGroup: student.bloodGroup,
    parentName: student.parentName,
    parentNumber: student.parentNumber,
    course: student.course,
    advanceFee: student.advanceFee,
    nonRefundableDeposit: student.nonRefundableDeposit,
    refundableDeposit: student.refundableDeposit,
    depositPaid: student.depositPaid,
    monthlyRent: student.monthlyRent,
    adharFrontImage: student.adharFrontImage,
    adharBackImage: student.adharBackImage,
    photo: student.photo,
    pgName: student.pgName,
    roomType: student.roomType,
    roomNo: student.roomNo,
    referredBy: student.referredBy,
    typeOfStay: student.typeOfStay,
    paymentStatus: student.paymentStatus,
    studentId: student.studentId,
    joinDate: student.joinDate
      ? new Date(student.joinDate).toISOString().slice(0, 10).split('-').reverse().join('-')
      : null,
    currentStatus: student.currentStatus,
    password: student.password,
    dateOfBirth: student.dateOfBirth
      ? new Date(student.dateOfBirth).toISOString().slice(0, 10).split('-').reverse().join('-')
      : null,
    gender: student.gender,
    year: student.year,
    collegeName: student.collegeName,
    parentOccupation: student.parentOccupation,
    workingPlace: student.workingPlace,
    warningStatus: student.warningStatus,
    isBlocked: student.isBlocked,
    category: student.category
  };
  // Function to open the modal with the selected image
  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };
  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleOpenWarning = () => {
    setIsWarningModalOpen(true);
  }

  const handleConfirmWarning = () => {
    if (warnings < 3) {
      updateWarnings()
      setIsWarningModalOpen(false);
    }
  };

  const updateWarnings = async () => {
    try {
      console.log("Student ID:", studentId);
      const updatedWarnings = warnings + 1;
      console.log("Updated Warnings:", updatedWarnings);
      setWarnings(updatedWarnings);
      await axios.put(
        `${API_BASE_URL}/students/${studentId}/warning`, { warningStatus: updatedWarnings },
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );
      setIsWarningModalOpen(false); // Close modal
      window.location.reload();
    } catch (error) {
      console.error("Failed to update warnings:", error);
    }
  };

  const handleTransactionClick = () => {
    setSlideIn(true);
    setIsTransactionOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (window.confirm('Are you sure you want to Block the Access?')) { // Using window.confirm for confirmation
      try {
        // Call the API to block/unblock the student
        const response = await axios.patch(
          `${API_BASE_URL}/students/block/${studentId}`,
          {}, // No body needed, only headers are required
          {
            headers: {
              Authorization: `Bearer ${admin.token}`, // Make sure the token is included
            },
          }
        );
        if (response.status === 200) {
          alert('Block status updated successfully');
          window.location.reload(); // This will reload the current page
        }
      } catch (error) {
        console.error('Error blocking student:', error);
        alert('Failed to update block status');
      }
    }
  };

  const handleUnblockAccess = async () => {
    if (window.confirm('Are you sure you want to Unblock the Access?')) { // Using window.confirm for confirmation
      try {
        // Call the API to block/unblock the student
        const response = await axios.patch(
          `${API_BASE_URL}/students/block/${studentId}`,
          {}, // No body needed, only headers are required
          {
            headers: {
              Authorization: `Bearer ${admin.token}`, // Make sure the token is included
            },
          }
        );
        if (response.status === 200) {
          alert('Block status updated successfully');
          window.location.reload(); // This will reload the current page
        }
      } catch (error) {
        console.error('Error updating block status:', error);
        alert('Failed to update block status');
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white rounded-xl mb-6 w-full max-w-screen-xl">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-24 bg-side-bar rounded-t-lg" />
          <div className="relative z-10 pt-6 pr-12 pl-12 flex flex-col items-center md:flex-row">
            <div className="flex-shrink-0">
              <ProfileCircle
                imageSrc={studentData.photo}
                altText={studentData.name}
                onClick={() => handleImageClick(studentData.photo)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-center items-center pr-12 pl-12">
            {/* Left Side: Name and Warnings */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{studentData.name}</h2>
              <p className="text-side-bar text-sm">{studentData.name} is located at {studentData.pgName}.</p>
              {warnings === 1 && <span className="text-orange-400 text-sm">{studentData.name} is on their first warning</span>}
              {warnings === 2 && <span className="text-orange-600 text-sm">{studentData.name} has received a second warning</span>}
              {warnings === 3 && <span className="text-red-700 text-sm">{studentData.name} has been blacklisted due to multiple warnings</span>}
              <p className="text-gray-500">{studentData.studentId}</p>
              <p
                className={
                  studentData.category === "Basic"
                    ? "text-green-500"
                    : studentData.category === "Standard"
                      ? "text-yellow-500"
                      : "text-blue-500"
                }
              >
                {studentData.category}
              </p>
              <p className="text-sm mt-1">
                {(() => {
                  const totalDeposit = studentData.refundableDeposit + studentData.nonRefundableDeposit;
                  const pendingDepo = totalDeposit - studentData.depositPaid;
                  const isDepositPaid = studentData.depositPaid >= totalDeposit;

                  return (
                    <>
                      <span className={isDepositPaid ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                        {isDepositPaid
                          ? "Deposit Paid"
                          : `Deposit Pending - ${pendingDepo.toLocaleString()}`}
                      </span>
                      {" | "}
                      <span className="text-gray-700">
                        Referred by: {studentData.referredBy || "N/A"}
                      </span>
                    </>
                  );
                })()}
              </p>

            </div>

            {/* Right Side: Transaction History Section */}
            <div className="ml-auto flex items-center space-x-8 relative">
              <h2
                className="text-lg font-bold text-gray-800 cursor-pointer underline"
                onClick={() => handleTransactionClick()}
              >
                Transaction History
              </h2>
              <FaEllipsisH
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                onClick={toggleDropdown}
              />

              {/* Dropdown Menu for Options */}
              {isDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-5 right-0 mt-2 bg-white shadow-lg rounded-md z-20"
                >
                  <button
                    onClick={() => navigate(`/students/edit/${studentId}`)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  {studentData.warningStatus !== 3 && (
                    <button
                      onClick={handleOpenWarning}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Issue Warning
                    </button>
                  )}
                  {studentData.isBlocked ? (
                    <button
                      onClick={handleUnblockAccess} // Add your unblock handler here
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Unblock Access
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmBlock}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                    >
                      Access Block
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-6 pl-6 pb-6">
            {/* Left Column - Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-4 text-gray-700">Personal Information</h3>
              <div className="space-y-4">
                <InfoItem icon={FaPhone} label="Contact" value={studentData.contactNo} />
                <InfoItem icon={FaEnvelope} label="Email" value={studentData.email} />
                <InfoItem icon={FaMapMarkerAlt} label="Address" value={studentData.address} />
                <InfoItem icon={FaCalendarAlt} label="DOB" value={studentData.dateOfBirth} />
                <InfoItem icon={FaHeartbeat} label="Blood Group" value={studentData.bloodGroup} />
              </div>

              <h3 className="text-lg font-bold mb-4 mt-4 text-gray-700">Parent Details</h3>
              <div className="space-y-4">
                <InfoItem icon={FaUser} label="Name" value={studentData.parentName} />
                <InfoItem icon={FaPhone} label="Phone" value={studentData.parentNumber} />
                <InfoItem icon={FaBriefcase} label="Occupation" value={studentData.parentOccupation} />
              </div>
              {/* ID Proof Section */}
              <h4 className="text-lg font-bold mt-6 mb-4 text-gray-700">ID Proof</h4>
              <div className="flex gap-4">
                <IdProof
                  title="Aadhar Front"
                  imageSrc={studentData.adharFrontImage}
                  altText="Aadhar Front"
                  onClick={() => handleImageClick(studentData.adharFrontImage)}
                />
                <IdProof
                  title="Aadhar Back"
                  imageSrc={studentData.adharBackImage}
                  altText="Aadhar Back"
                  onClick={() => handleImageClick(studentData.adharBackImage)}
                />
              </div>
            </div>

            {/* Right Column - Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mt-4 mb-4 text-gray-700">Academic Information</h3>
              <div className="space-y-4">
                <InfoItem icon={FaGraduationCap} label="College" value={studentData.collegeName} />
                <InfoItem icon={FaBook} label="Course" value={studentData.course} />
                <InfoItem icon={FaCalendarAlt} label="Year of Study" value={studentData.year} />
              </div>
              <h3 className="text-lg font-bold mb-4 mt-4 text-gray-700">Stay Details</h3>
              <div className="space-y-4">
                <InfoItem icon={FaHome} label="Pg/Hostel Name" value={studentData.pgName} />
                <InfoItem icon={FaBed} label="Stay Type" value={studentData.typeOfStay} />
                <InfoItem icon={FaDoorOpen} label="Room Type" value={studentData.roomType} />
                <InfoItem icon={FaBed} label="Room No. " value={studentData.roomNo} />
                <InfoItem icon={FaRupeeSign} label="Monthly Rent" value={studentData.monthlyRent} />
                <InfoItem icon={FaRupeeSign} label="Refundable Deposit " value={studentData.refundableDeposit} />
                <InfoItem icon={FaPiggyBank} label="Non Refundable Deposit " value={studentData.nonRefundableDeposit} />
                <InfoItem icon={FaCalendarAlt} label="Join Date" value={studentData.joinDate} />
              </div>
            </div>
          </div>
        </div>

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

        {/* Modal for Image */}
        <ImageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          imageSrc={modalImage}
          altText={studentData.name}
        />
      </div>
    </div>
  );
};

export default CheckAuth(StudentDetails);