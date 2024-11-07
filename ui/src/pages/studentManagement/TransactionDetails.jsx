// import React, { useEffect } from 'react';
// import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'; // Import icons

// const TransactionDetails = ({ onClose, transaction, slideIn }) => {
//     useEffect(() => {
//     }, [transaction]);

//     const getStatusIcon = (status) => {
//         switch (status) {
//             case 'Paid':
//                 return <FiCheckCircle className="text-green-500 text-lg" />;
//             case 'Pending':
//                 return <FiClock className="text-yellow-500 text-lg" />;
//             case 'Failed':
//                 return <FiXCircle className="text-red-500 text-lg" />;
//             default:
//                 return <FiClock className="text-gray-500 text-lg" />;
//         }
//     };

//     return (
//         <div
//             className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${
//                 slideIn ? 'translate-x-0' : 'translate-x-full'
//             } z-50`}
//         >
//             <div className="p-4 h-full flex flex-col">
//                 <h2 className="text-lg font-bold text-gray-900 text-center mb-4">Transaction Overview</h2>

//                 <div className="overflow-y-auto hide-scrollbar flex-grow">
//                     {transaction && transaction.length > 0 ? (
//                         transaction.map((trans, index) => (
//                             <div
//                                 key={index}
//                                 className={`p-3 mb-3 rounded-lg shadow-sm flex flex-col space-y-1 ${
//                                     trans.status === 'Paid'
//                                         ? 'bg-green-50'
//                                         : trans.status === 'Pending'
//                                         ? 'bg-yellow-50'
//                                         : trans.status === 'Failed'
//                                         ? 'bg-red-50'
//                                         : 'bg-gray-100' // Default color if status is not matched
//                                 }`}
//                             >
//                                 <div className="flex justify-between items-center">
//                                     <div className="flex flex-col">
//                                         <p className="text-gray-700 text-sm"><strong>Payment ID</strong></p>
//                                         <p className="text-gray-800 text-md">{trans.id}</p>
//                                     </div>
//                                     <div>{getStatusIcon(trans.status)}</div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-2">
//                                     <div>
//                                         <p className="text-gray-700 text-sm"><strong>Amount</strong></p>
//                                         <p className="text-md text-gray-900">${trans.amount}</p>
//                                     </div>
//                                     <div>
//                                         <p className="text-gray-700 text-sm"><strong>Date of payment</strong></p>
//                                         <p className="text-md text-gray-900">{trans.date}</p>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <p className="text-gray-700 text-sm"><strong>Status</strong></p>
//                                     <span
//                                         className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
//                                             trans.status === 'Paid'
//                                                 ? 'bg-green-100 text-green-700'
//                                                 : trans.status === 'Pending'
//                                                 ? 'bg-yellow-100 text-yellow-700'
//                                                 : trans.status === 'Failed'
//                                                 ? 'bg-red-100 text-red-700'
//                                                 : 'bg-gray-100 text-gray-700'
//                                         }`}
//                                     >
//                                         {trans.status}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="text-gray-500 text-center">No transactions available</p>
//                     )}
//                 </div>

//                 <button
//                     onClick={onClose}
//                     className="self-center mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
//                 >
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default TransactionDetails;

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 

const TransactionDetails = ({ onClose, slideIn }) => {
    const { id } = useParams(); 
    const [transaction, setTransaction] = useState(null); 

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:3000/api/fee/${id}`)
                .then((response) => {
                    setTransaction(response.data); 
                })
                .catch((error) => {
                    console.error("Error fetching transaction data:", error);
                });
        }
    }, [id]); 

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Paid':
                return <FiCheckCircle className="text-green-500 text-lg" />;
            case 'Pending':
                return <FiClock className="text-yellow-500 text-lg" />;
            case 'Failed':
                return <FiXCircle className="text-red-500 text-lg" />;
            default:
                return <FiClock className="text-gray-500 text-lg" />;
        }
    };

    return (
        <div
            className={`fixed inset-y-0 right-0 bg-white w-full max-w-md shadow-2xl transform transition-transform duration-300 ${
                slideIn ? 'translate-x-0' : 'translate-x-full'
            } z-50`}
        >
            <div className="p-4 h-full flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 text-center mb-4">Transaction Overview</h2>

                <div className="overflow-y-auto hide-scrollbar flex-grow">
                    {transaction ? (
                        <div
                            className={`p-3 mb-3 rounded-lg shadow-sm flex flex-col space-y-1 ${
                                transaction.status === 'Paid'
                                    ? 'bg-green-50'
                                    : transaction.status === 'Pending'
                                    ? 'bg-yellow-50'
                                    : transaction.status === 'Failed'
                                    ? 'bg-red-50'
                                    : 'bg-gray-100' 
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <p className="text-gray-700 text-sm"><strong>Payment ID</strong></p>
                                    <p className="text-gray-800 text-md">{transaction.id}</p>
                                </div>
                                <div>{getStatusIcon(transaction.status)}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-gray-700 text-sm"><strong>Amount</strong></p>
                                    <p className="text-md text-gray-900">${transaction.amount}</p>
                                </div>
                                <div>
                                    <p className="text-gray-700 text-sm"><strong>Date of payment</strong></p>
                                    <p className="text-md text-gray-900">{transaction.date}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-700 text-sm"><strong>Status</strong></p>
                                <span
                                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                        transaction.status === 'Paid'
                                            ? 'bg-green-100 text-green-700'
                                            : transaction.status === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : transaction.status === 'Failed'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {transaction.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No transaction details found</p>
                    )}
                </div>

                <button
                    onClick={onClose}
                    className="self-center mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TransactionDetails;
