import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentDashboard = () => {
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalGot, setTotalGot] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0); // New state for total expense
  const [totalCommission, setTotalCommission] = useState(0); // State for total commission
  const [totalWaveoff, setTotalWaveoff] = useState(0); // State for total waveoff
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const feeResponse = await axios.get("http://localhost:3000/api/fee");

        let receivedTotal = 0;
        let gotTotal = 0;
        let monthlyRentTotal = 0;
        let waveoffTotal = 0;

        feeResponse.data.forEach((transaction) => {
          receivedTotal += transaction.totalAmount || 0;
          gotTotal += transaction.totalAmount || 0;
          monthlyRentTotal += transaction.rentAmount || 0;
          waveoffTotal += transaction.waveOff || 0;
        });
        console.log(waveoffTotal);
        setTotalReceived(receivedTotal);
        setTotalGot(gotTotal);
        setTotalMonthlyRent(monthlyRentTotal);
        setTotalWaveoff(waveoffTotal); // Set the total waveoff
      } catch (error) {
        console.error("Error fetching fee totals:", error);
      }
    };

    const fetchTotalExpense = async () => {
      try {
        const expenseResponse = await axios.get(
          "http://localhost:3000/api/expense/totalexpense"
        );
        setTotalExpense(expenseResponse.data.totalAmount); // Set total expense
      } catch (error) {
        console.error("Error fetching total expense:", error);
      }
    };

    const fetchTotalCommission = async () => {
      try {
        const commissionResponse = await axios.get(
          "http://localhost:3000/api/commission"
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

    fetchTotals();
    fetchTotalExpense();
    fetchTotalCommission();
  }, []);

  // Calculate payment pending
  const paymentPending = totalMonthlyRent - totalReceived;
  const paymentPendingDisplay = paymentPending < 0 ? 0 : paymentPending;
  const netBalance = totalGot - totalReceived;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-md shadow-md p-4 w-full h-full">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Transactions Reports
          </h1>
          <div className="space-x-4">
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
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
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
          <div className="p-4 bg-yellow-100 text-yellow-500 rounded-md">
            <p className="text-lg font-semibold">₹{totalMonthlyRent}</p>
            <p>Monthly Rent</p>
          </div>
          <div
            className="p-4 bg-violet-100 text-violet-500 rounded-md cursor-pointer"
            onClick={() => navigate("/expenses")}
          >
            <p className="text-lg font-semibold">₹{totalExpense}</p>{" "}
            {/* Updated to show total expense */}
            <p>Expense</p>
          </div>
          <div
            className="p-4 bg-pink-100 text-pink-500 rounded-md cursor-pointer"
            onClick={() => navigate("/commissions")}
          >
            <p className="text-lg font-semibold">₹{totalCommission || 0}</p>{" "}
            {/* Updated to show total commission */}
            <p>Commission</p>
          </div>
          <div
            className="p-4 bg-blue-100 text-blue-500 rounded-md cursor-pointer"
            onClick={() => navigate("/waveoff")}
          >
            <p className="text-lg font-semibold">₹{totalWaveoff || 0}</p>{" "}
            {/* Updated to show total waveoff */}
            <p>Total Waveoff</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
