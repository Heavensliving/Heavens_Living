import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import axios from 'axios';
import { setAdmin } from '../../store/AuthSlice';
import API_BASE_URL from '../../config';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import heavenslogo from '../../assets/hAsset 4.png'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Reset errors
        setErrors({ email: "", password: "" });

        // Front-end validation for each field
        let validationErrors = {};
        if (!email) validationErrors.email = 'Email is required.';
        if (!password) validationErrors.password = 'Password is required.';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios.post(`${API_BASE_URL}/admin/login`, { email, password })
            .then((res) => {
                setErrors({ email: "", password: "" });
                const admin = {
                    adminName: res.data.adminName,
                    token: res.data.token,
                    role: res.data.role
                };
                dispatch(setAdmin(admin));
                navigate('/');
            })
            .catch(error => {
                console.error(error);
                if (error.response && error.response.data && error.response.data.errors) {
                    const apiErrors = {};
                    error.response.data.errors.forEach(err => {
                        if (err.field === 'email') {
                            apiErrors.email = err.message;
                        } else if (err.field === 'password') {
                            apiErrors.password = err.message;
                        }
                    });
                    setErrors(apiErrors);
                } else if (error.response && error.response.data && error.response.data.msg) {
                    setErrors({ password: error.response.data.msg });
                } else {
                    setErrors({ password: 'Failed to connect to API' });
                }
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row border rounded-lg shadow-lg bg-white overflow-hidden w-full max-w-4xl p-4 md:p-0">

                {/* Left Box */}
                <div className="flex flex-col justify-center items-center bg-side-bar text-white p-6 w-full md:w-1/2">
                    <div className="mb-4">
                        <img
                            src={heavenslogo}
                            alt="Featured"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold">Living</h2>
                    <p className="text-center mt-2">Home, Away from Home</p>
                </div>

                {/* Right Box */}
                <div className="flex flex-col justify-center p-6 w-full md:w-1/2">
                    <h2 className="text-2xl font-semibold mb-2">Hello.</h2>
                    <p className="mb-4">We are happy to have you back &nbsp;:)</p>

                    <form onSubmit={handleSubmit}>
                        {errors.email && (<div className="text-red-500 mt-1">{errors.email}</div>)}
                        <div className="mb-4">
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-side-bar"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors(prevErrors => ({ ...prevErrors, email: "" }));
                                    }
                                }}
                            />
                        </div>
                        {errors.password && (<div className="text-red-500 mt-1">{errors.password}</div>)}
                        <div className="relative w-full mb-2">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-side-bar"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password && e.target.value) setErrors((prev) => ({ ...prev, password: "" }));
                                }}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-4 text-gray-500 focus:outline-none"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <div>
                            <button
                                className="w-full p-3 mt-4 bg-side-bar text-white rounded-lg hover:bg-[#373082] transition duration-200"
                                type='submit'
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;
