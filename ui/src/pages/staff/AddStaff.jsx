import React, { useState } from 'react';
import axios from 'axios';
import app from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const storage = getStorage();

function AddStaff() {
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
    Status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setStaffData({
        ...staffData,
        [name]: files[0], // Handle file input
      });
    } else {
      setStaffData({
        ...staffData,
        [name]: value, // Handle text input
      });
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, 'staff/' + file.name); // Different folder for staff
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // File fields to be uploaded
    const filesToUpload = ['Photo', 'Adharfrontside', 'Adharbackside'];
    const uploadPromises = filesToUpload.map(async (fileField) => {
      if (staffData[fileField]) {
        const downloadURL = await uploadFile(staffData[fileField]);
        return { [fileField]: downloadURL };
      }
      return null;
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // Merge uploaded file URLs with the staff data
    uploadedFiles.forEach((result) => {
      if (result) {
        const key = Object.keys(result)[0];
        staffData[key] = result[key];
      }
    });

    // Prepare form data
    const formData = new FormData();
    for (const key in staffData) {
      formData.append(key, staffData[key]);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/staff/add', staffData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
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
    { name: 'Name', type: 'text', placeholder: 'Staff Name', required: true },
    { name: 'Address', type: 'text', placeholder: 'Address', required: true },
    { name: 'DOB', type: 'date', placeholder: 'Date of Birth', required: true },
    { name: 'Contactnumber', type: 'number', placeholder: 'Contact Number', required: true },
    { name: 'Email', type: 'email', placeholder: 'Email (optional)', required: false },
    { name: 'Photo', type: 'file', placeholder: 'Upload Photo', accept: 'image/*' },
    { name: 'Adharfrontside', type: 'file', placeholder: 'Upload Aadhar Front', accept: 'image/*' },
    { name: 'Adharbackside', type: 'file', placeholder: 'Upload Aadhar Back', accept: 'image/*' },
    { name: 'Type', type: 'text', placeholder: 'Type', required: true },
    { name: 'Salary', type: 'text', placeholder: 'Salary', required: true },
    { name: 'PaymentDate', type: 'date', placeholder: 'Payment Date', required: true },
    { name: 'PaySchedule', type: 'text', placeholder: 'Pay Schedule', required: true }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
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
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register Staff
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStaff;
