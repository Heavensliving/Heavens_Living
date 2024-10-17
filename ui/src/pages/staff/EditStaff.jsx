import React, { useState, useEffect } from 'react';
import axios from 'axios';
import app from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';

const storage = getStorage();

function EditStaff() {
    const { staffId } = useParams();
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
        Status: 'Active',  // Default to Active
    });
    const [oldFiles, setOldFiles] = useState({
        Adharfrontside: '',
        Adharbackside: '',
        Photo: '',
    });

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/staff/${staffId}`);
                const fetchedData = response.data;

                setOldFiles({
                    Adharfrontside: fetchedData.Adharfrontside,
                    Adharbackside: fetchedData.Adharbackside,
                    Photo: fetchedData.Photo,
                });

                if (fetchedData.DOB && fetchedData.PaymentDate) {
                    fetchedData.DOB = new Date(fetchedData.DOB).toISOString().split('T')[0];
                    fetchedData.PaymentDate = new Date(fetchedData.PaymentDate).toISOString().split('T')[0];
                }
                setStaffData(fetchedData);
            } catch (error) {
                console.error('Error fetching staff data:', error);
            }
        };
        fetchStaffData();
    }, [staffId]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setStaffData({
                ...staffData,
                [name]: files[0],
            });
        } else {
            setStaffData({
                ...staffData,
                [name]: value,
            });
        }
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, 'staff/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const deleteOldFile = async (fileURL) => {
        if (!fileURL) return Promise.resolve();
        const fileRef = ref(storage, fileURL);
        try {
            await deleteObject(fileRef);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const filesToUpload = ['Photo', 'Adharfrontside', 'Adharbackside'];
        const uploadPromises = filesToUpload.map(async (fileField) => {
            if (staffData[fileField] && typeof staffData[fileField] === 'object') {
                await deleteOldFile(oldFiles[fileField]);
                const downloadURL = await uploadFile(staffData[fileField]);
                return { [fileField]: downloadURL };
            }
            return null;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        uploadedFiles.forEach((result) => {
            if (result) {
                const key = Object.keys(result)[0];
                staffData[key] = result[key];
            }
        });

        try {
            const response = await axios.put(`${API_BASE_URL}/staff/edit/${staffId}`, staffData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log('Staff member updated successfully:', response.data);
                navigate('/staffs');
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating staff member:', error);
        }
    };

    const formFields = [
        { name: 'Name', label: 'Name', type: 'text', placeholder: 'Staff Name', required: true },
        { name: 'Address', label: 'Address', type: 'text', placeholder: 'Address', required: true },
        { name: 'DOB', label: 'Date of Birth', type: 'date', placeholder: 'Date of Birth', required: true },
        { name: 'Contactnumber', label: 'Contact Number', type: 'number', placeholder: 'Contact Number', required: true },
        { name: 'Email', label: 'Email', type: 'email', placeholder: 'Email (optional)', required: false },
        { name: 'Photo', label: 'Photo', type: 'file', placeholder: 'Upload Photo', accept: 'image/*' },
        { name: 'Adharfrontside', label: 'Aadhar Front', type: 'file', placeholder: 'Upload Aadhar Front', accept: 'image/*' },
        { name: 'Adharbackside', label: 'Aadhar Back', type: 'file', placeholder: 'Upload Aadhar Back', accept: 'image/*' },
        { name: 'Type', label: 'Type', type: 'text', placeholder: 'Type', required: true },
        { name: 'Salary', label: 'Salary', type: 'text', placeholder: 'Salary', required: true },
        { name: 'PaymentDate', label: 'Payment Date', type: 'date', placeholder: 'Payment Date', required: true },
        { name: 'PaySchedule', label: 'Pay Schedule', type: 'text', placeholder: 'Pay Schedule', required: true }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                <h1 className="text-2xl font-bold mb-6">Edit Staff</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {formFields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label htmlFor={field.name} className="mb-2 text-sm font-medium text-gray-700">{field.label}</label>
                                <input
                                    key={field.name}
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    className="p-3 border border-gray-300 rounded-lg w-full"
                                    value={field.type !== 'file' ? staffData[field.name] : undefined}
                                    onChange={handleChange}
                                    required={field.required}
                                    accept={field.accept || undefined}
                                />
                            </div>
                        ))}
                        {/* Add the Status dropdown */}
                        <div className="flex flex-col">
                            <label htmlFor="Status" className="mb-2 text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="Status"
                                value={staffData.Status}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-lg w-full"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
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
