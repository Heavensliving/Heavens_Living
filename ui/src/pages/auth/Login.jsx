import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrorMsg('');
        if (!email || !password) {
            setErrorMsg('Email and password are required.');
            return;
        }
        axios.post(`http://localhost:3000/api/admin/login`, {
            email, password
          })
            .then((res) => {
              setErrorMsg('')
              navigate('/')
            })
            .catch(error => {
              if (error.response && error.response.data && error.response.data.errors) {
                setErrorMsg(error.response.data.errors.map((err, index) => <div key={index} className="error-message">{err}</div>))
              } else if (error.response && error.response.data && error.response.data.msg) {
                setErrorMsg([<div key="backendError" className="error-message">{error.response.data.msg}</div>])
              } else {
                setErrorMsg([<div key="connectionError" className="error-message">Failed to connect to API</div>])
              }
            })
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row border rounded-lg shadow-lg bg-white overflow-hidden w-full max-w-4xl p-4 md:p-0">

                {/* Left Box */}
                <div className="flex flex-col justify-center items-center bg-gray-800 text-white p-6 w-full md:w-1/2">
                    <div className="mb-4">
                        <img
                            src='https://img.freepik.com/free-vector/hand-drawn-people-relaxing-home_23-2148117090.jpg?ga=GA1.1.1459516267.1711715282&semt=ais_hybrid'
                            className="w-32"
                            alt="Featured"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold">Be Verified</h2>
                    <p className="text-center mt-2">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>
                </div>

                {/* Right Box */}
                <div className="flex flex-col justify-center p-6 w-full md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-2">Hello, Again</h2>
                    <p className="mb-4">We are happy to have you back in login</p>

                    <form onSubmit={handleSubmit}>
                        {errorMsg && (
                            <div className="text-red-500 mb-2">{errorMsg}</div>
                        )}

                        <div className="mb-4">
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                className="w-full p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                                type='submit'
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <small>
                            Don't have an account? <Link to={'/signup'} className="text-blue-600 hover:underline">Signup</Link>
                        </small>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Login;
