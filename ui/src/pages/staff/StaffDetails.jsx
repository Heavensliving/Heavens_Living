import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaUserCheck, FaMoneyBill, FaCalendarAlt, FaClock, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_BASE_URL from '../../config';

// Reusable component for displaying information
const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
  <p className={`text-gray-600 flex items-center ${className}`}>
    <Icon className="text-blue-500 mr-2" /> <strong>{label}:</strong> {value}
  </p>
);

// Modal Component for displaying images
const ImageModal = ({ isOpen, onClose, imageSrc, altText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-900" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        <img src={imageSrc} alt={altText} className="w-full h-auto max-w-lg rounded-lg" />
      </div>
    </div>
  );
};

// Reusable component for displaying image card
const ImageCard = ({ title, imageSrc, altText, onClick }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 cursor-pointer" onClick={onClick}>
    <h5 className="font-medium text-gray-600 mb-2">{title}</h5>
    <img src={imageSrc} alt={altText} className="w-full h-auto rounded-lg shadow-sm" />
  </div>
);

const StaffDetails = () => {
  const admin = useSelector(store => store.auth.admin);
  const { staffId } = useParams();
  const [staff, setStaff] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    if (admin?.token) {
      axios.get(`${API_BASE_URL}/staff/${staffId}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      })
        .then(res => setStaff(res.data))
        .catch(err => console.log(err));
    }
  }, [admin?.token, staffId]);

  const staffData = {
    name: staff.Name,
    id: staff.StaffId,
    contact: staff.Contactnumber,
    email: staff.Email,
    address: staff.Address,
    type: staff.Type,
    status: 'Active',
    salary: staff.Salary,
    paymentDate: new Date(staff.PaymentDate).toLocaleDateString(),
    paySchedule: staff.PaySchedule,
    profileImage: staff.Photo,
    adharFront: staff.Adharfrontside,
    adharBack: staff.Adharbackside,
  };

  // Function to open the modal with the selected image
  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white rounded-xl mb-6 w-full max-w-screen-xl">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-24 bg-side-bar rounded-t-lg" />
          <div className="relative z-10 p-6 flex flex-col items-center md:flex-row">
            <div className="flex-shrink-0">
              <img
                src={staffData.profileImage}
                onClick={() => handleImageClick(staffData.profileImage)}
                alt={staffData.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md cursor-pointer"
              />
              <div className="mt-4 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{staffData.name}</h2>
                <p className="text-gray-500">{staffData.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
              <div className="space-y-4">
                <InfoItem icon={FaPhone} label="Contact" value={staffData.contact} />
                <InfoItem icon={FaEnvelope} label="Email" value={staffData.email} />
                <InfoItem icon={FaMapMarkerAlt} label="Address" value={staffData.address} />
                <InfoItem icon={FaBriefcase} label="Employment Type" value={staffData.type} />
                <InfoItem icon={FaUserCheck} label="Status" value={staffData.status} />

                {/* ID Proof Section */}
                <h4 className="text-lg font-semibold mt-6 mb-4 text-gray-700">ID Proof</h4>
                <div className="flex gap-4">
                  <ImageCard
                    title="Aadhar Front"
                    imageSrc={staffData.adharFront}
                    altText="Aadhar Front"
                    onClick={() => handleImageClick(staffData.adharFront)}
                  />
                  <ImageCard
                    title="Aadhar Back"
                    imageSrc={staffData.adharBack}
                    altText="Aadhar Back"
                    onClick={() => handleImageClick(staffData.adharBack)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Compensation Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Compensation Details</h3>
              <div className="space-y-4">
                <InfoItem icon={FaMoneyBill} label="Salary" value={staffData.salary} />
                <InfoItem icon={FaCalendarAlt} label="Payment Date" value={staffData.paymentDate} />
                <InfoItem icon={FaClock} label="Pay Schedule" value={staffData.paySchedule} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageSrc={modalImage}
        altText="Aadhar Image"
      />
    </div>
  );
};

export default StaffDetails;
