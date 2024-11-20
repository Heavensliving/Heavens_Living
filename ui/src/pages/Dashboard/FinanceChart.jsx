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


    // Check if the response contains the expected data
    const expenseData = expenseResponse.data;
   

    if (!expenseData || expenseData.length === 0) {
      console.error('No expense data available');
      return;
    }

    // Process the expense data to get the total expense by month
    const monthlyExpenseData = expenseData.reduce((acc, expense) => {
      const month = expense.month - 1; // Adjusting for zero-based months
      acc[month] = (acc[month] || 0) + (expense.totalExpense || 0);
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
    <div>
      <div>
        <h2 className="text-lg font-semibold mb-8 text-center sm:text-left">Finance Overview</h2>

        {/* Bar chart with adjusted size */}
        <Bar
          data={data}
          options={options}
          style={{ marginTop: '-40px', maxHeight: '350px', maxWidth: '100%' }} // Adjusted size
        />
      </div>
    </div>
  );
};

export default FinanceChart;
