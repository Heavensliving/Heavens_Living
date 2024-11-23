import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config";
import CheckAuth from "../auth/CheckAuth";

const PaymentDashboard = () => {
  const admin = useSelector(store => store.auth.admin);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalReceivedMess, setTotalReceivedMess] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);
  const [totalMonthlyRentMess, setTotalMonthlyRentMess] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0); // Total deposit state
  const [totalWaveOff, setTotalWaveOff] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (!admin) return;
    const fetchTotals = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        const totalAmount = feeResponse.data.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        const messPeopleTransactions = feeResponse.data.filter((transaction) => transaction.messPeople);
        const dailyRentTransactions = feeResponse.data.filter((transaction) => transaction.dailyRent);

        const messPeopleTotal = messPeopleTransactions.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        const dailyRentTotal = dailyRentTransactions.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        setTotalReceived(totalAmount - (messPeopleTotal + dailyRentTotal));
        setTotalReceivedMess(messPeopleTotal);
      } catch (error) {
        console.error("Error fetching fee totals:", error);
      }
    };

    const fetchTotalExpense = async () => {
      if (!admin) return;
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
      if (!admin) return;
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
      if (!admin) return;
      try {
        const rentResponse = await axios.get(`${API_BASE_URL}/fee/totalMonthlyRent`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setTotalMonthlyRent(rentResponse.data.totalMonthlyRentStudents);
        setTotalMonthlyRentMess(rentResponse.data.totalMonthlyRentMess);
      } catch (error) {
        console.error("Error fetching total monthly rent:", error);
      }
    };

    const fetchTotalDeposit = async () => {
      if (!admin) return;
      try {
        const studentResponse = await axios.get(`${API_BASE_URL}/students`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        // console.log(studentResponse); //debug statement

        // Calculate total refundable and non-refundable deposit
        const totalRefundable = studentResponse.data.reduce(
          (acc, student) => acc + (student.refundableDeposit || 0),
          0
        );
        const totalNonRefundable = studentResponse.data.reduce(
          (acc, student) => acc + (student.nonRefundableDeposit || 0),
          0
        );

        setTotalDeposit(totalRefundable + totalNonRefundable); // Combined total
      } catch (error) {
        console.error("Error fetching student deposits:", error);
      }
    };
    const fetchTotalWaveOff = async () => {
      if (!admin) return;
      try {
        const waveOffResponse = await axios.get(`${API_BASE_URL}/fee/payments/waveoffpayments`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        // console.log(waveOffResponse); // debug statement
        const totalWaveOffAmount = waveOffResponse.data.reduce(
          (acc, waveOff) => acc + (waveOff.waveOff || 0),
          0
        );
        setTotalWaveOff(totalWaveOffAmount);
      } catch (error) {
        console.error("Error fetching wave-off data:", error);
      }
    };

    fetchTotals();
    fetchTotalMonthlyRent();
    fetchTotalExpense();
    fetchTotalCommission();
    fetchTotalDeposit();
    fetchTotalWaveOff(); 
  }, [admin.token]);

  const paymentPending = totalMonthlyRent - totalReceived;
  const paymentPendingDisplay = paymentPending < 0 ? 0 : paymentPending;
  const paymentPendingMess = totalMonthlyRentMess - totalReceivedMess;
  const paymentPendingDisplayMess = paymentPendingMess < 0 ? 0 : paymentPendingMess;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-md shadow-md p-4 w-full h-full">
        <div className="border-b pb-3 mb-4">
          {/* Centered Heading */}
          <div className="flex justify-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Transactions Reports
            </h1>
          </div>

          {/* Centered Buttons in the Second Row */}
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
            className="p-4 bg-yellow-100 text-yellow-500 rounded-md cursor-pointer"
            onClick={() => navigate("/expenses")}
          >
            <p className="text-lg font-semibold">₹{totalMonthlyRentMess}</p>
            <p>Monthly Rent</p>
            <span>(Mess Only)</span>
          </div>
          <div
            className="p-4 bg-green-100 text-green-500 rounded-md cursor-pointer"
            onClick={() => navigate("/paymentReceived")}
          >
            <p className="text-lg font-semibold">₹{totalReceivedMess || 0}</p>
            <p>Payment Received</p>
            <span>(Mess Only)</span>
          </div>
          <div
            className="p-4 bg-red-100 text-red-500 rounded-md cursor-pointer"
            onClick={() => navigate("/paymentPending")}
          >
            <p className="text-lg font-semibold">₹{paymentPendingDisplayMess || 0}</p>
            <p>Payment Pending</p>
            <span>(Mess Only)</span>
          </div>
          <div
            className="p-4 bg-gray-100 text-gray-500 rounded-md cursor-pointer"
            onClick={() => navigate("/expenses")}
          >
            <p className="text-lg font-semibold">₹{totalExpense}</p>
            <p>Expense</p>
          </div>
          <div
            className="p-4 bg-gray-100 text-gray-500 rounded-md cursor-pointer"
            onClick={() => navigate("/commissions")}
          >
            <p className="text-lg font-semibold">₹{totalCommission || 0}</p>
            <p>Commission</p>
          </div>
          <div
            className="p-4 bg-gray-100 text-gray-500 rounded-md cursor-pointer"
            onClick={() => navigate("/waveoff")}
          >
            <p className="text-lg font-semibold">₹{totalWaveOff || 0}</p>
            <p>Total Waveoff</p>
          </div>
          {/* Total Deposit Card */}
          <div
            className="p-4 bg-gray-100 text-gray-500 rounded-md "
          >
            <p className="text-lg font-semibold">₹{totalDeposit || 0}</p> {/* Total Deposit */}
            <p>Total Deposit</p>
          </div>
        </div>
      </div>
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
                onClick={() => navigate("/messOnlyPayment", { state: { paymentType: "Mess Only" } })}
                className="cursor-pointer px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
              >
                Mess Only
              </li>
              <li
                 onClick={() => navigate("/messOnlyPayment", { state: { paymentType: "Daily Rent" } })}
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

export default CheckAuth(PaymentDashboard);