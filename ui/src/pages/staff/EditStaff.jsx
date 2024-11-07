import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';

function EditStaff() {
    const { staffId } = useParams(); // Get staffId from URL params
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState({
        Name: '',
        StaffId: '',
        DOB: '',
        Address: '',
        Contactnumber: '',
        Email: '',
        Photo: null,
        Adharfrontside: null,
        Adharbackside: null,
        Type: '',
        Salary: '',
        PaymentDate: '',
        PaySchedule: '',
        propertyName: '',
        Status: 'Active',
        property: '',
    });
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        // Fetch staff data and property names from the backend
        const fetchData = async () => {
            try {
                const staffResponse = await axios.get(`${API_BASE_URL}/staff/${staffId}`);
                const propertiesResponse = await axios.get(`${API_BASE_URL}/property`);

                // Ensure the date fields are in the correct format (YYYY-MM-DD)
                const staff = staffResponse.data;
                setStaffData({
                    ...staff,
                    DOB: staff.DOB ? new Date(staff.DOB).toISOString().split('T')[0] : '',
                    PaymentDate: staff.PaymentDate ? new Date(staff.PaymentDate).toISOString().split('T')[0] : '',
                    propertyName: staff.propertyName,
                });
                setProperties(propertiesResponse.data);
            } catch (error) {
                console.error('Error fetching staff or properties:', error);
            }
        };
        fetchData();
    }, [staffId]);

    const propertyNames = properties.map((property) => ({
        id: property._id,
        name: property.propertyName
    }));

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setStaffData({
                ...staffData,
                [name]: files[0],
            });
        } else if (name === 'propertyName') {
            const selectedProperty = properties.find(property => property.propertyName === value);
            setStaffData((prevData) => ({
                ...prevData,
                propertyName: value,
                property: selectedProperty ? selectedProperty._id : '',
            }));
        } else {
            setStaffData({
                ...staffData,
                [name]: value || '',
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in staffData) {
            formData.append(key, staffData[key]);
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/staff/edit/${staffId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('Success:', response.data);
                navigate('/staffs');
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const formFields = [
        { name: 'Name', label: 'Name', type: 'text', placeholder: 'Staff Name', required: true },
        { name: 'Address', label: 'Address', type: 'text', placeholder: 'Address', required: true },
        { name: 'Contactnumber', label: 'Contact Number', type: 'number', placeholder: 'Contact Number', required: true },
        { name: 'Email', label: 'Email', type: 'email', placeholder: 'Email (optional)', required: false },
        { name: 'DOB', label: 'Date of Birth', type: 'date', placeholder: 'Date of Birth', required: true },
        { name: 'Type', label: 'Type of Job', type: 'text', placeholder: 'Type', required: true },
        { name: 'Salary', label: 'Salary', type: 'text', placeholder: 'Salary', required: true },
        {
            name: 'PaySchedule',
            label: 'Pay Schedule',
            type: 'select',
            options: ['Daily Pay', 'Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly'],
            placeholder: 'Schedule',
            required: true
        },
        {
            name: 'propertyName',
            type: 'select',
            options: propertyNames,
            placeholder: 'Property Name',
            label: 'Property Name',
            required: true,
        },
        { name: 'PaymentDate', label: 'Payment Date', type: 'date', placeholder: 'Payment Date', required: true },
        { name: 'Photo', label: 'Photo', type: 'file', placeholder: 'Upload Photo', accept: 'image/*' },
        { name: 'Adharfrontside', label: 'Aadhar Front', type: 'file', placeholder: 'Upload Aadhar Front', accept: 'image/*' },
        { name: 'Adharbackside', label: 'Aadhar Back', type: 'file', placeholder: 'Upload Aadhar Back', accept: 'image/*' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formFields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label htmlFor={field.name} className="mb-2 text-sm font-medium text-gray-700">{field.label}</label>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        className="p-3 border border-gray-300 rounded-lg w-full"
                                        value={staffData[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                    >
                                        <option value="" >{field.placeholder}</option>
                                        {field.options.map((option, index) => (
                                            <option key={index} value={typeof option === 'string' ? option : option.name}>
                                                {typeof option === 'string' ? option : option.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        className="p-3 border border-gray-300 rounded-lg w-full"
                                        value={field.type !== 'file' ? staffData[field.name] : undefined}
                                        onChange={handleChange}
                                        required={field.required}
                                        accept={field.accept || undefined}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Update Staff
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditStaff;
