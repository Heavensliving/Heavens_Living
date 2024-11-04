import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Make sure to import the autoTable plugin

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/expense/');
        setExpenses(response.data.expenses);
      } catch (error) {
        setError('Error fetching expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter expenses based on the search term
  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Further filter by type, month, and year
  const sortedExpenses = filteredExpenses.filter(expense => {
    const date = new Date(expense.date);
    const monthMatches = selectedMonth ? date.getMonth() + 1 === parseInt(selectedMonth) : true;
    const yearMatches = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;
    const typeMatches = selectedType ? expense.type === selectedType : true;

    return monthMatches && yearMatches && typeMatches;
  });

  // Calculate total amount
  const totalAmount = sortedExpenses.reduce((total, expense) => total + expense.amount, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); 
    doc.text('Expense Report', 14, 20);
    doc.setFontSize(10); 
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 30); 

    // Add the table
    doc.autoTable({
      startY: 35,
      head: [['#', 'Title', 'Type', 'Category', 'Payment Method', 'Amount', 'Date', 'Property Name', 'Transaction ID']],
      body: sortedExpenses.map((expense, index) => [
        index + 1,
        expense.title,
        expense.type,
        expense.category,
        expense.paymentMethod,
        expense.amount,
        new Date(expense.date).toLocaleDateString(),
        expense.propertyName,
        expense.transactionId,
      ]),
    });

    doc.save('transactions.pdf');
  };

  if (loading) {
    return <p className="text-center">Loading expenses...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Create arrays for month and type options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  const types = ['pg', 'mess'];

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
    
      <button 
        onClick={downloadPDF}
        className="mb-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 w-full"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Type Dropdown */}
        <div>
          <label className="block text-lg mb-1">Filter by Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Types</option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div>
          <label className="block text-lg mb-1">Filter by Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Months</option>
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div>
          <label className="block text-lg mb-1">Filter by Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Years</option>
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
      </div>

      {/* Download PDF Button */}
     

      {/* Total Amount Display */}
      <div className="flex justify-between mb-4">
        <div></div>
        <div className="text-lg font-semibold">
          Total Amount: <span className="text-gray-700">{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-300 text-black">
          <tr>
            <th className="py-3 px-4 border">#</th>
            <th className="py-3 px-4 border">Title</th>
            <th className="py-3 px-4 border">Type</th>
            <th className="py-3 px-4 border">Category</th>
            <th className="py-3 px-4 border">Payment Method</th>
            <th className="py-3 px-4 border">Amount</th>
            <th className="py-3 px-4 border">Date</th>
            <th className="py-3 px-4 border">Property Name</th>
            <th className="py-3 px-4 border">Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.length > 0 ? (
            sortedExpenses.map((expense, index) => (
              <tr key={expense._id} className="hover:bg-gray-100 transition-colors">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{expense.title}</td>
                <td className="py-2 px-4 border">{expense.type}</td>
                <td className="py-2 px-4 border">{expense.category}</td>
                <td className="py-2 px-4 border">{expense.paymentMethod}</td>
                <td className="py-2 px-4 border">{expense.amount}</td>
                <td className="py-2 px-4 border">{new Date(expense.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{expense.propertyName}</td>
                <td className="py-2 px-4 border">{expense.transactionId}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-gray-500">No expenses found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
