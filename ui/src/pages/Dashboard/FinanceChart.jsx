import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';  // Importing the Bar chart component from Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const FinanceChart = () => {
  const admin = useSelector(store => store.auth.admin);
  const [financeData, setFinanceData] = useState([]);
  const [totalReceived, setTotalReceived] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    // Fetch finance data from the backend
    const fetchFinanceData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fee/totalMonthlyRent`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });

        const { totalMonthlyRentStudents } = response.data;

        // Assuming response data is structured by month
        if (Array.isArray(totalMonthlyRentStudents)) {
          setFinanceData(totalMonthlyRentStudents);  // If it's an array, use it directly
        } else {
          setFinanceData([totalMonthlyRentStudents]);  // If it's a single value, wrap it in an array
        }
      } catch (err) {
        console.error('Error fetching finance data:', err);
      }
    };

    // Fetch total received and total expense data
    const fetchTotals = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        const feeTransactions = feeResponse.data;

        const monthlyData = feeTransactions.reduce((acc, transaction) => {
          const month = new Date(transaction.createdAt).getMonth();  // Get the month of the transaction
          if (!acc[month]) {
            acc[month] = { totalReceived: 0, expense: 0 };
          }

          acc[month].totalReceived += transaction.amountPaid || 0;
          acc[month].expense += transaction.expenseAmount || 0;  // Assuming there's an 'expenseAmount' field in your data

          return acc;
        }, {});

        // Extracting the month names dynamically and setting the data arrays
        const sortedMonths = Object.keys(monthlyData).sort((a, b) => a - b); // Sort months
        setMonths(sortedMonths.map(monthIndex => new Date(0, monthIndex).toLocaleString('default', { month: 'long' })));
        
        setTotalReceived(sortedMonths.map(month => monthlyData[month].totalReceived));
        setTotalExpense(sortedMonths.map(month => monthlyData[month].expense));
      } catch (error) {
        console.error('Error fetching fee totals:', error);
      }
    };

    fetchFinanceData();
    fetchTotals();
  }, [admin.token]);

  const data = {
    labels: months,  // Dynamically set month labels
    datasets: [
      {
        label: 'Total Received',
        data: totalReceived,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',  // Light green color for Total Received bars
        borderColor: 'rgba(75, 192, 192, 1)',  // Light green border for bars
        borderWidth: 1,
      },
      {
        label: 'Total Expenses',
        data: totalExpense,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',  // Red color for Total Expenses bars
        borderColor: 'rgba(255, 99, 132, 1)',  // Red border for bars
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: false,  // No stacking, to show bars clearly
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
