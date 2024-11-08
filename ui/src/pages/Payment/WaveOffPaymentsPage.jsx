import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WaveOffPaymentsPage = () => {
  const [waveOffPayments, setWaveOffPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWaveOffPayments = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await axios.get('http://localhost:3000/api/fee/payments/waveoffpayments');
        setWaveOffPayments(response.data);
        setFilteredPayments(response.data); // Initialize filtered data
      } catch (error) {
        setError('Error fetching payments with wave-off amounts');
      } finally {
        setLoading(false);
      }
    };

    fetchWaveOffPayments();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = waveOffPayments.filter((payment) =>
      payment.name.toLowerCase().includes(term) ||
      payment.studentId.toLowerCase().includes(term) ||
      payment.hostelName.toLowerCase().includes(term) ||
      payment.transactionId.toLowerCase().includes(term)
    );
    setFilteredPayments(filtered);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, student ID, hostel name, or transaction ID"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {waveOffPayments.length === 0 ? (
        <p className="text-center text-gray-600">No data found.</p>
      ) : filteredPayments.length === 0 ? (
        <p className="text-center text-gray-600">No matching payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Student ID</th>
                <th className="px-4 py-2 border">Hostel Name</th>
                <th className="px-4 py-2 border">Transaction ID</th>
                <th className="px-4 py-2 border">Month/Year</th>
                <th className="px-4 py-2 border">Paid Date</th>
                <th className="px-4 py-2 border">Rent Amount</th>
                <th className="px-4 py-2 border">Wave-Off Amount</th>
                <th className="px-4 py-2 border">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border">{payment.name}</td>
                  <td className="px-4 py-2 border">{payment.studentId}</td>
                  <td className="px-4 py-2 border">{payment.hostelName}</td>
                  <td className="px-4 py-2 border">{payment.transactionId}</td>
                  <td className="px-4 py-2 border">{payment.monthYear}</td>
                  <td className="px-4 py-2 border">{payment.paidDate}</td>
                  <td className="px-4 py-2 border">{payment.rentAmount}</td>
                  <td className="px-4 py-2 border">{payment.waveOff}</td>
                  <td className="px-4 py-2 border">{payment.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WaveOffPaymentsPage;
