import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PaymentHistory = ({ onClose, slideIn }) => {
    const admin = useSelector(store => store.auth.admin);
    const { renterId } = useParams();
    const [transactions, setTransactions] = useState([]); // Set to an array

    useEffect(() => {
        if (renterId) {
            axios
                .get(`${API_BASE_URL}/fee/renter/${renterId}`, {
                    headers: { 'Authorization': `Bearer ${admin.token}` }
                })
                .then((response) => {
                    // console.log(response.data);
                    // Set all transactions if there's more than one
                    if (response.data.length > 0) {
                        setTransactions(response.data.reverse());
                    }
                })
                .catch((error) => {
                    console.error("Error fetching transaction data:", error);
                });
        }
    }, [renterId, admin.token]);

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${slideIn ? 'translate-x-0' : 'translate-x-full'
                } z-50`}
        >
            <div className="p-4 h-full flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-4">Transaction Overview</h2>

                <div className="overflow-y-auto hide-scrollbar flex-grow">
                    {transactions.length > 0 ? (
                        // Reverse the transactions array to display them in reverse order
                        transactions.map((transaction) => (
                            <div key={transaction._id} className="p-3 mb-3 rounded-lg shadow-sm flex flex-col space-y-1 bg-green-50">
                                <div className='flex justify-end items-end'><FiCheckCircle className="text-green-500 text-lg" /></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-gray-700 text-sm"><strong>Amount Paid</strong></p>
                                        <p className="text-md text-gray-900">&#8377;
                                            {transaction.amountPaid}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <p className="text-gray-700 text-sm"><strong>Payment Method</strong></p>
                                            <p className="text-gray-800 text-md">{transaction.paymentMode}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <p className="text-gray-700 text-sm"><strong>Transaction ID</strong></p>
                                            <p className="text-gray-800 text-md">{transaction.transactionId}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-700 text-sm"><strong>Date of payment</strong></p>
                                        <p className="text-md text-gray-900">{new Date(transaction.paymentDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No transaction details found</p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="self-center mt-4 bg-side-bar hover:from-blue-600 hover:bg-[#373082] text-white font-medium py-2 px-4 rounded-lg shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PaymentHistory;
