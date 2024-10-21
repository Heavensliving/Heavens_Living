import React, { useEffect, useState } from 'react';
import axios from 'axios';
import app from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';

const storage = getStorage();

function EditStudent() {
    const { studentId } = useParams();  // Get student ID from URL params
    const navigate = useNavigate();

    const initialData = {
        name: '',
        address: '',
        contactNo: '',
        email: '',
        bloodGroup: '',
        parentName: '',
        parentNumber: '',
        course: '',
        advanceFee: '',
        nonRefundableDeposit: '',
        monthlyRent: '',
        adharFrontImage: null,
        adharBackImage: null,
        photo: null,
        pgName: '',
        roomType: '',
        roomNo: '',
        referredBy: '',
        typeOfStay: '',
        paymentStatus: '',
        studentId: '',
        joinDate: '',
        currentStatus: 'checkedIn',
        password: '',
        dateOfBirth: '',
        gender: '',
        year: '',
        collegeName: '',
        parentOccupation: '',
        workingPlace: '',
    };

    const [studentData, setStudentData] = useState(initialData);
    const [properties, setProperties] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [oldFiles, setOldFiles] = useState({
        adharFrontImage: '',
        adharBackImage: '',
        photo: '',
    });

    // Fetch the current student data
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
                const fetchedData = response.data.result;

                // Store old file URLs to delete them later if needed
                setOldFiles({
                    adharFrontImage: fetchedData.adharFrontImage,
                    adharBackImage: fetchedData.adharBackImage,
                    photo: fetchedData.photo,
                });

                // Ensure date is in 'YYYY-MM-DD' format
                if (fetchedData.joinDate) {
                    fetchedData.joinDate = new Date(fetchedData.joinDate).toISOString().split('T')[0];
                    fetchedData.dateOfBirth = new Date(fetchedData.dateOfBirth).toISOString().split('T')[0];
                }

                setStudentData(fetchedData);  // Prepopulate form with student data
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
        fetchStudentData();
    }, [studentId]);

    useEffect(() => {
        // Fetch property names from the backend
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/property`);
                setProperties(response.data);  // Assuming the API returns an array of properties
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);

    const fields = [
        { name: 'name', type: 'text', placeholder: 'Name', required: true, label: 'Name' },
        { name: 'gender', type: 'text', placeholder: 'Gender', required: true, label: 'Gender' },
        { name: 'email', type: 'email', placeholder: 'Email', required: true, label: 'Email' },
        { name: 'password', type: 'password', placeholder: 'Password', required: true, label: 'Password' },
        { name: 'address', type: 'text', placeholder: 'Address', required: true, label: 'Address' },
        { name: 'contactNo', type: 'text', placeholder: 'Contact Number', required: true, label: 'Contact Number' },
        { name: 'dateOfBirth', type: 'date', required: true, label: 'DOB' },
        { name: 'bloodGroup', type: 'text', placeholder: 'Blood Group', required: true, label: 'Blood Group' },
        { name: 'parentName', type: 'text', placeholder: "Parent's Name", required: true, label: 'Parent Name' },
        { name: 'parentNumber', type: 'text', placeholder: "Parent's Contact Number", required: true, label: 'Parent Contact' },
        { name: 'parentOccupation', type: 'text', placeholder: "Parent's Occupation", label: `Parent's Occupation` },
        { name: 'workingPlace', type: 'text', placeholder: 'Working Place', label: 'Working Place' },
        { name: 'collegeName', type: 'text', placeholder: 'College Name', required: true, label: 'College Name' },
        { name: 'course', type: 'text', placeholder: 'Course', label: 'Course of study' },
        { name: 'year', type: 'text', placeholder: 'Year', required: true, label: 'Year of study' },
        {
            name: 'pgName',
            type: 'select',
            options: properties.map((property) => property.propertyName),  // Use the fetched property names here
            placeholder: 'PG Name',
            label: 'PG Name',
            required: true,
        },
        { name: 'advanceFee', type: 'number', placeholder: 'Advance Fee', label: 'Advance Fee' },
        { name: 'nonRefundableDeposit', type: 'number', placeholder: 'Non-Refundable Deposit', label: 'Deposit' },
        { name: 'monthlyRent', type: 'number', placeholder: 'Monthly Rent', label: 'Rent' },
        { name: 'roomType', type: 'select', options: ['Single', 'Shared', 'Deluxe'], placeholder: 'Room Type', required: true, label: 'Room' },
        { name: 'roomNo', type: 'text', placeholder: 'Room Number', label: 'Room Number' },
        { name: 'referredBy', type: 'text', placeholder: 'Referred By', required: true, label: 'Referred By' },
        { name: 'typeOfStay', type: 'text', placeholder: 'Type of Stay', label: 'Type of Stay' },
        { name: 'paymentStatus', type: 'select', options: ['Paid', 'Pending'], placeholder: 'Payment Status', label: 'Payment Status' },
        { name: 'joinDate', type: 'date', label: 'Join Date' },
        { name: 'photo', type: 'file', accept: 'image/*', required: false, label: 'Profile Image' },
        { name: 'adharFrontImage', type: 'file', accept: 'image/*', required: false, label: 'Adhar-Front Image' },
        { name: 'adharBackImage', type: 'file', accept: 'image/*', required: false, label: 'Adhar-back Image' },
    ];

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setStudentData({
                ...studentData,
                [name]: files[0],
            });
        } else {
            setStudentData({
                ...studentData,
                [name]: value,
            });
        }
    };

    // Upload file to Firebase
    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, 'students/' + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress((prevProgress) => ({
                        ...prevProgress,
                        [file.name]: progress
                    }));
                },
                (error) => reject(error),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
                }
            );
        });
    };

    // Delete old file from Firebase
    const deleteOldFile = async (fileURL) => {
        if (!fileURL) return Promise.resolve();  // If no file to delete, skip
        const fileRef = ref(storage, fileURL);
        try {
            await deleteObject(fileRef);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const filesToUpload = ['adharFrontImage', 'adharBackImage', 'photo'];
        const uploadPromises = filesToUpload.map(async (fileField) => {
            // Check if a new file has been selected for upload
            if (studentData[fileField] && typeof studentData[fileField] !== 'string') {
                // Delete the old file
                await deleteOldFile(oldFiles[fileField]);

                // Upload the new file
                const downloadURL = await uploadFile(studentData[fileField]);
                return { [fileField]: downloadURL };
            }
            return null;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        uploadedFiles.forEach((result) => {
            if (result) {
                const key = Object.keys(result)[0];
                studentData[key] = result[key];  // Update student data with the new file URLs
            }
        });

        try {
            const response = await axios.put(`${API_BASE_URL}/students/edit/${studentId}`, studentData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                navigate('/students');
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col">
                                <label htmlFor={field.name} className="font-medium text-gray-700 mb-2">
                                    {field.label}
                                </label>
                                {field.type === 'select' ? (
                                    <select
                                        id={field.name}
                                        name={field.name}
                                        className="p-3 border border-gray-300 rounded-lg w-full"
                                        value={studentData[field.name] || ""}  // Ensure the value is never undefined or null
                                        onChange={handleChange}
                                        required={field.required}
                                    >
                                        <option value="">{field.placeholder}</option>
                                        {field.options.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
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
                                        value={field.type === 'file' ? undefined : (studentData[field.name] || "")}  // Ensure file input doesn't have a value, and other inputs get a valid string
                                        accept={field.accept || undefined}
                                        onChange={handleChange}
                                        required={field.required}
                                    />
                                )}

                            </div>
                        ))}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Update Student
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditStudent;
