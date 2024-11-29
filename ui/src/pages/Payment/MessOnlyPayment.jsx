import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

const InputField = ({ label, name, type = 'text', value, onChange, required = false, disabled = false }) => (
    <div className="w-full md:w-1/2 px-2 mb-4">
        <label className="block text-gray-700 mb-2">{label}</label>
        <input
            min={1}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded-md"
            required={required}
            disabled={disabled}
        />
    </div>
);

const MessOnlyPayment = () => {
    const admin = useSelector(store => store.auth.admin);
    const navigate = useNavigate();

    // Function to generate month/year options
    const generateMonthYearOptions = () => {
        const options = [];
        const currentDate = new Date();

        // Generate the past 12 months
        for (let i = 0; i < 12; i++) {
            const month = currentDate.getMonth() - i;
            const year = currentDate.getFullYear() + Math.floor(month / 12); // Adjust year when going back over December
            const adjustedDate = new Date(year, (month + 12) % 12); // Correct month for each iteration

            // Format month as full name and year as YYYY
            const formattedMonth = adjustedDate.toLocaleString('default', { month: 'long' });
            const formattedYear = adjustedDate.getFullYear();

            options.push({
                label: `${formattedMonth}, ${formattedYear}`, // Format as "November, 2024"
                value: `${formattedMonth}, ${formattedYear}`,
            });
        }
        setMonthYearOptions(options);
    };
    useEffect(() => {
        generateMonthYearOptions();
    }, []);

    const location = useLocation();
    const paymentType = location.state?.paymentType || '';
    const [studentId, setStudentId] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [payingAmount, setPayingAmount] = useState('');
    const [monthYearOptions, setMonthYearOptions] = useState([]);
    const [monthYear, setMonthYear] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [paidDate, setPaidDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const comprehensiveFormData = {
            studentId: studentId,
            payingAmount,
            transactionId,
            paidDate,
            paymentMode,
            feeClearedMonthYear: monthYear,
            isMessPayment: paymentType !== "Daily Rent",
            isDailyRent: paymentType === "Daily Rent",
        };

        try {
            // console.log(comprehensiveFormData); // Log to verify all data is present
            await axios.post(`${API_BASE_URL}/fee/add`, comprehensiveFormData,
                { headers: { 'Authorization': `Bearer ${admin.token}` } }
            );
            navigate('/payments');
        } catch (error) {
            setErrorMessage(error)
            console.error("Error recording fee payment:", error);
        }
    };

    return (
        <div className="min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-4 rounded-md shadow-md w-full">
                {errorMessage && (
                    <div className="bg-red-500 text-white p-2 rounded-md mb-4 text-center">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap -mx-2">
                        <h1 className="w-full text-lg font-semibold mt-4 text-center mb-4">Make Payment</h1>
                        <InputField label="Enter Id" name="id" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
                        <InputField label="Amount Paying" name="payingAmount" type="number" value={payingAmount} onChange={(e) => setPayingAmount(e.target.value)} />
                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <label className="block text-gray-700 mb-2">Payment Mode</label>
                            <select
                                name="paymentMode"
                                className="w-full p-2 border rounded-md"
                                required
                                onChange={(e) => setPaymentMode(e.target.value)} // Set the payment mode
                            >
                                <option value="">Select Payment Mode</option>
                                <option value="Cash">Cash</option>
                                <option value="Net Banking">Net Banking</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>
                        <InputField label="Transaction ID" name="transactionID" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
                        {paymentType !== "Daily Rent" && (
                            <div className="w-full md:w-1/2 px-2 mb-4">
                                <label className="block text-gray-700 mb-2">Fee Cleared Month/Year</label>
                                <select
                                    name="feeClearedMonthYear"
                                    className="w-full p-2 border rounded-md"
                                    required
                                    onChange={(e) => setMonthYear(e.target.value)}
                                >
                                    <option value="">Select Month/Year</option>
                                    {monthYearOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <InputField label="Paid Date" name="paidDate" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
                    </div>
                    <div className="flex justify-center mt-4">
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckAuth(MessOnlyPayment);
