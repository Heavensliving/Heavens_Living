import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const admin = useSelector(store => store.auth.admin);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            console.log(password, token)
            const response = await axios.post(`${API_BASE_URL}/user/reset-password`, { password, token },
                { headers: { Authorization: `Bearer ${admin.token}` } },
            );

            if (response.status === 200) {
                setSuccess('Password reset successfully!');
                setPassword('');
                setConfirmPassword('');
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
        <div className="reset-password-form">
            <h2>Reset Password</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                </div>
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
