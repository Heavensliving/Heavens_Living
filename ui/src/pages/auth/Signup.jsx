import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import heavenslogo from '../../assets/hAsset 4.png'

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    const validatePassword = (password) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
    };
    const validatePhone = (phone) => /^\d{10}$/.test(phone);

    const handleSubmit = (e) => {
        setLoading(true)
        e.preventDefault();
        const newErrors = {};

        if (!name) newErrors.name = "Name is required";
        if (!email) newErrors.email = "Email is required";
        else if (!validateEmail(email)) newErrors.email = "Invalid email format";
        if (!password) newErrors.password = "Password is required";
        else if (!validatePassword(password)) newErrors.password = "Password must be at least 6 characters long and include an uppercase letter, a number, and a special character";
        if (!phone) newErrors.phone = "Phone number is required";
        else if (!validatePhone(phone)) newErrors.phone = "Phone number must be a 10-digit number";
        if (!role) newErrors.role = "Role selection is required";
        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            axios.post(`${API_BASE_URL}/admin/signup`, { name, email, password, phone, role })
                .then(() => {
                    setErrors({});
                    navigate('/login');
                })
                .catch(error => {
                    setLoading(false)
                    if (error.response && error.response.data && error.response.data.message) {
                        setErrors({ form: error.response.data.message });
                    } else {
                        setErrors({ form: "Failed to connect to API" });
                    }
                });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col md:flex-row border rounded-lg shadow-lg bg-white overflow-hidden w-full max-w-4xl">
                {/* Left Box */}
                <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-side-bar text-white p-6">
                    <img
                        src={heavenslogo}
                        //className="w-64 mb-4"
                        alt="Featured"
                    />
                    <p className="text-3xl font-semibold text-center">Living</p>
                    <small className="text-center w-56 mt-3">
                       Home, Away from Home
                    </small>
                </div>

                {/* Right Box */}
                <div className="flex flex-col justify-center items-start w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-semibold">Create an account</h2>
                    <p className="text-gray-600">Hostel Management System</p>
                    {errors.form && <div className="text-red-500 mb-3">{errors.form}</div>}
                    <form onSubmit={handleSubmit} className="w-full mt-4">
                        {errors.name && <div className="text-red-500 mb-2">{errors.name}</div>}
                        <input
                            type="text"
                            className="block w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-side-bar"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name && e.target.value) setErrors((prev) => ({ ...prev, name: "" }));
                            }}
                        />
                        {errors.email && <div className="text-red-500 mb-2">{errors.email}</div>}
                        <input
                            type="email"
                            className="block w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-side-bar"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email && e.target.value) setErrors((prev) => ({ ...prev, email: "" }));
                            }}
                        />
                        {errors.password && <div className="text-red-500 mb-2">{errors.password}</div>}
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
                        {errors.phone && <div className="text-red-500 mb-2">{errors.phone}</div>}
                        <input
                            type="text"
                            className="block w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-side-bar"
                            placeholder="Phone number"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone && e.target.value) setErrors((prev) => ({ ...prev, phone: "" }));
                            }}
                        />
                        {errors.role && <div className="text-red-500 mb-2">{errors.role}</div>}
                        <select
                            className="block w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-side-bar"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                if (errors.role && e.target.value) setErrors((prev) => ({ ...prev, role: "" }));
                            }}
                        >
                            <option value="">Select Role</option>
                            <option value="mainAdmin">Main Admin</option>
                            <option value="branchAdmin">Branch Admin</option>
                            <option value="propertyAdmin">Property Admin</option>
                        </select>
                        <button
                                type="submit"
                                className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                                ) : (
                                    'Signup'
                                )}
                            </button>
                    </form>

                    <div className="mt-4">
                        <small >
                            Already have an account? <Link to={'/login'} className="text-blue-600 hover:underline">Login</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
