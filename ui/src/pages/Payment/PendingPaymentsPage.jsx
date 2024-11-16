import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config";

const PendingPaymentsPage = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/fee/payments/pendingPayments`,
          { headers: { Authorization: `Bearer ${admin.token}` } }
        );
        console.log(response.data);
        setPendingPayments(response.data);
      } catch (error) {
        setError("Error fetching pending payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
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
                <th className="py-3 px-4 border text-left text-sm">Name</th>
                <th className="py-3 px-4 border text-left text-sm">Student ID</th>
                <th className="py-3 px-4 border text-left text-sm">Rent Amount</th>
                <th className="py-3 px-4 border text-left text-sm">Last Paid Date</th>
                <th className="py-3 px-4 border text-left text-sm">Rent Cleared Month</th>
                <th className="py-3 px-4 border text-left text-sm">Total Amount To Pay</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment, index) => (
                <tr
                  key={payment.studentId}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4 border text-sm">{payment.name || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.studentId || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.monthlyRent || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{new Date(payment.lastPaidDate).toLocaleDateString()  || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.paymentClearedMonthYear || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.pendingRentAmount || "N/A"}</td>
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
};

export default PendingPaymentsPage;
