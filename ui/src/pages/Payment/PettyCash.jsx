import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PettyCash = () => {
    const navigate = useNavigate()
    const admin = useSelector((state) => state.auth.admin); // Fetch admin info from Redux store
    const [renderInput, setRenderInput] = useState(false);
    const [staffMembers, setStaffMembers] = useState([]);
    const [manualStaffName, setManualStaffName] = useState(''); // State to store the entered staff name
    const [selectedStaff, setSelectedStaff] = useState(''); // State to store selected staff
    const [amount, setAmount] = useState(''); // State to store the amount
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleSelectChange = (e) => {
        if (e.target.value === 'manual') {
            setRenderInput(true);
            setSelectedStaff('');
        } else {
            setRenderInput(false);
            setSelectedStaff(e.target.value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const staff = renderInput ? manualStaffName : selectedStaff;

        if (!amount || !staff) {
            alert('Please fill out all required fields.');
            return;
        }

        const data = {
            amount: Number(amount),
            staff,
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/expense/pettycash`, data, {
                headers: { Authorization: `Bearer ${admin.token}` },
            });
            toast.success('Petty Cash Added Successfully!', { autoClose: 500 });
            setTimeout(() => {
                navigate("/payments");
                setLoading(false);
            }, 1000);
            
        } catch (error) {
            console.error("Error adding Petty Cash:", error);
            toast.error('Failed to add Petty Cash', { autoClose: 500 });
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!admin) return;
        const fetchStaffMembers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/staff`, {
                    headers: { Authorization: `Bearer ${admin.token}` },
                });
                setStaffMembers(response.data);
            } catch (err) {
                console.error('Error fetching staff members:', err);
            }
        };

        fetchStaffMembers();
    }, [admin, API_BASE_URL]);

    return (
        <div>
            <div className="ml-60 fixed mt-36 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Amount</label>
                            <input
                                type="number"
                                min={0}
                                className="w-full p-2 border rounded-md"
                                placeholder="Enter amount in Rs"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Select Staff</label>
                            <select
                                value={renderInput ? 'manual' : selectedStaff}
                                onChange={handleSelectChange}
                                className="w-full p-2 border rounded-md"
                                required
                            >
                                <option value="" disabled>Select</option>
                                <option value="manual" className='bg-gray-100 text-red-500 font-bold'>Enter manually</option>
                                {staffMembers.map((staff) => (
                                    <option key={staff._id} value={staff.Name}>
                                        {staff.Name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {renderInput && (
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Enter Staff Name</label>
                                <input
                                    type="text"
                                    value={manualStaffName}
                                    onChange={(e) => setManualStaffName(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter staff name"
                                    required
                                />
                            </div>
                        )}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
                                onClick={() => {
                                    setAmount('');
                                    setSelectedStaff('');
                                    setManualStaffName('');
                                    setRenderInput(false);
                                    navigate('/payments')
                                }}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="bg-side-bar text-white p-2 rounded-md hover:bg-[#373082]"
                            >
                                Add Pettycash
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default PettyCash;
