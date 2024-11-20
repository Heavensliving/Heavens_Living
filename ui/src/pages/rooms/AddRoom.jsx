import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function FormField({ label, id, name, type = "text", value, onChange, placeholder, required = false, options }) {
    return (
        <div className="w-full md:w-1/2 px-2 mb-4">
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label}
            </label>
            {type === "select" ? (
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border rounded-lg"
                    required={required}
                >
                    <option value="">Select {label}</option>
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    );
}

function AddRoom() {
    const navigate = useNavigate();
    const admin = useSelector(store => store.auth.admin);
    const [properties, setProperties] = useState([]);
    const [formData, setFormData] = useState({
        propertyName: '',
        roomNo: '',
        roomType: '',
        capacity: '',
        occupant: '',
        vacantSlot: '',
        currentStatus: 'available',
        property: '',
    });

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/property`, {
                    headers: { Authorization: `Bearer ${admin.token}` },
                });
                const fetchedProperties = response.data.map((property) => ({
                    value: property._id,
                    label: property.propertyName,
                }));
                setProperties(fetchedProperties);
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, [admin.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "property") {
            const selectedProperty = properties.find((property) => property.value === value);
            setFormData({
                ...formData,
                property: value,
                propertyName: selectedProperty ? selectedProperty.label : '',
            });
        } else if (name === "roomType") {
            const sharingPrefix = " sharing";

            if (value === "") {
                setFormData({
                    ...formData,
                    roomType: "",
                    capacity: "",
                });
                return;
            }

            let numericValue = value.replace(/[^0-9]/g, "");

            if (numericValue) {
                const formattedRoomType = `${numericValue}${sharingPrefix}`;
                setFormData({
                    ...formData,
                    roomType: formattedRoomType,
                    capacity: numericValue,
                    vacantSlot: numericValue,
                });
            } else {
                setFormData({
                    ...formData,
                    roomType: "",
                    capacity: "",
                });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/room/add`, formData, {
                headers: { 'Authorization': `Bearer ${admin.token}` },
            });
            if (response.status === 201) {
                toast.success('Room added successfully!', { autoClose: 500 });
                setTimeout(() => {
                    navigate('/rooms');
                }, 1000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message, { autoClose: 2000 });
            } else {
                console.error('Unexpected Error:', error);
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-16"
            >
                <div className="flex flex-wrap -mx-2">
                    <FormField label="Property" id="property" name="property" type="select" value={formData.property} onChange={handleChange} options={properties} required={true} />
                    <FormField label="Room Number" id="roomNo" name="roomNo" value={formData.roomNo} onChange={handleChange} placeholder="Enter room number" required={true} />
                </div>
                <div className="flex flex-wrap -mx-2">
                    <FormField label="Type of sharing" id="roomType" name="roomType" value={formData.roomType} onChange={handleChange} placeholder="Enter sharing type" required={true} />
                    <FormField label="Current Status" id="currentStatus" name="currentStatus" type="select" value={formData.currentStatus} onChange={handleChange}
                        options={[
                            { value: "available", label: "Available" },
                            { value: "unavailable", label: "Unavailable" },
                        ]}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition mt-4"
                >
                    Add Room
                </button>
            </form>
            <ToastContainer className="mt-20" />
        </>
    );
}

export default AddRoom;
