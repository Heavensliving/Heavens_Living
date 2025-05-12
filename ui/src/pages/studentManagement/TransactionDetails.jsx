import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TransactionDetails = ({ onClose, slideIn }) => {
    const admin = useSelector(store => store.auth.admin);
    const { studentId } = useParams();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (studentId) {
            axios
                .get(`${API_BASE_URL}/fee/${studentId}`, {
                    headers: { 'Authorization': `Bearer ${admin.token}` }
                })
                .then((response) => {
                    if (response.data.length > 0) {
                        setTransactions(response.data.reverse());
                    }
                })
                .catch((error) => {
                    console.error("Error fetching transaction data:", error);
                });
        }
    }, [studentId, admin.token]);

    const renderPaymentMode = (mode) => (
        <span className={`text-xs font-semibold inline-block px-2 py-1 rounded-full ${mode === 'Cash' ? 'bg-yellow-100 text-yellow-800' :
            mode === 'UPI' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
            }`}>
            {mode}
        </span>
    );

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${slideIn ? 'translate-x-0' : 'translate-x-full'
                } z-50`}
        >
            <div className="p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Transaction Overview</h2>

                <div className="overflow-y-auto hide-scrollbar flex-grow space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <div key={transaction._id} className="p-5 rounded-xl shadow-lg border border-gray-200 bg-white space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <FiCheckCircle className="text-green-500 text-xl" />
                                        <h3 className="text-md font-semibold text-gray-800">Transaction ID</h3>
                                    </div>
                                    <p className="text-gray-700 text-sm">{transaction.transactionId}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Amount Paid</p>
                                        <p className="font-medium text-gray-900">&#8377; {transaction.amountPaid}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Payment Date</p>
                                        <p className="font-medium text-gray-900">{new Date(transaction.paymentDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {transaction.isDepositPayment ? (
                                    <div>
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                                            Deposit
                                        </span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Rent Occupied Month</p>
                                            <p className="font-medium text-gray-900">
                                                {transaction.paymentClearedMonthYear || transaction.rentMonth || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Payment Mode</p>
                                            {renderPaymentMode(transaction.paymentMode)}
                                        </div>
                                    </div>
                                )}

                                {transaction.paymentMode === 'Cash' && transaction.collectedBy && (
                                    <div className="text-sm">
                                        <p className="text-gray-500">Collected By</p>
                                        <p className="font-medium text-gray-900">{transaction.collectedBy}</p>
                                    </div>
                                )}

                                {transaction.waveOff > 0 && (
                                    <div className="flex items-center space-x-2 text-sm text-red-600 font-medium">
                                        <FiAlertCircle className="text-red-500" />
                                        <span>Wave-Off: ₹{transaction.waveOff}</span>
                                    </div>
                                )}

                                {transaction.advanceBalance > 0 && (
                                    <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                                        <FiTrendingUp className="text-blue-500" />
                                        <span>Advance: ₹{transaction.advanceBalance}</span>
                                    </div>
                                )}

                                {transaction.pendingBalance > 0 && (
                                    <div className="flex items-center space-x-2 text-sm text-yellow-600 font-medium">
                                        <FiClock className="text-yellow-500" />
                                        <span>Pending: ₹{transaction.pendingBalance}</span>
                                    </div>
                                )}

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No transaction details found</p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="self-center mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TransactionDetails;
