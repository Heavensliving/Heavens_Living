import React, { useState } from 'react';
import axios from 'axios';

const FeePayment = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    hostelId: '',
    hostelName: '',
    transactionId: '',
    monthYear: '',
    paidDate: '',
    rentAmount: '',
    waveOff: '',
    waveOffReason: '',
    totalAmount: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/fee/add', formData);
      alert('Fee payment recorded successfully!');
      setFormData({
        name: '',
        studentId: '',
        hostelId: '',
        hostelName: '',
        transactionId: '',
        monthYear: '',
        paidDate: '',
        rentAmount: '',
        waveOff: '',
        waveOffReason: '',
        totalAmount: ''
      });
    } catch (error) {
      console.error("Error recording fee payment:", error);
      alert('Failed to record fee payment. Please try again.');
    }
  };

  const handleFetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api'); // Adjust the endpoint as necessary
      console.log("Fetched Data:", response.data); // Handle the fetched data as needed
      alert('Data fetched successfully! Check the console for details.');
    } catch (error) {
      console.error("Error fetching data:", error);
      alert('Failed to fetch data. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Record Fee Payment</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Two fields in one line */}
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Additional fields can be added in a similar fashion */}
          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 mb-2">Hostel ID</label>
              <input
                type="text"
                name="hostelId"
                value={formData.hostelId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-gray-700 mb-2">Hostel Name</label>
              <input
                type="text"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 mb-2">Month & Year</label>
              <input
                type="text"
                name="monthYear"
                value={formData.monthYear}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-gray-700 mb-2">Paid Date</label>
              <input
                type="date"
                name="paidDate"
                value={formData.paidDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 mb-2">Rent Amount</label>
              <input
                type="number"
                name="rentAmount"
                value={formData.rentAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-gray-700 mb-2">Wave Off</label>
              <input
                type="number"
                name="waveOff"
                value={formData.waveOff}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                defaultValue={0}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Wave Off Reason</label>
            <input
              type="text"
              name="waveOffReason"
              value={formData.waveOffReason}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Total Amount</label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Button container */}
          <div className="flex justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mr-2"
            >
           Fetch Data
            </button>
            <button
              type="button"
              onClick={handleFetchData}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
               Submit Fee Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeePayment;
