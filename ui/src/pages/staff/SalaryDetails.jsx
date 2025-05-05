import React, { useEffect, useState } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SalaryDetails = ({ onClose, slideIn }) => {
    const admin = useSelector((store) => store.auth.admin);
    const { staffId } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [totalSalary, setTotalSalary] = useState(0);
    const [salaryMonths, setSalaryMonths] = useState([]);
    const [viewMode, setViewMode] = useState('transactions'); // or 'monthly'
    const [salary, setSalary] = useState(0);

    useEffect(() => {
        if (staffId) {
            axios
                .get(`${API_BASE_URL}/expense/staff/${staffId}`, {
                    headers: { Authorization: `Bearer ${admin.token}` },
                })
                .then((response) => {
                    const { expenses, salaryMonths, salary } = response.data;
                    setSalary(salary);
                    if (expenses.length > 0) {
                        setExpenses(expenses.reverse());
                        const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
                        setTotalSalary(totalAmount);
                    }
                    if (salaryMonths) {
                        setSalaryMonths(salaryMonths);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching salary data:', error);
                });
        }
    }, [staffId, admin.token]);

    const toggleView = () => {
        setViewMode((prev) => (prev === 'transactions' ? 'monthly' : 'transactions'));
    };

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${slideIn ? 'translate-x-0' : 'translate-x-full'
                } z-50`}
        >
            <div className="p-4 h-full flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-4">
                    Salary Overview
                </h2>

                <button
                    onClick={toggleView}
                    className="mb-4 bg-side-bar hover:bg-[#373082] text-white font-medium py-2 px-4 rounded-lg shadow"
                >
                    {viewMode === 'transactions' ? 'View Monthly Salary Overview' : 'View Transaction Overview'}
                </button>

                {viewMode === 'transactions' ? (
                    <>
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
                    </>
                ) : (
                    <div className="overflow-y-auto hide-scrollbar flex-grow space-y-4">
                        <div className="overflow-y-auto hide-scrollbar flex-grow space-y-4">
                            {salaryMonths.length > 0 ? (
                                salaryMonths.map((month, index) => {
                                    const leaveDays = month.salaryCut > 0 && salary
                                        ? Math.round((month.salaryCut / salary) * 30)
                                        : null;

                                    return (
                                        <div
                                            key={index}
                                            className=" shadow-sm rounded-lg px-5 py-4 bg-green-50"
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <h3 className="text-base font-semibold text-gray-800">
                                                    {month.monthYear}
                                                </h3>
                                                <span
                                                    className={`text-xs font-medium px-2 py-1 rounded-full ${month.status === 'Paid'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    {month.status}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-700 space-y-1">
                                                <p>
                                                    <span className="font-medium text-gray-600">Paid:</span> ₹{month.paidAmount.toLocaleString()}
                                                </p>

                                                {month.salaryCut > 0 && salary > 0 && (
                                                    <p>
                                                        <span className="font-medium text-gray-600">Salary Cut:</span> ₹{month.salaryCut.toLocaleString()}
                                                    </p>
                                                )}

                                                {month.salaryCut > 0 && salary > 0 && (
                                                    <p className="font-medium text-red-600">
                                                        Leave Taken: {Math.round((month.salaryCut / salary) * 30)} day{Math.round((month.salaryCut / salary) * 30) > 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 text-center">
                                    No monthly summary found
                                </p>
                            )}
                        </div>

                    </div>
                )}

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
