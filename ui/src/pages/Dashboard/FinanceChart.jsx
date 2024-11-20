import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinanceChart = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [totalReceived, setTotalReceived] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    // Fetch fee transactions for 'Total Received'
    const fetchFeeData = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        const feeTransactions = feeResponse.data;

        const monthlyReceivedData = feeTransactions.reduce((acc, transaction) => {
          const month = new Date(transaction.createdAt).getMonth();
          acc[month] = (acc[month] || 0) + (transaction.amountPaid || 0);
          return acc;
        }, {});

        const sortedMonths = Object.keys(monthlyReceivedData).sort((a, b) => a - b);
        setMonths(
          sortedMonths.map((monthIndex) =>
            new Date(0, monthIndex).toLocaleString('default', { month: 'long' })
          )
        );
        setTotalReceived(
          sortedMonths.map((month) => monthlyReceivedData[month] || 0)
        );
      } catch (error) {
        console.error('Error fetching fee data:', error);
      }
    };

    // Fetch monthly expenses
    const fetchExpenseData = async () => {
      try {
        const expenseResponse = await axios.get(`${API_BASE_URL}/expense/monthlyExpense`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
console.log(expenseResponse.data)
        const expenseData = expenseResponse.data.totalExpense; // Backend response structure
        const monthlyExpenseData = expenseData.reduce((acc, expense) => {
          const month = expense._id.month - 1; // Adjusting for zero-based months
          acc[month] = (acc[month] || 0) + (expense.totalAmount || 0);
          return acc;
        }, {});

        const sortedMonths = Object.keys(monthlyExpenseData).sort((a, b) => a - b);
        setTotalExpense(sortedMonths.map((month) => monthlyExpenseData[month] || 0));
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchFeeData();
    fetchExpenseData();
  }, [admin.token]);

  // Align months for both datasets
  const alignedMonths = months.length ? months : totalReceived.map((_, idx) => new Date(0, idx).toLocaleString('default', { month: 'long' }));

  const data = {
    labels: alignedMonths,
    datasets: [
      {
        label: 'Total Received',
        data: totalReceived,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Expenses',
        data: totalExpense,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="p-4">
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Finance Overview</h2>

        {/* Bar chart */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default FinanceChart;
