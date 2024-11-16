import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config";

const PaymentDashboard = () => {
  const admin = useSelector(store => store.auth.admin);
  const [transactions, setTransactions] = useState([]);
  const [totalSalary,setTotalSalary] = useState();
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setTransactions(feeResponse.data);

        const totalAmount = feeResponse.data.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        setTotalReceived(totalAmount);
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
        setTotalExpense(expenseResponse.data.totalAmount);
      } catch (error) {
        console.error("Error fetching total expense:", error);
      }
    };

    const fetchTotalCommission = async () => {
      try {
        const commissionResponse = await axios.get(
          `${API_BASE_URL}/commission`,
          { headers: { Authorization: `Bearer ${admin.token}` } }
        );
        const total = commissionResponse.data.reduce(
          (sum, commission) => sum + (commission.amount || 0),
          0
        );
        setTotalCommission(total);
      } catch (error) {
        console.error("Error fetching total commission:", error);
      }
    };

    const fetchTotalMonthlyRent = async () => {
      try {
        const rentResponse = await axios.get(`${API_BASE_URL}/fee/totalMonthlyRent`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setTotalMonthlyRent(rentResponse.data.totalMonthlyRent);
      } catch (error) {
        console.error("Error fetching total monthly rent:", error);
      }
    };

    fetchTotals();
    fetchTotalMonthlyRent();
    fetchTotalExpense();
    fetchTotalCommission();
  }, [admin.token]);

  const paymentPending = totalMonthlyRent - totalReceived;
  const paymentPendingDisplay = paymentPending < 0 ? 0 : paymentPending;



  const handlePaymentOption = (option) => {
    closeModal();
    if (option === "Mess") navigate("/messPayment");
    if (option === "StudentAndWorkers") navigate("/studentWorkerPayment");
    if (option === "DailyRent") navigate("/dailyRentPayment");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-md shadow-md p-4 w-full h-full">
        <div className="flex flex-col md:flex-row items-center justify-between border-b pb-3 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">
            Transactions Reports
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={openModal}
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

     {/* Modal */}
     {showModal && (
        <div className="fixed inset-0 ml-60 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Icon */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Select Payment Type
            </h2>

            <ul className="space-y-4">
              <li
                onClick={() => navigate("/feePayment")}
                className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
              >
                Student & Workers
              </li>
              <li
                onClick={() => navigate("/messOnlyPayment")}
                className="cursor-pointer px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
              >
                Mess Only
              </li>
              <li
                onClick={() => navigate("/dailyRent/Payment")}
                className="cursor-pointer px-4 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200"
              >
                Daily Rent
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDashboard;
