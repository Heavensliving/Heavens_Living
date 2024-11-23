// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import API_BASE_URL from '../../config';
// import { useSelector } from 'react-redux';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
// import CheckAuth from '../auth/CheckAuth';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const FinanceChart = () => {
//   const admin = useSelector((store) => store.auth.admin);
//   const [totalReceived, setTotalReceived] = useState([]);
//   const [totalExpense, setTotalExpense] = useState([]);
//   const [months, setMonths] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState('');
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [availableYears, setAvailableYears] = useState([]);

//   useEffect(() => {
//     if (!admin) return;
//     const fetchData = async () => {
//       try {
//         const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
//           headers: { Authorization: `Bearer ${admin.token}` },
//         });
    
//         const feeTransactions = feeResponse.data;

//         // Initialize all months
//         const allMonths = Array.from({ length: 12 }, (_, i) =>
//           new Date(0, i).toLocaleString('default', { month: 'long' })
//         );
//         setMonths(allMonths);
    
//         // Get unique years from fee transactions
//         const years = [...new Set(feeTransactions.map(transaction => 
//           new Date(transaction.paymentDate).getFullYear()
//         ))].sort((a, b) => b - a);
        
//         setAvailableYears(years);
        
//         // Process fee data for selected year
//         const monthlyReceivedData = Array(12).fill(0);
//         feeTransactions
//           .filter(transaction => new Date(transaction.paymentDate).getFullYear() === selectedYear)
//           .forEach((transaction) => {
//             const transactionDate = new Date(transaction.paymentDate);
//             const monthIndex = transactionDate.getMonth();
//             monthlyReceivedData[monthIndex] += Number(transaction.amountPaid) || 0;
//           });
//         setTotalReceived(monthlyReceivedData);
//       } catch (error) {
//         console.error('Error fetching fee data:', error);
//       }
//     };

//     const fetchExpenseData = async () => {
//       try {
//         const expenseResponse = await axios.get(`${API_BASE_URL}/expense/monthlyExpense`, {
//           params: { year: selectedYear },
//           headers: { Authorization: `Bearer ${admin.token}` },
//         });

//         const expenseData = expenseResponse.data;
//         const monthlyExpenseData = Array(12).fill(0);

//         // Log raw data
//         // console.log('Raw Expense Data:', expenseData);
//         // console.log('Selected Year:', selectedYear, typeof selectedYear);

//         // Process data
//         expenseData.forEach((expense) => {
//           // console.log('Processing expense:', expense);
//           // console.log('Expense year:', expense.year, typeof expense.year);
          
//           // Only process if years match
//           if (Number(expense.year) === Number(selectedYear)) {
//             const month = Number(expense.month) - 1;
//             // console.log('Month index:', month);
            
//             if (month >= 0 && month < 12) {
//               monthlyExpenseData[month] = Number(expense.totalExpense) || 0;
//               console.log(`Added ${expense.totalExpense} to month ${month}`);
//             }
//           }
//         });

//         // console.log('Final Monthly Data:', monthlyExpenseData);
//         setTotalExpense(monthlyExpenseData);
//       } catch (error) {
//         console.error('Error fetching expense data:', error);
//         setTotalExpense(Array(12).fill(0));
//       }
//     };

//     fetchData();
//     fetchExpenseData();
//   }, [admin, selectedYear]);
  
//   const filteredData = {
//     labels: months,
//     datasets: [
//       {
//         label: 'Total Received',
//         data: selectedMonth
//           ? [totalReceived[months.indexOf(selectedMonth)] || 0]
//           : totalReceived,
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//       {
//         label: 'Total Expenses',
//         data: selectedMonth
//           ? [totalExpense[months.indexOf(selectedMonth)] || 0]
//           : totalExpense,
//         backgroundColor: 'rgba(255, 99, 132, 0.6)',
//         borderColor: 'rgba(255, 99, 132, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         stacked: false,
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: function(value) {
//             return '₹' + value.toLocaleString('en-IN');
//           }
//         }
//       },
//     },
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: function(context) {
//             let label = context.dataset.label || '';
//             if (label) {
//               label += ': ';
//             }
//             if (context.parsed.y !== null) {
//               label += '₹' + context.parsed.y.toLocaleString('en-IN');
//             }
//             return label;
//           }
//         }
//       },
//     },
//   };

//   return (
//     <div className="relative">
//       <div className="absolute right-0 top-0 z-10">
//         <select
//           value={selectedYear}
//           onChange={(e) => setSelectedYear(Number(e.target.value))}
//           className="p-2 border rounded-md bg-white"
//         >
//           {availableYears.map(year => (
//             <option key={year} value={year}>{year}</option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold mb-8 text-center sm:text-left">
//           Finance Overview - {selectedYear}
//         </h2>

//         <Bar
//           data={filteredData}
//           options={options}
//           style={{ marginTop: '-40px', maxHeight: '350px', maxWidth: '100%' }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CheckAuth(FinanceChart);
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import CheckAuth from '../auth/CheckAuth';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FinanceChart = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [totalReceived, setTotalReceived] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    if (!admin) return;
    const fetchData = async () => {
      try {
        const feeResponse = await axios.get(`${API_BASE_URL}/fee`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
    
        const feeTransactions = feeResponse.data;

        // Initialize all months
        const allMonths = Array.from({ length: 12 }, (_, i) =>
          new Date(0, i).toLocaleString('default', { month: 'long' })
        );
        setMonths(allMonths);
    
        // Get unique years from fee transactions
        const years = [...new Set(feeTransactions.map(transaction => 
          new Date(transaction.paymentDate).getFullYear()
        ))].sort((a, b) => b - a);
        
        setAvailableYears(years);
        
        // Process fee data for selected year
        const monthlyReceivedData = Array(12).fill(0);
        feeTransactions
          .filter(transaction => new Date(transaction.paymentDate).getFullYear() === selectedYear)
          .forEach((transaction) => {
            const transactionDate = new Date(transaction.paymentDate);
            const monthIndex = transactionDate.getMonth();
            monthlyReceivedData[monthIndex] += Number(transaction.amountPaid) || 0;
          });
        setTotalReceived(monthlyReceivedData);
      } catch (error) {
        console.error('Error fetching fee data:', error);
      }
    };

    const fetchExpenseData = async () => {
      try {
        const expenseResponse = await axios.get(`${API_BASE_URL}/expense/monthlyExpense`, {
          params: { year: selectedYear },
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        const expenseData = expenseResponse.data;
        const monthlyExpenseData = Array(12).fill(0);

        expenseData.forEach((expense) => {
          if (Number(expense.year) === Number(selectedYear)) {
            const month = Number(expense.month) - 1;
            if (month >= 0 && month < 12) {
              monthlyExpenseData[month] = Number(expense.totalExpense) || 0;
            }
          }
        });

        setTotalExpense(monthlyExpenseData);
      } catch (error) {
        console.error('Error fetching expense data:', error);
        setTotalExpense(Array(12).fill(0));
      }
    };

    fetchData();
    fetchExpenseData();
  }, [admin, selectedYear]);
  
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
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += '₹' + context.parsed.y.toLocaleString('en-IN');
            }
            return label;
          }
        }
      },
    },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Finance Overview - {selectedYear}
        </h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="p-2 border rounded-md bg-white"
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-h-0">
        <Bar
          data={filteredData}
          options={options}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default CheckAuth(FinanceChart);