import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaUserCheck, FaMoneyBill, FaCalendarAlt, FaHome, FaDoorOpen, FaBed } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import ProfileCircle from '../../components/reUsableComponet/ProfileCircle';
import IdProof from '../../components/reUsableComponet/IdProof';
import ImageModal from '../../components/reUsableComponet/ImageModal';
import PaymentHistory from './PaymentHistory';
import { faHome } from '@fortawesome/free-solid-svg-icons';

// Reusable component for displaying information
const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
  <p className={`text-gray-600 flex items-center ${className}`}>
    <Icon className="text-green-500 mr-2" /> <strong>{label}:</strong>&nbsp; {value}
  </p>
);

const DailyRentDetails = () => {
  const admin = useSelector(store => store.auth.admin);
  const { renterId } = useParams();
  const [dailyRent, setDailyRent] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [isPaymentHistoryModalOpen, setIsPaymentHistoryModalOpen] = useState(false); // State for SalaryDetails modal
  const [slideIn, setSlideIn] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(true); // Loading state for profile image
  const [isErrorImage, setIsErrorImage] = useState(false); // Error state for profile image

  useEffect(() => {
    if (admin?.token) {
      axios.get(`${API_BASE_URL}/DailyRent/${renterId}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      })
        .then(res => setDailyRent(res.data))
        .catch(err => console.log(err));
    }
  }, [admin?.token, renterId]);

  useEffect(() => {
    const profileImageUrl = dailyRent.photo;
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
  }, [dailyRent.Photo]);

  const dailyRentData = {
    tenantName: dailyRent.name,
    property: dailyRent.pgName,
    gender: dailyRent.gender,
    id: dailyRent.OccupantId,
    contact: dailyRent.contactNo,
    email: dailyRent.email,
    address: dailyRent.address,
    status: dailyRent.paymentStatus,
    joinDate: dailyRent.joinDate,
    roomType: dailyRent.roomType,
    roomNo: dailyRent.roomNo,
    dob: new Date(dailyRent.dateOfBirth).toLocaleDateString(),
    bloodG: dailyRent.bloodGroup,
    typeOfStay: dailyRent.typeOfStay,
    rentAmount: dailyRent.DailyRent,
    paymentDate: new Date(dailyRent.PaymentDate).toLocaleDateString(),
    paymentStatus: dailyRent.paymentStatus,
    profileImage: dailyRent.photo,
    idProofFront: dailyRent.adharFrontImage,
    idProofBack: dailyRent.adharBackImage,
  };

  // Function to open the modal with the selected image
  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  const handleTransactionClick = () => {
    setIsPaymentHistoryModalOpen(true);
    setSlideIn(true);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white rounded-xl mb-6 w-full max-w-screen-xl">
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-24 bg-side-bar rounded-t-lg" />
          <div className="relative z-10 pr-6 pl-6 pt-6 flex flex-col items-center md:flex-row">
            <div className="flex-shrink-0 ml-6">
              <ProfileCircle
                imageSrc={dailyRentData.profileImage}
                altText={dailyRentData.tenantName}
                onClick={() => handleImageClick(dailyRentData.profileImage)}
              />
              <div className="mt-4 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{dailyRentData.tenantName}</h2>
                <p className="text-side-bar text-sm">This rental is located at {dailyRentData.property}</p>
                <p className="text-gray-500">{dailyRentData.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-6 pl-6">
            {/* Left Column - Tenant Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
              <div className="space-y-4">
                <InfoItem icon={FaPhone} label="Contact" value={dailyRentData.contact} />
                <InfoItem icon={FaEnvelope} label="Email" value={dailyRentData.email} />
                <InfoItem icon={FaMapMarkerAlt} label="Address" value={dailyRentData.address} />
                <InfoItem icon={FaMapMarkerAlt} label="DOB" value={dailyRentData.dob} />
                <InfoItem icon={FaMapMarkerAlt} label="Blood Group" value={dailyRentData.bloodG} />

                {/* ID Proof Section */}
                <h4 className="text-lg font-semibold mt-6 mb-4 text-gray-700">ID Proof</h4>
                <div className="flex gap-4">
                  <IdProof
                    title="ID Proof Front"
                    imageSrc={dailyRentData.idProofFront}
                    altText="ID Proof Front"
                    onClick={() => handleImageClick(dailyRentData.idProofFront)}
                  />
                  <IdProof
                    title="ID Proof Back"
                    imageSrc={dailyRentData.idProofBack}
                    altText="ID Proof Back"
                    onClick={() => handleImageClick(dailyRentData.idProofBack)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Stay Details</h3>
              <div className="space-y-4">
                <InfoItem icon={FaHome} label="PG/Hostel Name" value={`${dailyRentData.property}`} />
                <InfoItem icon={FaHome} label="Stay Type" value={`${dailyRentData.typeOfStay}`} />
                <InfoItem icon={FaBed} label="Daily Rent" value={`₹${dailyRentData.rentAmount}`} />
                <InfoItem icon={FaDoorOpen} label="Room Type" value={`${dailyRentData.roomType}`} />
                <InfoItem icon={FaBed} label="Room Number" value={`${dailyRentData.roomNo}`} />
              </div>
              <div className="ml-auto flex items-center space-x-8 mt-4 relative">
                <h2
                  className="text-lg font-bold text-gray-800 cursor-pointer underline"
                  onClick={handleTransactionClick}
                >
                  Transaction History
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* PaymentHistory Modal */}
        {isPaymentHistoryModalOpen && (
          <PaymentHistory
            onClose={() => {
              setIsPaymentHistoryModalOpen(false);
              setSlideIn(false);
            }}
            slideIn={slideIn}
          />
        )}


        {/* Modal for Image */}
        <ImageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          imageSrc={modalImage}
          altText={dailyRentData.tenantName}
        />
      </div>
    </div>
  );
};

export default DailyRentDetails;
