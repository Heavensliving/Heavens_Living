import React from 'react';
import { useParams } from 'react-router-dom';

const StaffDetails = () => {
  const { id } = useParams(); // Get the staff ID from the URL parameters

  // Placeholder data for demonstration. In real cases, you might fetch data from an API or use props.
  const staffData = {
    name: 'John Doe',
    id: '#123456',
    contact: '+1 234 567 890',
    email: 'johndoe@example.com',
    address: '1234 Main St, City, Country',
    type: 'Full-Time',
    status: 'Active',
    compensation: {
      salary: '$60,000',
      benefits: 'Health Insurance, 401k',
      paymentDate: '2024-10-01',
      paySchedule: 'Bi-weekly',
      amount: '$2,500',
    },
    profileImage: 'https://via.placeholder.com/150', // Placeholder profile image
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      {/* Full-width Box */}
      <div className="bg-white shadow-lg rounded-xl mb-6 w-full max-w-screen-xl">
        <div className="relative">
          {/* Top 30% Background Color */}
          <div className="absolute inset-x-0 top-0 h-24 bg-side-bar rounded-t-lg" />

          {/* Profile Section */}
          <div className="relative z-10 p-6 flex flex-col items-center md:flex-row">
            {/* Profile Image and Name */}
            <div className="flex-shrink-0">
              <img
                src={staffData.profileImage}
                alt={staffData.name}
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <div className="mt-4 text-center md:text-left">
                <h2 className="text-xl font-bold text-gray-800">{staffData.name}</h2>
                <p className="text-gray-500">{staffData.id}</p>
              </div>
            </div>
          </div>

          {/* Details Section - Split into two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Personal Information */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
              <p className="text-gray-600 mb-2">
                <strong>Contact:</strong> {staffData.contact}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Email:</strong> {staffData.email}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Address:</strong> {staffData.address}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Employment Type:</strong> {staffData.type}
              </p>
              <p className="text-gray-600">
                <strong>Status:</strong> {staffData.status}
              </p>
            </div>

            {/* Right Column - Compensation Details */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Compensation Details</h3>
              <p className="text-gray-600 mb-2">
                <strong>Salary:</strong> {staffData.compensation.salary}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Benefits:</strong> {staffData.compensation.benefits}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Payment Date:</strong> {staffData.compensation.paymentDate}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Pay Amount:</strong> {staffData.compensation.amount}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Pay Schedule:</strong> {staffData.compensation.paySchedule}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;
