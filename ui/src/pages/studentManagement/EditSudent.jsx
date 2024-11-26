import React, { useEffect, useState } from 'react';
import axios from 'axios';
import app from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const storage = getStorage();

function EditStudent() {
    const admin = useSelector(store => store.auth.admin);
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
        dateOfBirth: '',
        gender: '',
        year: '',
        collegeName: '',
        parentOccupation: '',
        workingPlace: '',
    };

    const [studentData, setStudentData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [oldFiles, setOldFiles] = useState({
        adharFrontImage: '',
        adharBackImage: '',
        photo: '',
    });

    // Fetch the current student data
    useEffect(() => {
        if (!admin) return;
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/students/${studentId}`,
                    { headers: { 'Authorization': `Bearer ${admin.token}` } }
                );
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
        if (!admin) return;
        // Fetch property names from the backend
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/property`,
                    { headers: { 'Authorization': `Bearer ${admin.token}` } }
                );
                setProperties(response.data);  // Assuming the API returns an array of properties
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, []);

    const fields = [
        { name: 'name', type: 'text', placeholder: 'Name', required: true, label: 'Name' },
        { name: 'gender', type: 'text', placeholder: 'Gender', required: false, label: 'Gender' },
        { name: 'email', type: 'email', placeholder: 'Email', required: true, label: 'Email' },
        { name: 'address', type: 'text', placeholder: 'Address', required: false, label: 'Address' },
        { name: 'contactNo', type: 'text', placeholder: 'Contact Number', required: false, label: 'Contact Number' },
        { name: 'dateOfBirth', type: 'date', required: false, label: 'DOB' },
        { name: 'bloodGroup', type: 'text', placeholder: 'Blood Group', required: false, label: 'Blood Group' },
        { name: 'parentName', type: 'text', placeholder: "Parent's Name", required: false, label: 'Parent Name' },
        { name: 'parentNumber', type: 'text', placeholder: "Parent's Contact Number", required: false, label: 'Parent Contact' },
        { name: 'parentOccupation', type: 'text', placeholder: "Parent's Occupation", required: false, label: `Parent's Occupation` },
        { name: 'workingPlace', type: 'text', placeholder: 'Working Place', required: false, label: 'Working Place' },
        { name: 'collegeName', type: 'text', placeholder: 'College Name', required: false, label: 'College Name' },
        { name: 'course', type: 'text', placeholder: 'Course', required: false, label: 'Course of study' },
        { name: 'year', type: 'text', placeholder: 'Year', required: false, label: 'Year of study' },
        {
            name: 'pgName',
            type: 'select',
            options: properties.map((property) => property.propertyName),
            placeholder: 'PG Name',
            label: 'PG Name',
            required: true,
        },
        { name: 'roomType', type: 'text', placeholder: 'Room Type', required: false, label: 'Room Type' },
        { name: 'roomNo', type: 'text', placeholder: 'Room Number', label: 'Room Number' },
        { name: 'refundableDeposit', type: 'number', placeholder: 'Refundable Deposit', label: 'Refundable Deposit', required: false, },
        { name: 'nonRefundableDeposit', type: 'number', placeholder: 'Non-Refundable Deposit', label: 'Non-Refundable Deposit', required: false, },
        { name: 'monthlyRent', type: 'number', placeholder: 'Monthly Rent', label: 'Rent', required: false, },
        { name: 'referredBy', type: 'text', placeholder: 'Referred By', required: false, label: 'Referred By' },
        { name: 'typeOfStay', type: 'text', placeholder: 'Type of Stay', label: 'Type of Stay', required: false, },
        { name: 'paymentStatus', type: 'select', options: ['Paid', 'Pending'], placeholder: 'Payment Status', label: 'Payment Status' },
        { name: 'joinDate', type: 'date', label: 'Join Date', required: false, },
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
        } else if (name === 'pgName') {
            // Log the selected value to debug if necessary
            console.log("Selected PG Name:", value);

            // Find the selected property based on propertyName (or ID) from properties list
            const selectedProperty = properties.find(property => property.propertyName === value);

            // Debug: Log the selected property to verify its structure
            console.log("Selected Property:", selectedProperty);

            // Update the state with the property name, ID, and other details
            setStudentData((prevData) => ({
                ...prevData,
                pgName: value, // Store the name of the selected property
                property: selectedProperty ? selectedProperty._id : '', // Store the property ID
                branch: selectedProperty ? selectedProperty.branch : '', // Update other relevant details
                phase: selectedProperty ? selectedProperty.phase : '', // Update other relevant details
            }));
        } else {
            setStudentData({
                ...studentData,
                [name]: value || '',
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
        setLoading(true);
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
                    'Authorization': `Bearer ${admin.token}`
                },
            });

            if (response.status === 200) {
                toast.success('Successfully updated!', { autoClose: 500 });
                setTimeout(() => {
                    navigate('/students');
                    setLoading(false);
                }, 1000);
            } else {
                console.error('Error:', response.statusText);
                setLoading(false);
                toast.error(error.response.data.message, { autoClose: 2000 });
            }
        } catch (error) {
            console.error('Error updating student:', error);
            setLoading(false);
            toast.error('Something went wrong. Please try again later.');
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
                                        value={studentData[field.name] || ""}  // Set the value to the student data
                                        onChange={handleChange}  // Ensure handleChange is invoked
                                        required={field.required}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options.map((option, index) => (
                                            <option key={index} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                ) : field.type === 'file' ? (
                                    <>
                                        <input
                                            id={field.name}
                                            type="file"
                                            name={field.name}
                                            accept={field.accept}
                                            className="p-3 border border-gray-300 rounded-lg w-full"
                                            onChange={handleChange}
                                            required={field.required}
                                        />
                                        {oldFiles[field.name] && (
                                            <img
                                                src={oldFiles[field.name]}
                                                alt={`${field.label} Preview`}
                                                className="mt-2 w-32 h-32 object-cover border rounded-lg"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <input
                                        id={field.name}
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        className="p-3 border border-gray-300 rounded-lg w-full"
                                        value={studentData[field.name] || ""}
                                        onChange={handleChange}
                                        required={field.required}
                                        min='0'
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <ToastContainer />
                    <button
                        type="submit"
                        className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                        ) : (
                            'Update'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CheckAuth(EditStudent);
