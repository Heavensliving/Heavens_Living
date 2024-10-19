import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBriefcase, FaUserCheck, FaMoneyBill, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ProfileCircle from '../../components/reUsableComponet/ProfileCircle';
import IdProof from '../../components/reUsableComponet/IdProof';
import ImageModal from '../../components/reUsableComponet/ImageModal';

// Reusable component for displaying information
const InfoItem = ({ icon: Icon, label, value, className = '' }) => (
  <p className={`text-gray-600 flex items-center ${className}`}>
    <Icon className="text-blue-500 mr-2" /> <strong>{label}:</strong>&nbsp; {value}
  </p>
);

const StaffDetails = () => {
  const admin = useSelector(store => store.auth.admin);
  const { staffId } = useParams();
  const [staff, setStaff] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(true); // Loading state for profile image
  const [isErrorImage, setIsErrorImage] = useState(false); // Error state for profile image

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

  useEffect(() => {
    const profileImageUrl = staff.Photo;
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
  }, [staff.Photo]);

  const staffData = {
    name: staff.Name,
    property: staff.propertyName,
    id: staff.StaffId,
    contact: staff.Contactnumber,
    email: staff.Email,
    address: staff.Address,
    type: staff.Type,
    status: staff.Status,
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
          <div className="relative z-10 pr-6 pl-6 pt-6 flex flex-col items-center md:flex-row">
            <div className="flex-shrink-0 ml-6">
              <ProfileCircle
                imageSrc={staffData.profileImage}
                altText={staffData.name}
                onClick={() => handleImageClick(staffData.profileImage)}
              />
              <div className="mt-4 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900">{staffData.name}</h2>
                <p className="text-side-bar text-sm">This staff member is assigned to {staffData.property}</p>
                <p className="text-gray-500">{staffData.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-6 pl-6">
            {/* Left Column - Personal Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
              <div className="space-y-4">
                <InfoItem icon={FaPhone} label="Contact" value={staffData.contact} />
                <InfoItem icon={FaEnvelope} label="Email" value={staffData.email} />
                <InfoItem icon={FaMapMarkerAlt} label="Address" value={staffData.address} />
                <InfoItem icon={FaBriefcase} label="Employment Type" value={staffData.type} />
                <InfoItem icon={FaUserCheck} label="Status"
                  value={
                    <span className={staffData.status === "Active" ? "text-green-500" : "text-red-500"}>
                      {staffData.status}
                    </span>
                  }
                />

                {/* ID Proof Section */}
                <h4 className="text-lg font-semibold mt-6 mb-4 text-gray-700">ID Proof</h4>
                <div className="flex gap-4">
                  <IdProof
                    title="Aadhar Front"
                    imageSrc={staffData.adharFront}
                    altText="Aadhar Front"
                    onClick={() => handleImageClick(staffData.adharFront)}
                  />
                  <IdProof
                    title="Aadhar Back"
                    imageSrc={staffData.adharBack}
                    altText="Aadhar Back"
                    onClick={() => handleImageClick(staffData.adharBack)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Payment Information</h3>
              <div className="space-y-4">
                <InfoItem icon={FaMoneyBill} label="Salary" value={`₹${staffData.salary}`} />
                <InfoItem icon={FaCalendarAlt} label="Payment Date" value={staffData.paymentDate} />
                <InfoItem icon={FaClock} label="Pay Schedule" value={staffData.paySchedule} />
              </div>
            </div>
          </div>
        </div>

        {/* Modal for Image */}
        <ImageModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          imageSrc={modalImage}
          altText={staffData.name}
        />
      </div>
    </div>
  );
};

export default StaffDetails;
