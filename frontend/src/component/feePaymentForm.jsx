import { useState } from 'react';

function FeePaymentForm() {
  const [feeData, setFeeData] = useState({
    name: '',
    studentId: '',
    hostelId: '',
    hostelName: '',
    transactionId: '',
    monthYear: '',
    paidDate: '',
    rentAmount: '',
    waveOff: 0,
    waveOffReason: '',
    totalAmount: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeeData({
      ...feeData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you can handle the API call to submit the form data
    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feeData),
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
        <h2 className="text-3xl font-bold text-center mb-6">Add Fee Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.studentId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="hostelId"
              placeholder="Hostel ID"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.hostelId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="hostelName"
              placeholder="Hostel Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.hostelName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="transactionId"
              placeholder="Transaction ID"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.transactionId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="monthYear"
              placeholder="Month/Year (e.g., October 2024)"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.monthYear}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="paidDate"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.paidDate}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="rentAmount"
              placeholder="Rent Amount"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.rentAmount}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="waveOff"
              placeholder="Wave Off Amount"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.waveOff}
              onChange={handleChange}
            />
            <input
              type="text"
              name="waveOffReason"
              placeholder="Wave Off Reason (optional)"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.waveOffReason}
              onChange={handleChange}
            />
            <input
              type="number"
              name="totalAmount"
              placeholder="Total Amount"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={feeData.totalAmount}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
            Add Fee Payment
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeePaymentForm;
