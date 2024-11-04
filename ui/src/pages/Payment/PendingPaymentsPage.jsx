import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PendingPaymentsPage = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/fee/payments/pendingPayments');
        setPendingPayments(response.data);
      } catch (error) {
        setError('Error fetching pending payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Pending Payments</h1>
      {pendingPayments.length === 0 ? (
        <p>No pending payments found.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Hostel Name</th>
              <th>Transaction ID</th>
              <th>Month/Year</th>
              <th>Paid Date</th>
              <th>Rent Amount</th>
              <th>Wave-Off Amount</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.name}</td>
                <td>{payment.studentId}</td>
                <td>{payment.hostelName}</td>
                <td>{payment.transactionId}</td>
                <td>{payment.monthYear}</td>
                <td>{payment.paidDate}</td>
                <td>{payment.rentAmount}</td>
                <td>{payment.waveOff}</td>
                <td>{payment.totalAmount}</td>
                <td>{payment.paymentStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingPaymentsPage;
