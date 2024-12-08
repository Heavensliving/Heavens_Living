import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CheckAuth from "../auth/CheckAuth";


const PendingPaymentsPage = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!admin) return;
    const fetchPendingPayments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/fee/payments/pendingPayments`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        // console.log(response.data) // debug statement
        setPendingPayments(response.data);
      } catch (error) {
        setError(`${error}`,"Error fetching pending payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, [admin.token]);

  const filteredTransactions = pendingPayments.filter(payment => {
    const matchesSearch = searchTerm
      ? payment.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      payment.studentId?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      : true;

    const date = new Date(payment.lastPaidDate);
    const monthMatches = selectedMonth
      ? date.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const yearMatches = selectedYear
      ? date.getFullYear() === parseInt(selectedYear)
      : true;

    return matchesSearch && monthMatches && yearMatches;
  });

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => ({
    value: year,
    label: year
  }));
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header Section
    doc.setFontSize(18);
    doc.text('Pending Payments Report', 14, 20);
    doc.setFontSize(10);
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 30);

    // Table Content
    const tableData = filteredTransactions.map((payment, index) => [
      index + 1,
      payment.name || "N/A",
      payment.studentId || "N/A",
      payment.monthlyRent || "N/A",
      payment.lastPaidDate ? new Date(payment.lastPaidDate).toLocaleDateString() : null,
      payment.paymentClearedMonthYear || "N/A",
      payment.pendingRentAmount || "0",
    ]);

    // Add the table
    doc.autoTable({
      startY: 40,
      head: [
        ['#', 'Name', 'Student ID', 'Rent Amount', 'Last Paid Date', 'Cleared Month', 'Total Due Amount'],
      ],
      body: tableData,
    });

    // Total Amount Calculation
    // const totalDueAmount = filteredTransactions.reduce((sum, payment) => sum + (parseFloat(payment.pendingRentAmount) || 0), 0);

    // Add Total Below the Table
    const finalY = doc.lastAutoTable.finalY || 0;
    doc.setFontSize(12);
    doc.text(`Total Pending Amount: Rs.${totalDueAmount.toFixed(2)}`, 14, finalY + 10);

    // Save the PDF
    doc.save('Pending_Payments_Report.pdf');
  };

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg min-h-screen">
      <button
        onClick={downloadPDF}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Download Report
      </button>

      <input
        type="text"
        placeholder="Search by name, ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-lg mb-1">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setSelectedYear('');
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Months</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg mb-1">Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year.value} value={year.value}>{year.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
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
              {filteredTransactions.map((payment) => (
                <tr
                  key={payment.studentId}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4 border text-sm">{payment.name || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.studentId || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.monthlyRent || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">
                    {payment.lastPaidDate
                      ? new Date(payment.lastPaidDate).toLocaleDateString()
                      : "Not Found"}
                  </td>
                  <td className="py-2 px-4 border text-sm">{payment.paymentClearedMonthYear || "Not Found"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.pendingRentAmount || payment.monthlyRent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CheckAuth(PendingPaymentsPage);
