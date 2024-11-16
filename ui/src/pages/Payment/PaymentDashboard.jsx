import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config";

const PaymentDashboard = () => {
  const admin = useSelector(store => store.auth.admin);
  const [transactions, setTransactions] = useState([]);
  const [totalReceived, setTotalReceived] = useState(0);
  // const [totalGot, setTotalGot] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0); // New state for total expense
  const [totalCommission, setTotalCommission] = useState(0); // State for total commission
  // const [totalWaveoff, setTotalWaveoff] = useState(0); // State for total waveoff
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setTransactions(feeResponse.data);
  
        // Calculate total directly from feeResponse.data
        const totalAmount = feeResponse.data.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        setTotalReceived(totalAmount); // Set total received directly
      } catch (error) {
        console.error("Error fetching fee totals:", error);
      }
    };
  
    const fetchTotalExpense = async () => {
      try {
        const expenseResponse = await axios.get(
          `${API_BASE_URL}/expense/totalexpense`,
          { headers: { Authorization: `Bearer ${admin.token}` } }
        );
        setTotalExpense(expenseResponse.data.totalAmount); // Set total expense
      } catch (error) {
        console.error("Error fetching total expense:", error);
      }
    };
  
    const fetchTotalCommission = async () => {
      try {
        const commissionResponse = await axios.get(
          `${API_BASE_URL}/commission`,
          { headers: { Authorization: `Bearer ${admin.token}` } }
        ); // Adjust the API endpoint if necessary
        const total = commissionResponse.data.reduce(
          (sum, commission) => sum + (commission.amount || 0),
          0
        ); // Sum total commissions
        setTotalCommission(total); // Set total commission
      } catch (error) {
        console.error("Error fetching total commission:", error);
      }
    };
  
    const fetchTotalMonthlyRent = async () => {
      try {
        const rentResponse = await axios.get(`${API_BASE_URL}/fee/totalMonthlyRent`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setTotalMonthlyRent(rentResponse.data.totalMonthlyRent); // Set total monthly rent
      } catch (error) {
        console.error("Error fetching total monthly rent:", error);
      }
    };
  
    fetchTotals();
    fetchTotalMonthlyRent();
    fetchTotalExpense();
    fetchTotalCommission();
  }, [admin.token]);
  

  // Calculate payment pending
  const paymentPending = totalMonthlyRent - totalReceived;
  const paymentPendingDisplay = paymentPending < 0 ? 0 : paymentPending;
  // const netBalance = totalGot - totalReceived;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
  <div className="bg-white rounded-md shadow-md p-4 w-full h-full">
    <div className="flex flex-col md:flex-row items-center justify-between border-b pb-3 mb-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
        Transactions Reports
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => navigate("/feePayment")}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Add Payment
        </button>
        <button
          onClick={() => navigate("/AddExpense")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md"
        >
          Add Expense
        </button>
        <button
          onClick={() => navigate("/AddCommission")}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Add Commission
        </button>
      </div>
    </div>

    {/* Totals Display */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center mb-6">
      <div className="p-4 bg-yellow-100 text-yellow-500 rounded-md">
        <p className="text-lg font-semibold">₹{totalMonthlyRent}</p>
        <p>Monthly Rent</p>
      </div>
      <div
        className="p-4 bg-green-100 text-green-500 rounded-md cursor-pointer"
        onClick={() => navigate("/paymentReceived")}
      >
        <p className="text-lg font-semibold">₹{totalReceived}</p>
        <p>Payment Received</p>
      </div>
      <div
        className="p-4 bg-red-100 text-red-500 rounded-md cursor-pointer"
        onClick={() => navigate("/paymentPending")}
      >
        <p className="text-lg font-semibold">₹{paymentPendingDisplay}</p>
        <p>Payment Pending</p>
      </div>
      <div
        className="p-4 bg-violet-100 text-violet-500 rounded-md cursor-pointer"
        onClick={() => navigate("/expenses")}
      >
        <p className="text-lg font-semibold">₹{totalExpense}</p>
        <p>Expense</p>
      </div>
      <div
        className="p-4 bg-pink-100 text-pink-500 rounded-md cursor-pointer"
        onClick={() => navigate("/commissions")}
      >
        <p className="text-lg font-semibold">₹{totalCommission || 0}</p>
        <p>Commission</p>
      </div>
      <div
        className="p-4 bg-blue-100 text-blue-500 rounded-md cursor-pointer"
        onClick={() => navigate("/waveoff")}
      >
        <p className="text-lg font-semibold">₹{"" || 0}</p>
        <p>Total Waveoff</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default PaymentDashboard;
