import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';

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
    const { id } = useParams();
    const navigate = useNavigate();

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

        try {
            const response = await axios.post(`${API_BASE_URL}/property/add`, propertyData);
            if (response.status === 201) {
                navigate(`/properties/${id}`);
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
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
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Register Property
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddPropertyToPhase;
