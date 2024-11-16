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
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
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
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Payments</h1>

      {pendingPayments.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No pending payments found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-300 text-black">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingPaymentsPage;