import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';

const SalaryDetails = ({ onClose, slideIn }) => {
    const admin = useSelector((store) => store.auth.admin);
    const { staffId } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [totalSalary, setTotalSalary] = useState([]);

    useEffect(() => {
        if (staffId) {
            axios
                .get(`${API_BASE_URL}/expense/staff/${staffId}`, {
                    headers: { Authorization: `Bearer ${admin.token}` },
                })
                .then((response) => {
                    console.log(response.data);
                    if (response.data.length > 0) {
                        setExpenses(response.data.reverse());
                        const totalAmount = response.data.reduce((sum, expense) => sum + (expense.amount || 0), 0);
                        setTotalSalary(totalAmount);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching salary data:', error);
                });
        }
    }, [staffId, admin.token]);

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${slideIn ? 'translate-x-0' : 'translate-x-full'
                } z-50`}
        >
            <div className="p-4 h-full flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
                    Salary Overview
                </h2>
                <div className="text-center bg-gray-100 p-3 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm font-semibold">Total Salary Paid</p>
                    <p className="text-xl font-bold text-green-600">₹{totalSalary}</p>
                </div>
                <div className="overflow-y-auto hide-scrollbar flex-grow">
                    {expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <div
                                key={expense._id}
                                className="p-3 mb-3 rounded-lg shadow-sm flex flex-col space-y-1 bg-green-50"
                            >
                                <div className="flex justify-end items-end">
                                    <FiCheckCircle className="text-green-500 text-lg" />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Amount Paid</strong>
                                        </p>
                                        <p className="text-md text-gray-900">
                                            ₹{expense.amount}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Payment Method</strong>
                                        </p>
                                        <p className="text-md text-gray-900">
                                            {expense.paymentMethod}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Transaction ID</strong>
                                        </p>
                                        <p className="text-md text-gray-900">
                                            {expense.transactionId || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 text-sm">
                                            <strong>Date of Payment</strong>
                                        </p>
                                        <p className="text-md text-gray-900">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">
                            No salary details found
                        </p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="self-center mt-4 bg-side-bar hover:bg-[#373082] text-white font-medium py-2 px-4 rounded-lg shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SalaryDetails;

// import React, { useEffect, useState } from 'react';
// import { FiCheckCircle } from 'react-icons/fi';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// import { useSelector } from 'react-redux';

// const SalaryDetails = ({ onClose, slideIn }) => {
//     const admin = useSelector((store) => store.auth.admin);
//     const { staffId } = useParams();

//     // State variables
//     const [expenses, setExpenses] = useState([]);
//     const [totalSalaryPaid, setTotalSalaryPaid] = useState(0);
//     const [monthlySalary, setMonthlySalary] = useState(0);  
//     const [pendingSalary, setPendingSalary] = useState(0);

//     useEffect(() => {
//         if (staffId) {
//             // Fetch Salary Transactions
//             axios.get(`${API_BASE_URL}/expense/salary-overview/${staffId}`, {
//                 headers: { Authorization: `Bearer ${admin.token}` },
//             })
//                 .then((response) => {
//                     console.log(response.data)
//                     if (response.data.transactions.length > 0) {
//                         const salaryTransactions = response.data.transactions.filter(expense => expense.category === "Salary");
//                         setExpenses(salaryTransactions.reverse());

//                         // Calculate total salary paid
//                         const totalAmount = salaryTransactions.reduce((sum, expense) => sum + (expense.amount || 0), 0);
//                         setTotalSalaryPaid(totalAmount);
//                     } else {
//                         setExpenses([]);  // No salary transactions found
//                         setTotalSalaryPaid(0); // No salary paid
//                     }
//                 })
//                 .catch((error) => {
//                     if (error.response && error.response.status === 404) {
//                         console.warn('No salary records found.');
//                         setExpenses([]);
//                         setTotalSalaryPaid(0);
//                     } else {
//                         console.error('Error fetching salary data:', error);
//                     }
//                 });

//             // Fetch Staff's Monthly Salary
//             axios.get(`${API_BASE_URL}/staff/${staffId}`, {
//                 headers: { Authorization: `Bearer ${admin.token}` },
//             })
//                 .then((response) => {
//                     if (response.data) {
//                         setMonthlySalary(response.data.Salary || 0);
//                     }
//                 })
//                 .catch((error) => console.error('Error fetching staff salary:', error));
//         }
//     }, [staffId, admin.token]);

//     // Calculate Pending Salary
//     useEffect(() => {
//         setPendingSalary(Math.max(monthlySalary - totalSalaryPaid, 0));
//     }, [totalSalaryPaid, monthlySalary]);

//     return (
//         <div className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${slideIn ? 'translate-x-0' : 'translate-x-full'} z-50`}>
//             <div className="p-4 h-full flex flex-col">
//                 <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
//                     Salary Overview
//                 </h2>

//                 <div className="flex justify-between gap-4 mb-4">
//                     <div className="bg-gray-100 p-3 rounded-lg flex-1 text-center">
//                         <p className="text-gray-700 text-sm font-semibold">Monthly Salary</p>
//                         <p className="text-xl font-bold text-blue-600">₹{monthlySalary}</p>
//                     </div>
//                     <div className="bg-gray-100 p-3 rounded-lg flex-1 text-center">
//                         <p className="text-gray-700 text-sm font-semibold">Total Salary Paid</p>
//                         <p className="text-xl font-bold text-green-600">₹{totalSalaryPaid}</p>
//                     </div>
//                     <div className="bg-gray-100 p-3 rounded-lg flex-1 text-center">
//                         {pendingSalary > 0 ? (
//                             <>
//                                 <p className="text-gray-700 text-sm font-semibold">Pending Salary</p>
//                                 <p className="text-xl font-bold text-red-600">₹{pendingSalary}</p>
//                             </>
//                         ) : (
//                             <p className="text-gray-700 text-sm font-semibold flex items-center justify-center">
//                                 <FiCheckCircle className="text-green-500 text-lg mr-1" /> Monthly Salary Paid
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 <div className="overflow-y-auto hide-scrollbar flex-grow">
//                     {expenses.length > 0 ? (
//                         expenses.map((expense) => (
//                             <div key={expense._id} className="p-3 mb-3 rounded-lg shadow-sm flex flex-col space-y-1 bg-green-50">
//                                 <div className="flex justify-end items-end">
//                                     <FiCheckCircle className="text-green-500 text-lg" />
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-2">
//                                     <div>
//                                         <p className="text-gray-700 text-sm"><strong>Amount Paid</strong></p>
//                                         <p className="text-md text-gray-900">₹{expense.amount}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-700 text-sm"><strong>Payment Method</strong></p>
//                                         <p className="text-md text-gray-900">{expense.paymentMethod}</p>
//                                     </div>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-2">
//                                     <div>
//                                         <p className="text-gray-700 text-sm"><strong>Transaction ID</strong></p>
//                                         <p className="text-md text-gray-900">{expense.transactionId || 'N/A'}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-700 text-sm"><strong>Date of Payment</strong></p>
//                                         <p className="text-md text-gray-900">{new Date(expense.date).toLocaleDateString()}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-gray-500 text-center">No salary details found</p>
//                     )}
//                 </div>

//                 <button onClick={onClose} className="self-center mt-4 bg-side-bar hover:bg-[#373082] text-white font-medium py-2 px-4 rounded-lg shadow-lg">
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SalaryDetails;