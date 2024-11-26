import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Reusable Input Component
const InputField = ({ label, name, type = 'text', value, handleChange, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            name={name}
            id={name}
            placeholder={label}
            className="p-3 border border-gray-300 rounded-lg w-full"
            value={value}
            onChange={handleChange}
            required={required}
        />
    </div>
);

function AddPropertyToPhase() {
    const admin = useSelector(store => store.auth.admin);
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [propertyData, setPropertyData] = useState({
        propertyName: '',
        propertyOwnerName: '',
        location: '',
        address: '',
        contactNumber: '',
        totalBeds: '',
        preferredBy: '',
        startingPrice: '',
        oneSharing: '',
        twoSharing: '',
        threeSharing: '',
        fourSharing: '',
        propertyType: '',
        phaseId: id,
    });

    // Handler function wrapped in useCallback to avoid unnecessary re-creation
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setPropertyData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }, []);

    // Submit handler function wrapped in useCallback
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            const response = await axios.post(`${API_BASE_URL}/property/add`, propertyData,
                { headers: { 'Authorization': `Bearer ${admin.token}` } }
            );
            if (response.status === 201) {

                toast.success('Property Added Successfully!', { autoClose: 500 });
                setTimeout(() => {
                    navigate(`/properties/${id}`);
                    setLoading(false);
                }, 1000);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            toast.error(error.response.data.message, { autoClose: 2000 });
        }
    }, [propertyData, navigate]);

    // Configuration for form fields to avoid repetition
    const formFields = [
        { label: 'Property Name', name: 'propertyName', required: true },
        { label: 'Property Owner\'s Name', name: 'propertyOwnerName', required: true },
        { label: 'Location', name: 'location', required: true },
        { label: 'Address', name: 'address', required: true },
        { label: 'Contact Number', name: 'contactNumber', required: true },
        { label: 'Property Type', name: 'propertyType', required: true },
        { label: 'Total Beds', name: 'totalBeds', type: 'number', required: true },
        { label: 'Preferred By', name: 'preferredBy', required: true },
        { label: 'Starting Price', name: 'startingPrice', type: 'number', required: true },
        { label: 'One Sharing Price', name: 'oneSharing', type: 'number' },
        { label: 'Two Sharing Price', name: 'twoSharing', type: 'number' },
        { label: 'Three Sharing Price', name: 'threeSharing', type: 'number' },
        { label: 'Four Sharing Price', name: 'fourSharing', type: 'number' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formFields.map(({ label, name, type, required }) => (
                            <InputField
                                key={name}
                                label={label}
                                name={name}
                                type={type}
                                value={propertyData[name]}
                                handleChange={handleChange}
                                required={required}
                            />
                        ))}
                    </div>
                    <ToastContainer />
                    <button
                        type="submit"
                        className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                        ) : (
                            'Register Property'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddPropertyToPhase;
