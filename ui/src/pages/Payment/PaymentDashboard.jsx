import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from "../auth/CheckAuth";
import jsPDF from "jspdf";
import "jspdf-autotable";

const PaymentDashboard = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [total, setTotal] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [totalAmountWithoutAdvance, setTotalAmountWithoutAdvance] = useState(0);
  const [totalReceivedMess, setTotalReceivedMess] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);
  const [totalMonthlyRentMess, setTotalMonthlyRentMess] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [totalRefundableDeposit, setTotalRefundableDeposit] = useState(0);
  const [totalNonRefundableDeposit, setTotalNonRefundableDeposit] = useState(0);
  const [totalWaveOff, setTotalWaveOff] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMonth, setReportMonth] = useState("");
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingPayments, setPendingPayments] = useState([]);
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
        const today = new Date();
        const currentMonth = today.getMonth(); // Get the current month (0-11)
        const currentYear = today.getFullYear(); // Get the current year (e.g., 2025)
        // Filter transactions that match the current month and year
        const currentMonthTransactions = feeResponse.data.filter(
          (transaction) => {
            const paymentDate = new Date(transaction.paymentDate);
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
          }
        );

        const totalReceivedAmount = feeResponse.data.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        const totalAmount = currentMonthTransactions.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        const totalAmountWithOutAdvance = feeResponse.data.reduce(
          (acc, transaction) => {
            // Subtract the advanceBalance from amountPaid to exclude advances
            const effectiveAmountPaid = transaction.amountPaid - (transaction.advanceBalance || 0);
            return acc + (effectiveAmountPaid > 0 ? effectiveAmountPaid : 0); // Ensure no negative values are added
          },
          0
        );
        const messPeopleTransactions = currentMonthTransactions.filter(
          (transaction) => transaction.messPeople
        );
        const dailyRentTransactions = currentMonthTransactions.filter(
          (transaction) => transaction.dailyRent
        );

        const messPeopleTotal = messPeopleTransactions.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        const dailyRentTotal = dailyRentTransactions.reduce(
          (acc, transaction) => acc + (transaction.amountPaid || 0),
          0
        );
        setTotal(totalReceivedAmount)
        setTotalReceived(totalAmount - (messPeopleTotal + dailyRentTotal));
        setTotalAmountWithoutAdvance(totalAmountWithOutAdvance - (messPeopleTotal + dailyRentTotal));
        setTotalReceivedMess(messPeopleTotal);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching fee totals:", error);
        setLoading(false)
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
        setLoading(false)
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
        setLoading(false)
      } catch (error) {
        console.error("Error fetching total commission:", error);
        setLoading(false)
      }
    };

    const fetchTotalMonthlyRent = async () => {
      if (!admin) return;
      try {
        const rentResponse = await axios.get(
          `${API_BASE_URL}/fee/totalMonthlyRent`,
          {
            headers: { Authorization: `Bearer ${admin.token}` },
          }
        );
        setTotalMonthlyRent(rentResponse.data.totalMonthlyRentStudents);
        setTotalMonthlyRentMess(rentResponse.data.totalMonthlyRentMess);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching total monthly rent:", error);
        setLoading(false)
      }
    };
    const fetchTotalDeposit = async () => {
      if (!admin) return;
      try {
        const studentResponse = await axios.get(`${API_BASE_URL}/students`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        // Calculate total refundable and non-refundable deposit
        const totalRefundableDeposit = studentResponse.data.reduce(
          (acc, student) => acc + (student.refundableDeposit || 0),
          0
        );
        const totalNonRefundableDeposit = studentResponse.data.reduce(
          (acc, student) => acc + (student.nonRefundableDeposit || 0),
          0
        );

        // Set them into separate state variables
        setTotalRefundableDeposit(totalRefundableDeposit);
        setTotalNonRefundableDeposit(totalNonRefundableDeposit);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student deposits:", error);
        setLoading(false);
      }
    };

    const fetchTotalWaveOff = async () => {
      if (!admin) return;
      try {
        const waveOffResponse = await axios.get(
          `${API_BASE_URL}/fee/payments/waveoffpayments`,
          {
            headers: { Authorization: `Bearer ${admin.token}` },
          }
        );
        // console.log(waveOffResponse); // debug statement
        const totalWaveOffAmount = waveOffResponse.data.reduce(
          (acc, waveOff) => acc + (waveOff.waveOff || 0),
          0
        );
        setTotalWaveOff(totalWaveOffAmount);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching wave-off data:", error);
        setLoading(false)
      }
    };

    const fetchPendingPayments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/fee/payments/pendingPayments`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );

        const today = new Date().setHours(0, 0, 0, 0);
        const filteredPayments = response.data.filter((payment) => {
          const joinDate = new Date(payment.joinDate).setHours(0, 0, 0, 0);
          return joinDate <= today;
        });
        // Sum all the pendingRentAmount values
        const totalPendingRentAmount = filteredPayments.reduce((total, payment) => {
          return total + (payment.pendingRentAmount || 0); // Use 0 as a fallback in case pendingRentAmount is undefined
        }, 0);

        // Store the sum along with the filtered payments
        setPendingPayments(totalPendingRentAmount);
        // setPendingPayments(filteredPayments);
        // console.log(filteredPayments)
      } catch (error) {
        setError(`${error}`, "Error fetching pending payments");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
    fetchTotalMonthlyRent();
    fetchTotalExpense();
    fetchTotalCommission();
    fetchTotalDeposit();
    fetchTotalWaveOff();
    fetchPendingPayments();
  }, [admin.token]);

  const generateMonthlyReport = async () => {
    if (!reportMonth || !reportYear) return;
    setIsGenerating(true);

    try {
      const [feeResponse, expenseResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        }),
        axios.get(`${API_BASE_URL}/expense`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        }),
      ]);

      // Filter data for selected month and year
      const monthlyFees = feeResponse.data.filter((fee) => {
        const feeDate = new Date(fee.paymentDate);
        return (
          feeDate.getMonth() + 1 === Number(reportMonth) &&
          feeDate.getFullYear() === Number(reportYear)
        );
      });

      const monthlyExpenses = expenseResponse.data.expenses.filter(
        (expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() + 1 === Number(reportMonth) &&
            expenseDate.getFullYear() === Number(reportYear)
          );
        }
      );

      // Calculate totals
      const totalReceived = monthlyFees.reduce(
        (sum, fee) => sum + (fee.amountPaid || 0),
        0
      );
      const totalExpenses = monthlyExpenses.reduce(
        (sum, expense) => sum + (expense.amount || 0),
        0
      );
      const profitLoss = totalReceived - (totalExpenses+totalWaveOff+totalCommission);

      // Generate PDF
      const doc = new jsPDF();
      const monthName = new Date(reportYear, reportMonth - 1).toLocaleString(
        "default",
        { month: "long" }
      );

      // Header
      doc.setFontSize(20);
      doc.text(`Financial Report - ${monthName} ${reportYear}`, 14, 20);

      // Summary Section
      doc.setFontSize(12);
      doc.text("Financial Summary", 14, 35);
      doc.line(14, 37, 196, 37);

      doc.setFontSize(10);
      doc.text(
        `Total Received: Rs: ${totalReceived.toLocaleString("en-IN")}`,
        14,
        45
      );
      doc.text(
        `Total Commission: Rs: ${totalCommission.toLocaleString("en-IN")}`,
        14,
        52
      );
      doc.text(
        `Total Waveoff: Rs: ${totalWaveOff.toLocaleString("en-IN")}`,
        14,
        59
      );
      doc.text(
        `Total Expenses: Rs: ${totalExpenses.toLocaleString("en-IN")}`,
        14,
        66
      );
      doc.text(
        `${profitLoss >= 0 ? "Net Profit" : "Net Loss"}: Rs: ${Math.abs(
          profitLoss
        ).toLocaleString("en-IN")}`,
        14,
        73
      );

      // Fee Transactions Table
      doc.setFontSize(12);
      doc.text("Fee Transactions", 14, 83);
      doc.autoTable({
        startY: 87,
        head: [["Date", "Name", "ID", "Category", "Amount"]],
        body: monthlyFees.map((fee) => [
          new Date(fee.paymentDate).toLocaleDateString('en-GB'),
          fee.name || "N/A",
          fee.studentId || "N/A",
          fee.messPeople
            ? "Mess Only"
            : fee.dailyRent
              ? "Daily Rent"
              : "Regular",
          `Rs: ${fee.amountPaid.toLocaleString("en-IN")}`,
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [71, 85, 105] },
      });

      // Expense Table
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.text("Expenses", 14, finalY);
      doc.autoTable({
        startY: finalY + 5,
        head: [["Date", "Title", "Category", "Payment Method", "Amount"]],
        body: monthlyExpenses.map((expense) => [
          new Date(expense.date).toLocaleDateString('en-GB'),
          expense.title || "N/A",
          expense.category || "N/A",
          expense.paymentMethod || "N/A",
          `Rs: ${expense.amount.toLocaleString("en-IN")}`,
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [71, 85, 105] },
      });

      // Footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Generated on: ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      doc.save(`financial_report_${monthName}_${reportYear}.pdf`);
      setShowReportModal(false);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  // console.log(totalAmountWithoutAdvance)
  const paymentPending = totalMonthlyRent - totalAmountWithoutAdvance - totalWaveOff;
  const paymentPendingDisplay = paymentPending < 0 ? 0 : paymentPending;
  const paymentPendingMess = totalMonthlyRentMess - totalReceivedMess;
  const paymentPendingDisplayMess =
    paymentPendingMess < 0 ? 0 : paymentPendingMess;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

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
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add Payment
            </button>
            <button
              onClick={() => navigate("/AddExpense")}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Add Expense
            </button>
            <button
              onClick={() => navigate("/AddCommission")}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Add Commission
            </button>
            <button
              onClick={() => navigate('/pettycash')}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Petty Cash
            </button>
            {admin.role !== 'Property-Admin' && (
              <button
                onClick={() => setShowReportModal(true)}
                className="px-4 py-2 bg-side-bar text-white rounded-md hover:bg-[#373082]"
              >
                Download Report
              </button>
            )}
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
            <p className="text-lg font-semibold">₹{pendingPayments}</p>
            <p>Payment Pending</p>
          </div>
          <div
            className="p-4 bg-yellow-100 text-yellow-500 rounded-md"
          // onClick={() => navigate("/expenses")}
          >
            <p className="text-lg font-semibold">₹{totalMonthlyRentMess}</p>
            <p>Monthly Rent</p>
            <span>(Mess Only)</span>
          </div>
          <div
            className="p-4 bg-green-100 text-green-500 rounded-md"
          // onClick={() => navigate("/paymentReceived")}
          >
            <p className="text-lg font-semibold">₹{totalReceivedMess || 0}</p>
            <p>Payment Received</p>
            <span>(Mess Only)</span>
          </div>
          <div
            className="p-4 bg-red-100 text-red-500 rounded-md"
          // onClick={() => navigate("/paymentPending")}
          >
            <p className="text-lg font-semibold">
              ₹{paymentPendingDisplayMess || 0}
            </p>
            <p>Payment Pending</p>
            <span>(Mess Only)</span>
          </div>
          <div
            className="p-4 bg-gray-100 text-gray-500 rounded-md cursor-pointer"
            onClick={() => navigate("/expenses")}
          >
            <p className="text-lg font-semibold ">₹{totalExpense}</p>
            <p>Expense</p>
          </div>
          <div className="p-4 bg-gray-100 text-gray-500 rounded-md ">
                <p className="text-lg font-semibold">₹{total-(totalExpense+totalCommission+totalWaveOff) || 0}</p>{" "}
                {/* Total Deposit */}
                <p>Balance</p>
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
            <p>Waveoff</p>
          </div>
          {/* Conditionally render based on admin role */}
          {admin.role !== 'Property-Admin' && (
            <>
              <div className="p-4 bg-gray-100 text-gray-500 rounded-md ">
                <p className="text-lg font-semibold">₹{totalNonRefundableDeposit || 0}</p>{" "}
                {/* Total Deposit */}
                <p>Non Refundable Deposit</p>
              </div>
              <div className="p-4 bg-gray-100 text-gray-500 rounded-md ">
                <p className="text-lg font-semibold">₹{totalRefundableDeposit || 0}</p>{" "}
                {/* Total Deposit */}
                <p>Refundable Deposit</p>
              </div>
            </>
          )}
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
                onClick={() =>
                  navigate("/dailyRentPayment", {
                    state: { paymentType: "Daily Rent" },
                  })
                }
                className="cursor-pointer px-4 py-2 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200"
              >
                Daily Rent
              </li>
              <li
                onClick={() =>
                  navigate("/messOnlyPayment", {
                    state: { paymentType: "Mess Only" },
                  })
                }
                className="cursor-pointer px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200"
              >
                Mess Only
              </li>
            </ul>
          </div>
        </div>
      )}
      {showReportModal && (
        <div className="fixed inset-0 ml-60 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generate Monthly Report</h2>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Month:</label>
              <select
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Month</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2000, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Year:</label>
              <select
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={generateMonthlyReport}
                disabled={!reportMonth || isGenerating}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckAuth(PaymentDashboard);


