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
  const [selectedMonth, setSelectedMonth] = useState(''); 

  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
    
        const feeTransactions = feeResponse.data;
    
        // Debugging: Log fetched data
        // console.log('Fee Transactions:', feeTransactions);
    
        // Initialize all months with zero
        const allMonths = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString('default', { month: 'long' })
        );
        setMonths(allMonths);
    
        // Create an array to hold total received for each month
        const monthlyReceivedData = Array(12).fill(0);
    
        // Process each transaction
        feeTransactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.paymentDate); // Parse the date
          const monthIndex = transactionDate.getMonth(); // Get month index (0-11)
    
          // Debugging: Log the month index and amount
          // console.log(
          //   `Transaction Date: ${transactionDate}, Month Index: ${monthIndex}, Amount: ${transaction.amountPaid}`
          // );
    
          // Aggregate total for the corresponding month
          monthlyReceivedData[monthIndex] += transaction.amountPaid || 0;
        });
    
        // Debugging: Log the aggregated data
        console.log('Monthly Received Data:', monthlyReceivedData);
    
        // Update state with the aggregated data
        setTotalReceived(monthlyReceivedData);
      } catch (error) {
        console.error('Error fetching fee data:', error);
      }
    };
    
    
    
  
    const fetchExpenseData = async () => {
      try {
        const expenseResponse = await axios.get(`${API_BASE_URL}/expense/monthlyExpense`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
  
        const expenseData = expenseResponse.data;
  
        // Initialize all months with zero
        const monthlyExpenseData = Array(12).fill(0);
  
        expenseData.forEach((expense) => {
          const month = expense.month - 1; // Convert to zero-based index
          monthlyExpenseData[month] += expense.totalExpense || 0; // Add to respective month
        });
  
        setTotalExpense(monthlyExpenseData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };
  
    fetchFeeData();
    fetchExpenseData();
  }, [admin.token]);
  

  // Filter data based on the selected month
  const filteredData = {
    labels: months,
    datasets: [
      {
        label: 'Total Received',
        data: selectedMonth
          ? [totalReceived[months.indexOf(selectedMonth)] || 0]
          : totalReceived,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Expenses',
        data: selectedMonth
          ? [totalExpense[months.indexOf(selectedMonth)] || 0]
          : totalExpense,
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
    <div className="relative">
      {/* Month filter dropdown aligned to top-right */}
     

      <div>
        <h2 className="text-lg font-semibold mb-8 text-center sm:text-left">Finance Overview</h2>

        {/* Bar chart */}
        <Bar
          data={filteredData}
          options={options}
          style={{ marginTop: '-40px', maxHeight: '350px', maxWidth: '100%' }}
        />
      </div>
    </div>
  );
};

export default FinanceChart;
