import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Make sure to import the autoTable plugin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
import ImageModal from '../../components/reUsableComponet/ImageModal';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpenseTable = () => {
  const navigate = useNavigate();
  const admin = useSelector(store => store.auth.admin);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Track image loading state

  useEffect(() => {
    if (!admin) return;
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });
        setExpenses(response.data.expenses.reverse());
      } catch (error) {
        setError('Error fetching expenses');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleRowClick = (expense) => {
    if (expense.billImg) {
      setModalImageSrc(expense.billImg);
    } else {
      setModalImageSrc("No bill available currently.");
    }
    setIsModalOpen(true);
  };


  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc('');
  };

  // Filter expenses based on the search term
  const filteredExpenses = expenses.filter(expense =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Further filter by category, month, and year
  const Expenses = filteredExpenses.filter(expense => {
    const date = new Date(expense.date);
    const monthMatches = selectedMonth ? date.getMonth() + 1 === parseInt(selectedMonth) : true;
    const yearMatches = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;
    const categoryMatches = selectedCategory ? expense.category === selectedCategory : true;
    const typeMatches = selectedType ? expense.type === selectedType : true;

    return monthMatches && yearMatches && categoryMatches && typeMatches;
  });

  const sortedExpenses = [...Expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate total amount and total salary
  const totalAmount = sortedExpenses.reduce((total, expense) => total + expense.amount, 0);
  const totalSalary = sortedExpenses
    .filter(expense => expense.category.toLowerCase() === 'salary') // Filter by 'salary' category
    .reduce((total, expense) => total + expense.amount, 0);

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

    // Add the total amounts (Total Amount and Total Salary)
    doc.setFontSize(12);
    doc.text(`Total Amount: ${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Salary: ${totalSalary.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);

    // Save the PDF
    doc.save('transactions.pdf');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Create arrays for month options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));

  // Get unique categories from expenses for filtering
  const categories = [...new Set(expenses.map(expense => expense.category))];
  const types = [...new Set(expenses.map(expense => expense.type))];

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <button
        onClick={downloadPDF}
        className="mb-4 p-3 bg-side-bar text-white rounded-lg hover:bg-[#373082] transition"
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Category Dropdown */}
        <div>
          <label className="block text-lg mb-1">Filter by Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

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

      {/* Total Amount and Total Salary Display */}
      <div className="flex justify-between mb-4">
        <div></div>
        <div className="text-lg font-semibold">
          Total Amount: <span className="text-gray-700">{totalAmount.toFixed(2)}</span>
        </div>
        <div className="text-lg font-semibold">
          Total Salary: <span className="text-gray-700">{totalSalary.toFixed(2)}</span>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-300 text-black">
          <tr>
            <th className="py-3 px-4 border">#</th>
            <th className="py-3 px-4 border">Title</th>
            <th className="py-3 px-4 border">Type</th>
            <th className="py-3 px-4 border">Category</th>
            <th className="py-3 px-4 border">Payment</th>
            <th className="py-3 px-4 border">Amount</th>
            <th className="py-3 px-4 border">Date</th>
            <th className="py-3 px-4 border">Property</th>
            <th className="py-3 px-4 border">Transaction ID</th>
            <th className="py-3 px-4 border">Bill</th>
            <th className="py-3 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.length > 0 ? (
            sortedExpenses.map((expense, index) => {
              const defaultImage = 'https://jkfenner.com/wp-content/uploads/2019/11/default.jpg';
              return (
                <tr
                  key={expense._id}
                  className="hover:bg-gray-100 transition-colors group" // Added group class to tr for hover effect
                >
                  <td className="py-2 px-4 border text-center">{index + 1}</td>
                  <td className="py-2 px-4 border relative">{expense.title}
                    {/* Tooltip */}
                    {expense.otherReason && (
                      <div className="absolute top-8 -translate-x-1/2 -translate-y-full bg-gray-800 text-white text-sm p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {expense.otherReason}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border text-center">{expense.type}</td>
                  <td className="py-2 px-4 border text-center">{expense.category}</td>
                  <td className="py-2 px-4 border text-center">{expense.paymentMethod}</td>
                  <td className="py-2 px-4 border text-center">{expense.amount}</td>
                  <td className="py-2 px-4 border text-center">
                    {new Date(expense.date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="py-2 px-4 border text-center">{expense.propertyName}</td>
                  <td className="py-2 px-4 border text-center">
                    {expense.paymentMethod === 'Petty Cash'
                      ? `Handled by ${expense.handledBy}`
                      : expense.transactionId || '-'}
                  </td>
                  <td className={`py-2 px-4 border text-center ${expense.billImg ? 'cursor-pointer' : ''}`}>
                    {expense.billImg ? (
                      <img
                        src={isLoading ? defaultImage : expense.billImg}
                        alt="Bill"
                        onLoad={() => setIsLoading(false)}
                        onClick={() => handleRowClick(expense)}
                      />
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border text-center cursor-pointer">
                    <FaEdit className="m-auto text-center" onClick={() => navigate(`/editExpense/${expense._id}`)} />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="py-3 px-4 text-center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={modalImageSrc}
        altText="&nbsp; No bill available &nbsp;&nbsp;&nbsp;"
      />
    </div>
  );
};

export default CheckAuth(ExpenseTable);
