import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

function AddAddOnsItem() {
    const admin = useSelector(store => store.auth.admin);
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        Itemname: '',
        prize: '',
        Description: '',
        image: '',
        status: 'unavailable',
    });
    const [message, setMessage] = useState('');

    const handleChange = ({ target: { name, value } }) => {
        setInputs(prevInputs => ({ ...prevInputs, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/adOn/add-adOn`, inputs,
                {headers: { 'Authorization': `Bearer ${admin.token}` }}
            );
            setMessage('Add-on item added successfully!');
            setInputs({ Itemname: '', prize: '', Description: '', image: '', status: 'unavailable' });
            navigate('/add-ons');
        } catch (error) {
            console.error('There was an error adding the item:', error);
            setMessage('Failed to add add-on item.');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8 mt-10">
            {message && (
                <div className={`p-3 mb-4 text-center rounded-lg transition-all duration-300 ${message.includes('success') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
                {['Itemname', 'prize', 'Description', 'image'].map((field, index) => (
                    <div className="relative" key={index}>
                        <input
                            type={field === 'prize' ? 'number' : 'text'}
                            id={field}
                            name={field}
                            value={inputs[field]}
                            onChange={handleChange}
                            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-0"
                            placeholder=" "
                            required
                            min={field === 'prize' ? '1' : undefined}
                        />
                        <label
                            htmlFor={field}
                            className="absolute top-3 text-gray-500 transform -translate-y-6 scale-75 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                >
                    Add Item
                </button>
            </form>
        </div>
    );
}

export default AddAddOnsItem;
