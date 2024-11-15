import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

function EditAddOns() {
    const admin = useSelector(store => store.auth.admin);
    const navigate = useNavigate();
    const { id } = useParams(); // Assuming you're passing the ID in the URL
    const [inputs, setInputs] = useState({
        Itemname: '',
        prize: '',
        Description: '',
        image: '',
        status: 'unavailable',
    });

    const [message, setMessage] = useState('');

    // Fetch the existing add-on data when the component mounts
    useEffect(() => {
        const fetchAddOnData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/adOn/getAddOn/${id}`,
                    {headers: { 'Authorization': `Bearer ${admin.token}` }}
                );
                setInputs(response.data); // Assuming the response data matches the inputs structure
            } catch (error) {
                console.error('Error fetching add-on data:', error);
                setMessage('Failed to fetch add-on data.');
            }
        };

        fetchAddOnData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${API_BASE_URL}/adOn/update-addOn/${id}`, inputs,
                {headers: { 'Authorization': `Bearer ${admin.token}` }}
            ); // Change to PUT request for editing
            setMessage('Add-on item updated successfully!');
            resetForm();
            navigate('/add-ons');
        } catch (error) {
            console.error('There was an error updating the item:', error);
            setMessage('Failed to update add-on item.');
        }
    };

    const resetForm = () => {
        setInputs({
            Itemname: '',
            prize: '',
            Description: '',
            image: '',
            status: 'unavailable',
        });
    };

    const renderInputField = (id, name, type = 'text', placeholder, required = true) => (
        <div className="relative">
            <input
                type={type}
                id={id}
                name={name}
                value={inputs[name]}
                onChange={handleChange}
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                placeholder=" "
                required={required}
            />
            <label
                htmlFor={id}
                className="absolute top-3 text-gray-500 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
                {placeholder}
            </label>
        </div>
    );

    return (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mt-10">
            {message && (
                <div
                    className={`p-3 mb-4 text-center rounded-lg transition-all duration-300 ${
                        message.includes('success') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}
                >
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {renderInputField('Itemname', 'Itemname', 'text', 'Item Name')}
                {renderInputField('prize', 'prize', 'number', 'Prize', true)}
                {renderInputField('Description', 'Description', 'text', 'Description')}
                {renderInputField('image', 'image', 'text', 'Image URL')}

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                    Update Item
                </button>
            </form>
        </div>
    );
}

export default EditAddOns;
