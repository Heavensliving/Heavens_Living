
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from '../auth/CheckAuth';

const PaymentReceived = () => {
  const admin = useSelector(store => store.auth.admin);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [propertyFilter, setPropertyFilter] = useState(() => {
    if (admin?.role === 'Main-Admin') {
      return 'totalReceived';
    } else if (admin?.properties?.length > 0) {
      return admin.properties[0].name; // Use the first property as the default
    } else {
      return ''; // Default to an empty string if no properties are available
    }
  });
  const [additionalFilter, setAdditionalFilter] = useState('totalReceived');

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!admin) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/fee`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        setTransactions(response.data.reverse());
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [admin]);

  const adminProperties = admin?.properties || [];
  const defaultProperty = adminProperties.length > 0 ? adminProperties[0].name : '';

  useEffect(() => {
    if (defaultProperty && !propertyFilter) {
      setPropertyFilter(defaultProperty); // Set default property on initial render
    }
  }, [defaultProperty]);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    transaction.studentId?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    transaction.transactionId?.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
console.log(filteredTransactions.length)
  const furtherFilteredTransactions = filteredTransactions.filter(transaction => {
    const date = new Date(transaction.paymentDate);
    const monthMatches = selectedMonth ? date.getMonth() + 1 === parseInt(selectedMonth) : true;
    const yearMatches = selectedYear ? date.getFullYear() === parseInt(selectedYear) : true;

    return monthMatches && yearMatches;
  });

  // Apply additional filtering based on the selected filter option
  const finalFilteredTransactions = furtherFilteredTransactions.filter(transaction => {
    const propertyMatches =
      propertyFilter === 'totalReceived' ||
      transaction.property === propertyFilter;
    // console.log('Current Property Filter:', propertyFilter);
    // console.log('Transaction Property:', transaction.property);
    const additionalFilterMatches =
      additionalFilter === 'totalReceived' ||
      (additionalFilter === 'dailyRent' && transaction.studentId.startsWith('HVNDR')) ||
      (additionalFilter === 'messOnly' && transaction.studentId.startsWith('HVNMP')) ||
      (additionalFilter === 'occupants' && transaction.studentId.startsWith('HVNS'));

    return propertyMatches && additionalFilterMatches;
  })
  .sort((a, b) => {
    // Ensure we handle null or undefined dates gracefully
    const dateA = new Date(a.paymentDate || 0);
    const dateB = new Date(b.paymentDate || 0);
    return dateB - dateA; // Sort by descending date
  });


  const totalAmount = transactions.reduce(
    (acc, transaction) => acc + (transaction.amountPaid || 0),
    0
  );

  // Totals for selected month and year
  const filteredTotalAmount = finalFilteredTransactions.reduce(
    (acc, transaction) => acc + (transaction.amountPaid || 0),
    0
  );

  const filteredMessPeopleTotal = finalFilteredTransactions
    .filter(transaction => transaction.messPeople)
    .reduce((acc, transaction) => acc + (transaction.amountPaid || 0), 0);

  const filteredDailyRentTotal = finalFilteredTransactions
    .filter(transaction => transaction.dailyRent)
    .reduce((acc, transaction) => acc + (transaction.amountPaid || 0), 0);

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

    doc.setFontSize(18);
    doc.text('Payment Report', 14, 20);
    doc.setFontSize(10);
    doc.text('Date: ' + new Date().toLocaleDateString(), 14, 30);

    doc.autoTable({
      startY: 35,
      head: [['#', 'Name', 'Occupant ID', 'Transaction ID', 'Date', 'Monthly Rent', 'Amount Paid']],
      body: finalFilteredTransactions.map((transaction, index) => [
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
    doc.text(`Total Amount: Rs.${filteredTotalAmount.toFixed(2)}`, 14, finalY + 10);

    doc.save('transactions.pdf');
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
        <div className="mb-4">
          <label className="block text-lg mb-1">Select Filter:</label>
          <select
            value={additionalFilter}
            onChange={(e) => setAdditionalFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400">
            <option value="totalReceived">Total Received</option>
            <option value="dailyRent">Daily Rent</option>
            <option value="messOnly">Mess Only</option>
            <option value="occupants">Occupants</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <div className="flex justify-between w-full items-start">
          <div>
            <div className="text-sm text-gray-500">
              For Selected Month & Year
            </div>
            <div className="text-lg font-semibold">
              Total Received:<span className="text-gray-700"> ₹{filteredTotalAmount}</span>
            </div>
            <div className="text-lg font-semibold">
              Daily Rent: <span className="text-gray-700">₹{filteredDailyRentTotal}</span>
            </div>
            <div className="text-lg font-semibold">
              Mess Only: <span className="text-gray-700">₹{filteredMessPeopleTotal}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='overflow-x-auto'>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-300 text-black">
          <tr>
            <th className="py-3 px-4 border">#</th>
            <th className="py-3 px-4 border">Name</th>
            {/* <th className="py-3 px-4 border">Occupant ID</th> */}
            <th className="py-3 px-4 border">Monthly Rent</th>
            <th className="py-3 px-4 border">Payment Mode</th>
            <th className="py-3 px-4 border">Transaction ID</th>
            <th className="py-3 px-4 border">Paid Date</th>
            <th className="py-3 px-4 border">Paid Amount</th>
          </tr>
        </thead>
        <tbody>
          {finalFilteredTransactions.length > 0 ? (
            finalFilteredTransactions.map((transaction, index) => (
              <tr key={transaction.transactionId || index} className="hover:bg-gray-100 transition-colors">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{transaction.name || 'N/A'}</td>
                {/* <td className="py-2 px-4 border text-center">{transaction.studentId || 'N/A'}</td> */}
                <td className="py-2 px-4 border text-center">{transaction.monthlyRent ? transaction.monthlyRent || 'N/A' : 'Daily Rent'}</td>
                <td className="py-2 px-4 border text-center">{transaction.paymentMode || 'N/A'}</td>
                <td className="py-2 px-4 border text-center">
                  {transaction.paymentMode === 'Cash' ? `Collected By ${transaction.collectedBy}` : (transaction.transactionId || 'N/A')}
                </td>
                <td className="py-2 px-4 border text-center">{transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A'}</td>
                <td className="py-2 px-4 border text-center">{transaction.amountPaid || 'N/A'}</td>
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
    </div>
  );
};

export default CheckAuth(PaymentReceived);