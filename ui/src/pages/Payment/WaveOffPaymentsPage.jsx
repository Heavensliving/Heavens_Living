import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';

const WaveOffPaymentsPage = () => {
  const admin = useSelector(store => store.auth.admin);
  const [waveOffPayments, setWaveOffPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWaveOffPayments = async () => {
      try {
        // Fetch data from the API endpoint
        const response = await axios.get(`${API_BASE_URL}/fee/payments/waveoffpayments`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setWaveOffPayments(response.data);
        setFilteredPayments(response.data); // Initialize filtered data
      } catch (error) {
        <p>no data found</p>
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
        
    
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Student ID</th>
                <th className="px-4 py-2 border">Transaction ID</th>
                <th className="px-4 py-2 border">Month/Year</th>
                <th className="px-4 py-2 border">Paid Date</th>
                <th className="px-4 py-2 border">Rent Amount</th>
                <th className="px-4 py-2 border">Wave-Off Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center px-4 py-2 text-gray-600"
                  >
                    No wave-off payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-2 border">{payment.name}</td>
                    <td className="px-4 py-2 border">{payment.studentId}</td>
                    <td className="px-4 py-2 border">{payment.transactionId}</td>
                    <td className="px-4 py-2 border">{payment.paymentClearedMonthYear}</td>
                    <td className="px-4 py-2 border">{payment.paymentDate}</td>
                    <td className="px-4 py-2 border">{payment.rentAmount}</td>
                    <td className="px-4 py-2 border">{payment.waveOff}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }    
export default WaveOffPaymentsPage;
