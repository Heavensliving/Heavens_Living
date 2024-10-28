import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentDashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [totalGave, setTotalGave] = useState(0);
  const [totalGot, setTotalGot] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate for routing

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/fee');
        setTransactions(response.data);

        // Calculate totals for "You Gave" and "You Got"
        let gaveTotal = 0;
        let gotTotal = 0;
        response.data.forEach((transaction) => {
          gaveTotal += transaction.youGave || 0;
          gotTotal += transaction.youGot || 0;
        });

        setTotalGave(gaveTotal);
        setTotalGot(gotTotal);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    
    fetchTransactions();
  }, []);

  const netBalance = totalGot - totalGave;

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filter transactions based on search
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-md shadow-md p-4 w-full h-full">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Transactions Reports</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Download PDF</button>
            <button
              onClick={() => navigate('/feePayment')}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add Payment
            </button>
            <button
              onClick={() => navigate('/AddExpense')}
              className="px-4 py-2 bg-orange-500 text-white rounded-md"
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Search and Period Selection */}
        <div className="flex space-x-6 mb-6">
          <div className="w-1/2">
            <label className="block text-gray-600 mb-2">Customer Name</label>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-600 mb-2">Period</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>This Month</option>
              {/* Add more period options if needed */}
            </select>
          </div>
        </div>

        {/* Totals Display */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="p-4 bg-green-100 text-green-500 rounded-md">
            <p className="text-lg font-semibold">₹{totalGave}</p>
            <p>You Gave</p>
          </div>
          <div className="p-4 bg-red-100 text-red-500 rounded-md">
            <p className="text-lg font-semibold">₹{totalGot}</p>
            <p>You Got</p>
          </div>
          <div className="p-4 bg-yellow-100 text-yellow-500 rounded-md">
            <p className="text-lg font-semibold">₹{netBalance}</p>
            <p>Net Balance</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-600">DATE</th>
                <th className="py-2 text-gray-600">Customer Name</th>
                <th className="py-2 text-gray-600">DETAILS</th>
                <th className="py-2 text-gray-600">YOU GAVE</th>
                <th className="py-2 text-gray-600">YOU GOT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-100">
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">{transactions.customerName}</td>
                  <td className="py-2">{transaction.details}</td>
                  <td className="py-2">₹{transaction.youGave}</td>
                  <td className="py-2">₹{transaction.youGot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;
