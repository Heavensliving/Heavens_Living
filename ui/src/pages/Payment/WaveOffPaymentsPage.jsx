import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from '../auth/CheckAuth';

const WaveOffPaymentsPage = () => {
  const admin = useSelector(store => store.auth.admin);
  const [waveOffPayments, setWaveOffPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWaveOffPayments = async () => {
      if (!admin) return;
      try {
        // Fetch data from the API endpoint
        const response = await axios.get(`${API_BASE_URL}/fee/payments/waveoffpayments`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        setWaveOffPayments(response.data);
        setFilteredPayments(response.data.reverse()); // Initialize filtered data
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
    setSearchTerm(event.target.value); // Keep original input case

    if (!term) {
      setFilteredPayments(waveOffPayments);
      return;
    }

    const filtered = waveOffPayments.filter((payment) =>
      (payment.name && payment.name.toLowerCase().includes(term)) ||
      (payment.studentId && payment.studentId.toLowerCase().includes(term)) ||
      (payment.hostelName && payment.hostelName.toLowerCase().includes(term)) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(term))
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


      <div className="overflow-hiden">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Name</th>
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
              filteredPayments.map((payment, index) => (
                <tr key={payment._id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="py-2 px-4 border relative group">
                    <span>
                      {payment.name || 'N/A'}
                      {!payment.monthlyRent && <span className="text-sm text-gray-500 ml-1">(Daily Rent)</span>}
                    </span>

                    {payment.waveOff && payment.waveOffReason.trim() !== '' && (
                      <span className="ml-2 text-blue-600 text-xs underline cursor-pointer relative group">
                        Reason
                        <div className="absolute z-10 left-0 mt-1 w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {payment.waveOffReason}
                        </div>
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-2 border text-center">{payment.transactionId}</td>
                  <td className="px-4 py-2 border text-center">
                    {payment.paymentClearedMonthYear || payment.rentMonth || 'N/A'}
                  </td>
                  <td className="px-4 py-2 border text-center">{new Date(payment.paymentDate).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-2 border text-center">{payment.monthlyRent}</td>
                  <td className="px-4 py-2 border text-center">{payment.waveOff}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default CheckAuth(WaveOffPaymentsPage);
