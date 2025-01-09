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
  const [selectedJMonth, setSelectedJMonth] = useState('');
  const [selectedJYear, setSelectedJYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyFilter, setPropertyFilter] = useState('');


  useEffect(() => {
    if (!admin) return;

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

        setPendingPayments(filteredPayments);
        // console.log(filteredPayments)
      } catch (error) {
        setError(`${error}`, "Error fetching pending payments");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, [admin.token]);

  // const filteredTransactions = pendingPayments.filter(payment => {
  //   const matchesSearch = searchTerm
  //     ? payment.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
  //     payment.studentId?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
  //     // payment.transactionId?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
  //     payment.lastPaidDate?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  //     : true;

  //   const date = new Date(payment.paymentClearedMonthYear);
  //   const monthMatches = selectedMonth
  //     ? date.getMonth() + 1 === parseInt(selectedMonth)
  //     : true;
  //   const yearMatches = selectedYear
  //     ? date.getFullYear() === parseInt(selectedYear)
  //     : true;

  //   const propertyMatches =
  //     propertyFilter === '' ||
  //     propertyFilter === 'totalReceived' ||
  //     (payment.propertyName && payment.propertyName.toLowerCase() === propertyFilter.toLowerCase());

  //   return matchesSearch && monthMatches && yearMatches && propertyMatches;
  // });

  const filteredTransactions = pendingPayments.filter(payment => {
    const matchesSearch = searchTerm
      ? payment.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        payment.studentId?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        payment.lastPaidDate?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      : true;
  
    // Parse paymentClearedMonthYear to extract the month and year
    const [clearedMonth, clearedYear] = payment.paymentClearedMonthYear
      ? payment.paymentClearedMonthYear.split(', ').map((value, index) => {
          return index === 0
            ? new Date(`${value} 1, 2000`).getMonth() + 1 // Convert month name to number
            : parseInt(value); // Extract year
        })
      : [null, null];
  
    // Convert selectedMonth and selectedYear to numbers
    const selectedMonthNum = selectedMonth ? parseInt(selectedMonth) : null;
    const selectedYearNum = selectedYear ? parseInt(selectedYear) : null;
  
    // Exclude payments that match OR are greater than the selected month and year
    const isClearedLater =
      clearedYear !== null && clearedMonth !== null && selectedYearNum !== null && selectedMonthNum !== null
        ? clearedYear > selectedYearNum || (clearedYear === selectedYearNum && clearedMonth >= selectedMonthNum)
        : false;
  
    // Extract month and year from joinDate (ISO format "YYYY-MM-DD")
    const joinDate = new Date(payment.joinDate);
    const joinMonth = joinDate.getMonth() + 1; // Month is 0-based, so add 1
    const joinYear = joinDate.getFullYear();
  
    // Join date filter: match payments where join date matches the selected month/year
    const joinDateMatches =
      selectedJMonth && selectedJYear
        ? joinMonth === parseInt(selectedJMonth) && joinYear === parseInt(selectedJYear)
        : true;
  
    const propertyMatches =
      propertyFilter === '' ||
      propertyFilter === 'totalReceived' ||
      (payment.propertyName && payment.propertyName.toLowerCase() === propertyFilter.toLowerCase());
  
    return matchesSearch && !isClearedLater && propertyMatches && joinDateMatches;
  });

  // Calculate the total pending rent amount for the filtered transactions
  const totalPendingRentAmount = filteredTransactions.reduce((total, payment) => {
    return total + (payment.pendingRentAmount || 0); // Use 0 as a fallback if pendingRentAmount is undefined
  }, 0);

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
      payment.contact || "N/A",
      payment.room || "N/A",
      payment.monthlyRent || "N/A",
      payment.joinDate ? new Date(payment.joinDate).toLocaleDateString() : '-',
      payment.lastPaidDate ? new Date(payment.lastPaidDate).toLocaleDateString() : '-',
      payment.paymentClearedMonthYear || "-",
      payment.pendingRentAmount || payment.monthlyRent,
    ]);
    // Add the table
    doc.autoTable({
      startY: 40,
      head: [
        ['#', 'Name', 'Contact', 'room', 'Rent Amount', 'Join Date', 'Last Paid Date', 'Cleared Month', 'Total Due Amount'],
      ],
      body: tableData,
    });

    // Total Amount Calculation
    // const totalDueAmount = filteredTransactions.reduce((sum, payment) => sum + (parseFloat(payment.pendingRentAmount) || 0), 0);

    // // Add Total Below the Table
    // const finalY = doc.lastAutoTable.finalY || 0;
    // doc.setFontSize(12);
    // doc.text(`Total Pending Amount: Rs.${totalDueAmount.toFixed(2)}`, 14, finalY + 10);

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
        className="mb-4 px-4 py-2 bg-side-bar text-white rounded-lg hover:bg-[#373082]"
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
          <label className="block text-lg mb-1">Select Pending Month:</label>
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
          <label className="block text-lg mb-1">Select Pending Year:</label>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-lg mb-1">Select Join Month:</label>
          <select
            value={selectedJMonth}
            onChange={(e) => {
              setSelectedJMonth(e.target.value);
              setSelectedJYear('');
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
          <label className="block text-lg mb-1">Select Join Year:</label>
          <select
            value={selectedJYear}
            onChange={(e) => setSelectedJYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year.value} value={year.value}>{year.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-lg mb-1">Select Property:</label>
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {admin.role === 'Main-Admin' && <option value="totalReceived">All Properties</option>}
          {admin.properties.map((property) => (
            <option key={property.id} value={property.name}>
              {property.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-4">
        <div className="flex justify-between w-full items-start">
          <div>
            <div className="text-sm text-gray-500">
              For Selected Pending/Join Month & Year
            </div>
            <div className="text-lg font-semibold">
              Total Pending:<span className="text-gray-700"> ₹{totalPendingRentAmount}</span>
            </div>
          </div>
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
                <th className="py-3 px-4 border text-left text-sm">#</th>
                <th className="py-3 px-4 border text-left text-sm">Name</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Contact</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Room</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Rent</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Join Date</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Last Paid</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Rent Cleared Month</th>
                <th className="py-3 px-4 border text-left text-sm text-center">Amount To Pay</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((payment, index) => (
                <tr
                  key={payment.studentId}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="py-2 px-4 border text-sm">{index + 1 || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm">{payment.name || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm text-center">{payment.contact || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm text-center">{payment.room || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm text-center">{payment.monthlyRent || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm text-center">{new Date(payment.joinDate).toLocaleDateString() || "N/A"}</td>
                  <td className="py-2 px-4 border text-sm text-center">
                    {payment.lastPaidDate
                      ? new Date(payment.lastPaidDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-2 px-4 border text-sm text-center">{payment.paymentClearedMonthYear || "-"}</td>
                  <td className="py-2 px-4 border text-sm text-center">{payment.pendingRentAmount || payment.monthlyRent}</td>
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
