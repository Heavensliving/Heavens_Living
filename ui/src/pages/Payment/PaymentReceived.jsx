import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentReceived = () => {
  const admin = useSelector(store => store.auth.admin);

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [goToPage, setGoToPage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [propertyFilter, setPropertyFilter] = useState(() => {
    if (admin?.role === 'Main-Admin') return 'totalReceived';
    if (admin?.properties?.length > 0) return admin.properties[0].name;
    return '';
  });
  const [additionalFilter, setAdditionalFilter] = useState('totalReceived');

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [filteredMessPeopleTotal, setFilteredMessPeopleTotal] = useState(0);
  const [filteredDailyRentTotal, setFilteredDailyRentTotal] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!admin) return;
      try {
        const params = {
          search: searchTerm,
          month: selectedMonth,
          year: selectedYear,
          property: propertyFilter,
          type: additionalFilter,
          page,
          limit,
        };

        const response = await axios.get(`${API_BASE_URL}/fee/getAllTransactions`, {
          headers: { Authorization: `Bearer ${admin.token}` },
          params,
        });

        setTransactions(response.data.transactions || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalAmount(response.data.totalAmount || 0);
        setFilteredDailyRentTotal(response.data.filteredDailyRentTotal || 0);
        setFilteredMessPeopleTotal(response.data.filteredMessPeopleTotal || 0);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [admin, searchTerm, selectedMonth, selectedYear, propertyFilter, additionalFilter, page]);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: currentYear - i,
  }));

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Payment Report', 14, 20);
    doc.setFontSize(10);
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 30);

    doc.autoTable({
      startY: 35,
      head: [['#', 'Name', 'Occupant ID', 'Transaction ID', 'Date', 'Monthly Rent', 'Amount Paid']],
      body: transactions.map((transaction, index) => [
        index + 1,
        transaction.name || 'N/A',
        transaction.studentId || 'N/A',
        transaction.transactionId || 'N/A',
        transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A',
        transaction.monthlyRent || 'N/A',
        transaction.amountPaid || 'N/A',
      ]),
    });

    const finalY = doc.lastAutoTable.finalY || 0;
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs.${totalAmount.toFixed(2)}`, 14, finalY + 10);
    doc.save('transactions.pdf');
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
        placeholder="Search by name, ID, or transaction ID"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Reset to page 1 on search
        }}
        className="mb-4 p-3 border border-gray-300 rounded-lg w-full"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-lg mb-1">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
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
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Years</option>
            {years.map(year => (
              <option key={year.value} value={year.value}>{year.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg mb-1">Select Property:</label>
          <select
            value={propertyFilter}
            onChange={(e) => {
              setPropertyFilter(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            {admin.role === 'Main-Admin' && <option value="totalReceived">All Properties</option>}
            {admin.properties.map((property) => (
              <option key={property.id} value={property.name}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg mb-1">Select Filter:</label>
          <select
            value={additionalFilter}
            onChange={(e) => {
              setAdditionalFilter(e.target.value);
              setPage(1);
            }}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="totalReceived">Total Received</option>
            <option value="dailyRent">Daily Rent</option>
            <option value="messOnly">Mess Only</option>
            <option value="occupants">Occupants</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <div className="text-sm text-gray-500">For Selected Filters</div>
        <div className="text-lg font-semibold">
          Total Received: <span className="text-gray-700">₹{totalAmount}</span>
        </div>
        <div className="text-lg font-semibold">
          Daily Rent: <span className="text-gray-700">₹{filteredDailyRentTotal}</span>
        </div>
        <div className="text-lg font-semibold">
          Mess Only: <span className="text-gray-700">₹{filteredMessPeopleTotal}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Name</th>
              <th className="py-3 px-4 border">Monthly Rent</th>
              <th className="py-3 px-4 border">Payment Mode</th>
              <th className="py-3 px-4 border">Transaction ID</th>
              <th className="py-3 px-4 border">Paid Date</th>
              <th className="py-3 px-4 border">Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={transaction.transactionId || index} className="hover:bg-gray-100 transition-colors">
                  <td className="py-2 px-4 border">{(page - 1) * limit + index + 1}</td>
                  <td className="py-2 px-4 border">{transaction.name || 'N/A'}</td>
                  <td className="py-2 px-4 border text-center">{transaction.monthlyRent || 'Daily Rent'}</td>
                  <td className="py-2 px-4 border text-center">{transaction.paymentMode || 'N/A'}</td>
                  <td className="py-2 px-4 border text-center">
                    {transaction.paymentMode === 'Cash'
                      ? `Collected By ${transaction.collectedBy}`
                      : transaction.transactionId || 'N/A'}
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {transaction.paymentDate
                      ? new Date(transaction.paymentDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border text-center">{transaction.amountPaid || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">Page {page} of {totalPages}</span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

        {/* 🔽 Go to Page Input */}
        <input
          type="number"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          placeholder="Go to page"
          className="w-20 px-2 py-1 border rounded"
          min="1"
          max={totalPages}
        />
        <button
          onClick={() => {
            const targetPage = parseInt(goToPage);
            if (!isNaN(targetPage)) {
              handlePageChange(targetPage);
              setGoToPage(''); // Clear after navigation
            }
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go
        </button>
      </div>

    </div>
  );
};

export default CheckAuth(PaymentReceived);
