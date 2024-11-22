import { useEffect, useState } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line no-unused-vars
import app from '../../firebase';

const storage = getStorage();

function EditStaff() {
    const admin = useSelector(store => store.auth.admin);
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
        joinDate: '',
        PaySchedule: '',
        propertyName: '',
        Status: 'Active', // Initialize status
        property: '',
    });
    const [properties, setProperties] = useState([]);
    const [uploadProgress, setUploadProgress] = useState({});
    const [loading, setLoading] = useState(false);
    const [oldFiles, setOldFiles] = useState({
        adharFrontImage: '',
        adharBackImage: '',
        photo: '',
    });

    useEffect(() => {
        // Fetch staff data and property names from the backend
        const fetchData = async () => {
            try {
                const staffResponse = await axios.get(`${API_BASE_URL}/staff/${staffId}`,
                    { headers: { 'Authorization': `Bearer ${admin.token}` } }
                );
                const propertiesResponse = await axios.get(`${API_BASE_URL}/property`,
                    { headers: { 'Authorization': `Bearer ${admin.token}` } }
                );

                // Ensure the date fields are in the correct format (YYYY-MM-DD)
                const staff = staffResponse.data;
                setOldFiles({
                    Adharfrontside: staff.Adharfrontside,
                    Adharbackside: staff.Adharbackside,
                    Photo: staff.Photo,
                });

                setStaffData({
                    ...staff,
                    DOB: staff.DOB ? new Date(staff.DOB).toISOString().split('T')[0] : '',
                    joinDate: staff.joinDate ? new Date(staff.joinDate).toISOString().split('T')[0] : '',
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

    // Upload file to Firebase
    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, 'staff/' + file.name);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(staffData)
        const filesToUpload = ['Adharfrontside', 'Adharbackside', 'Photo'];
        const uploadPromises = filesToUpload.map(async (fileField) => {
            // Check if a new file has been selected for upload
            if (staffData[fileField] && typeof staffData[fileField] !== 'string') {
                // Delete the old file
                await deleteOldFile(oldFiles[fileField]);

                // Upload the new file
                const downloadURL = await uploadFile(staffData[fileField]);
                return { [fileField]: downloadURL };
            }
            return null;
        });

        const uploadedFiles = await Promise.all(uploadPromises);
        uploadedFiles.forEach((result) => {
            if (result) {
                const key = Object.keys(result)[0];
                staffData[key] = result[key];  // Update student data with the new file URLs
            }
        });

        const formData = new FormData();
        for (const key in staffData) {
            formData.append(key, staffData[key]);
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/staff/edit/${staffId}`, staffData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${admin.token}`
                },
            });

            if (response.status === 200) {
                toast.success('Successfully Updated!', { autoClose: 500 });
                setTimeout(() => {
                    navigate('/staffs');
                    setLoading(false);
                }, 1000);
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
        {
            name: 'Status',
            label: 'Status',
            type: 'select',
            options: ['Active', 'Inactive'], // Added status options
            placeholder: 'Select Status',
            required: true
        },
        { name: 'joinDate', label: 'Join Date', type: 'date', placeholder: 'Join Date', required: true },
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
                                    <>
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
                                        {oldFiles[field.name] && (
                                            <img
                                                src={oldFiles[field.name]}
                                                alt={`${field.label} Preview`}
                                                className="mt-2 w-32 h-32 object-cover border rounded-lg"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <ToastContainer />
                    <button
                        type="submit"
                        className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                        ) : (
                            'Update Staff'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditStaff;