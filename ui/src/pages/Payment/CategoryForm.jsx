import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryForm = ({ isOpen, onClose }) => {
    const admin = useSelector((store) => store.auth.admin);
    const [categoryName, setCategoryName] = useState('');
    const [categoryType, setCategoryType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_BASE_URL}/expense/add`,
                {
                    name: categoryName,
                    type: categoryType,
                },
                { headers: { Authorization: `Bearer ${admin.token}` } }
            );
            if (response.status === 201) {
                toast.success('Category Added Successfully!', { autoClose: 400 });
                setTimeout(() => {
                    window.location.reload();
                    setCategoryName('')
                    setCategoryType('')
                }, 1000);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add category.', { autoClose: 2000 });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ml-60 fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4 text-center">Add Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category Name</label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter category name"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category Type</label>
                        <select
                            value={categoryType}
                            onChange={(e) => setCategoryType(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Select Type</option>
                            <option value="PG">PG</option>
                            <option value="Mess">Mess</option>
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 text-black p-2 rounded-md hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-side-bar text-white p-2 rounded-md hover:bg-[#373082]"
                        >
                            Add Category
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryForm;
