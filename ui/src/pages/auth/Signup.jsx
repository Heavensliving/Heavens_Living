import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(String(email).toLowerCase())
    }

    const validatePassword = (password) => {
        const minLength = 6
        const hasUpperCase = /[A-Z]/.test(password)
        const hasNumber = /\d/.test(password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = []

        if (!name) {
            errors.push("Name is required")
        }
        if (!email) {
            errors.push("Email is required")
        } else if (!validateEmail(email)) {
            errors.push("Invalid email format")
        }
        if (!password) {
            errors.push("Password is required")
        } else if (!validatePassword(password)) {
            errors.push("Password must be at least 6 characters long and include an uppercase letter, a number, and a special character")
        }

        if (errors.length > 0) {
            setErrors(errors.map((err, index) => <div key={index} className="error-message">{err}</div>))
            return
        }

        axios.post(`http://localhost:3000/api/admin/signup`, { name, email, password })
    .then((res) => {
        setErrors('');  // Clear errors if successful
        navigate('/login');
    })
    .catch(error => {
        console.log(error.response);  // Check the full error response
        if (error.response && error.response.data && error.response.data.message) {
            setErrors([<div key="backendError" className="error-message">{error.response.data.message}</div>]);
        } else {
            setErrors([<div key="connectionError" className="error-message">Failed to connect to API</div>]);
        }
    });

        
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row border rounded-lg shadow-lg bg-white overflow-hidden w-full max-w-4xl">

                {/* Left Box */}
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-800 text-white p-6">
                    <img
                        src="https://img.freepik.com/free-vector/hand-drawn-people-relaxing-home_23-2148117090.jpg?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid"
                        className="w-64 mb-4"
                        alt="Featured"
                    />
                    <p className="text-3xl font-semibold text-center">Welcome Aboard!</p>
                    <small className="text-center w-56">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    </small>
                </div>

                {/* Right Box */}
                <div className="flex flex-col justify-center items-start w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold">Create your account</h2>
                    <p className="text-gray-600">Student Management System</p>

                    <form onSubmit={handleSubmit} className="w-full mt-4">
                        {errors && errors.map((error, index) => (
                            <div className='text-red-500' key={index}>{error}</div>
                        ))}
                        <input
                            type="text"
                            className={`block w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="email"
                            className={`block w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className={`block w-full p-3 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        

                        <button
                            className="w-full py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                            type="submit"
                        >
                            Signup
                        </button>
                    </form>

                    <div className="mt-4">
                        <small>
                            Already have an account? <Link to={'/login'} className="text-blue-600 hover:underline">Login</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
