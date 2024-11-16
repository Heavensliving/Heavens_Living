import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

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

    const [formData, setFormData] = useState('');
    const [studentId, setStudentId] = useState('');
    const [paymentData, setPaymentData] = useState('');
    const [totalAmountToPay, setTotalAmountToPay] = useState('');
    const [monthYearOptions, setMonthYearOptions] = useState([]);
    const [paymentMode, setPaymentMode] = useState('');
    const [waveOffAmount, setWaveOffAmount] = useState('');
    const [waveOffReason, setWaveOffReason] = useState('');
    const [payingAmount, setPayingAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [paidDate, setPaidDate] = useState('');
    const [monthYear, setMonthYear] = useState('');
    const [isStudentDataFetched, setIsStudentDataFetched] = useState(false);

    const handleStudentIdChange = (e) => {
        setFormData({ studentId: e.target.value });
    };

    const fetchStudentData = async () => {
        if (!formData.studentId) {
            setErrorMessage("Please enter a valid student ID.");
            setTimeout(() => {
                // setFormData(initialFormData);
                setErrorMessage('');
            }, 2000);
            return;
        }

        const studentId = `HVNS${formData.studentId}`;
        setStudentId(studentId)
        try {
            const response = await axios.get(`${API_BASE_URL}/students/studentId/${studentId}`,
                { headers: { 'Authorization': `Bearer ${admin.token}` } }
            );
            setPaymentData(response.data)
            setErrorMessage('');
            setIsStudentDataFetched(true);
        } catch (error) {
            console.error("Error fetching student data:", error);
            setErrorMessage("Student not found. Please check the Student ID.");
            setTimeout(() => {
                setErrorMessage('');
            }, 2000);
            setIsStudentDataFetched(false);
        }
    };

    // Dynamically update total amount to pay when waveOffAmount changes
    useEffect(() => {
        if (paymentData.pendingRentAmount !== undefined) {
            const newTotal = Math.max(paymentData.pendingRentAmount - waveOffAmount, 0);
            setTotalAmountToPay(newTotal);
        }
    }, [waveOffAmount, paymentData.pendingRentAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct formData with all necessary fields
        const comprehensiveFormData = {
            ...paymentData, // Includes fetched student details like name, pgName, etc.
            studentId,
            waveOffAmount,
            waveOffReason,
            payingAmount,
            transactionId,
            paidDate,
            feeClearedMonthYear: monthYear, // The selected month/year
            totalAmountToPay,
            paymentMode,
        };

        try {
            console.log(comprehensiveFormData); // Log to verify all data is present
            await axios.post(`${API_BASE_URL}/fee/add`, comprehensiveFormData,
                { headers: { 'Authorization': `Bearer ${admin.token}` } }
            );
            navigate('/payments');
        } catch (error) {
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
                        <InputField label="Enter Id" name="id" type="text" value={waveOffAmount} onChange={(e) => setWaveOffAmount(e.target.value)} />
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

export default MessOnlyPayment;
