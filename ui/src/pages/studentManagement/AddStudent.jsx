// student Form

import { useState } from 'react';

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name: '',
    address: '',
    contactNo: '',
    email: '',
    bloodGroup: '',
    parentName: '',
    parentNumber: '',
    course: '',
    advanceFee: '',
    nonRefundableDeposit: '',
    monthlyRent: '',
    adharFrontImage: null,
    adharBackImage: null,
    photo: null,
    pgName: '',
    roomType: '',
    roomNo: '',
    referredBy: '',
    typeOfStay: '',
    paymentStatus: '',
    studentId: '',
    joinDate: '',
    currentStatus: '',
    password: '',
    dateOfBirth: '',
    gender: '',
    year: '',
    collegeName: '',
    parentOccupation: '',
    workingPlace: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setStudentData({
        ...studentData,
        [name]: files[0], // Save the first file from the file input
      });
    } else {
      setStudentData({
        ...studentData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in studentData) {
      formData.append(key, studentData[key]);
    }

    // Here you can handle the API call to submit the form data
    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="contactNo"
              placeholder="Contact Number"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.contactNo}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="bloodGroup"
              placeholder="Blood Group"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.bloodGroup}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="parentName"
              placeholder="Parent's Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.parentName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="parentNumber"
              placeholder="Parent's Contact Number"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.parentNumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.course}
              onChange={handleChange}
            />
            <input
              type="number"
              name="advanceFee"
              placeholder="Advance Fee"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.advanceFee}
              onChange={handleChange}
            />
            <input
              type="number"
              name="nonRefundableDeposit"
              placeholder="Non-Refundable Deposit"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.nonRefundableDeposit}
              onChange={handleChange}
            />
            <input
              type="number"
              name="monthlyRent"
              placeholder="Monthly Rent"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.monthlyRent}
              onChange={handleChange}
            />
            <input
              type="file"
              name="adharFrontImage"
              className="p-3 border border-gray-300 rounded-lg w-full"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="adharBackImage"
              className="p-3 border border-gray-300 rounded-lg w-full"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="photo"
              className="p-3 border border-gray-300 rounded-lg w-full"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="pgName"
              placeholder="PG Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.pgName}
              onChange={handleChange}
            />
            <select
              name="roomType"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.roomType}
              onChange={handleChange}
              required
            >
              <option value="">Select Room Type</option>
              <option value="Single">Single</option>
              <option value="Shared">Shared</option>
              <option value="Deluxe">Deluxe</option>
            </select>
            <input
              type="text"
              name="roomNo"
              placeholder="Room Number"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.roomNo}
              onChange={handleChange}
            />
            <input
              type="text"
              name="referredBy"
              placeholder="Referred By"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.referredBy}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="typeOfStay"
              placeholder="Type of Stay"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.typeOfStay}
              onChange={handleChange}
            />
            <input
              type="text"
              name="paymentStatus"
              placeholder="Payment Status"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.paymentStatus}
              onChange={handleChange}
            />
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.studentId}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="joinDate"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.joinDate}
              onChange={handleChange}
            />
            <input
              type="text"
              name="currentStatus"
              placeholder="Current Status"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.currentStatus}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.password}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.dateOfBirth}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.gender}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="year"
              placeholder="Year"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.year}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="collegeName"
              placeholder="College Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.collegeName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="parentOccupation"
              placeholder="Parent's Occupation"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.parentOccupation}
              onChange={handleChange}
            />
            <input
              type="text"
              name="workingPlace"
              placeholder="Working Place"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={studentData.workingPlace}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
