import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormField from './FormField';
import CheckAuth from '../auth/CheckAuth';

function AddRoom() {
    const navigate = useNavigate();
    const admin = useSelector(store => store.auth.admin);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
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
        if (!admin) return;
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
    }, [admin]);

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
        setLoading(true)
        if (!admin) return;
        try {
            const response = await axios.post(`${API_BASE_URL}/room/add`, formData, {
                headers: { 'Authorization': `Bearer ${admin.token}` },
            });
            if (response.status === 201) {
                toast.success('Room added successfully!', { autoClose: 500 });
                setTimeout(() => {
                    navigate('/rooms');
                    setLoading(false)
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
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Add Room'
            )}
          </button>
            </form>
            <ToastContainer className="mt-20" />
        </>
    );
}

export default CheckAuth(AddRoom);
