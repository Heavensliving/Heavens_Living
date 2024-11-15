import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';

const PaymentReceived = () => {
  const admin = useSelector(store => store.auth.admin);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fee`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setTransactions(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const furtherFilteredTransactions = filteredTransactions.filter(transaction => {
    const date = new Date(transaction.paymentDate);
    const monthMatches = selectedMonth ? date.getMonth() + 1 === parseInt(selectedMonth) : true;
    const yearMatches = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;

    return monthMatches && yearMatches;
  });

  const totalAmount = furtherFilteredTransactions.reduce((acc, transaction) => acc + (transaction.amountPaid || 0), 0);

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
    doc.text('Payment Report', 14, 20);
    doc.setFontSize(10);
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 30);
  
    // Add the table
    doc.autoTable({
      startY: 35,
      head: [['#', 'Name', 'Occupant ID', 'Transaction ID', 'Date', 'Monthly Rent', 'Amount Paid']],
      body: furtherFilteredTransactions.map((transaction, index) => [
        index + 1,
        transaction.name || 'N/A',
        transaction.studentId || 'N/A',
        transaction.transactionId || 'N/A',
        transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A',
        transaction.rentAmount || 'N/A',
        transaction.amountPaid || 'N/A',
      ]),
    });
  
    // Calculate the Total Amount
    const totalAmount = furtherFilteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.amountPaid || 0); // Default to 0 if amountPaid is undefined
    }, 0);
  
    // Add Total Amount Below Table
    const finalY = doc.lastAutoTable.finalY || 0; // Get the Y position after the table
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs.${totalAmount.toFixed(2)}`, 14, finalY + 10);
  
    // Save the PDF
    doc.save('transactions.pdf');
  };
  

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
        placeholder="Search by name, ID, or transaction ID"
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

      <div className="flex justify-between mb-4">
        <div></div>
        <div className="text-lg font-semibold">
          Total Amount: <span className="text-gray-700">₹{totalAmount}</span>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-300 text-black">
          <tr>
            <th className="py-3 px-4 border">#</th>
            <th className="py-3 px-4 border">Name</th>
            <th className="py-3 px-4 border">Occupant ID</th>
            <th className="py-3 px-4 border">Transaction ID</th>
            <th className="py-3 px-4 border">Date</th>
            <th className="py-3 px-4 border">Monthly Rent</th>
            <th className="py-3 px-4 border">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {furtherFilteredTransactions.length > 0 ? (
            furtherFilteredTransactions.map((transaction, index) => (
              <tr key={transaction.transactionId || index} className="hover:bg-gray-100 transition-colors">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{transaction.name || 'N/A'}</td>
                <td className="py-2 px-4 border">{transaction.studentId || 'N/A'}</td>
                <td className="py-2 px-4 border">{transaction.transactionId || 'N/A'}</td>
                <td className="py-2 px-4 border">{transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A'}</td>
                <td className="py-2 px-4 border">{transaction.rentAmount || 'N/A'}</td>
                <td className="py-2 px-4 border">{transaction.amountPaid || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default PaymentReceived;
