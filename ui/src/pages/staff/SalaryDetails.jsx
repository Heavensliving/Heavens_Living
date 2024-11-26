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
                    className="self-center mt-4 bg-side-bar hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SalaryDetails;
