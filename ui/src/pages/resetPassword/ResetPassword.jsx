import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import eye icons

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate()
    const admin = useSelector(store => store.auth.admin);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // State for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // State for confirm password visibility

    const validate = () => {
        let isValid = true;
        setPasswordError('');
        setConfirmPasswordError('');

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            isValid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validate()) return;

        try {
            console.log(password, token);
            const response = await axios.post(`${API_BASE_URL}/user/reset-password`, { password, token },
                { headers: { Authorization: `Bearer ${admin.token}` } });

            if (response.status === 200) {
                setPassword('');
                setConfirmPassword('');
                navigate('/resetSuccess')
            } else {
                setError('Failed to reset password');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'An error occurred while resetting the password.');
            } else {
                setError('Network error. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-6 rounded-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}  // Toggle visibility
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}  // Toggle eye visibility
                                className="absolute right-3 top-7 transform -translate-y-1/2"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}  {/* Eye Icon */}
                            </button>
                        </div>
                        {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}  // Toggle visibility
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                className="mt-1 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}  // Toggle eye visibility
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                            </button>
                        </div>
                        {confirmPasswordError && <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>}
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 p-3 bg-[#631930] text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
