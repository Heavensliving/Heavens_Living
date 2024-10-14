import React, { useState } from 'react';
import axios from 'axios';
import app from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const storage = getStorage();

function AddStudent() {
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

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Name', required: true, label: 'Name' },
    { name: 'email', type: 'email', placeholder: 'Email', required: true, label: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password', required: true, label: 'Password' },
    { name: 'address', type: 'text', placeholder: 'Address', required: true, label: 'Address' },
    { name: 'contactNo', type: 'text', placeholder: 'Contact Number', required: true, label: 'Contact Number' },
    { name: 'bloodGroup', type: 'text', placeholder: 'Blood Group', required: true, label: 'Blood Group' },
    { name: 'parentName', type: 'text', placeholder: "Parent's Name", required: true, label: 'Parent Name' },
    { name: 'parentNumber', type: 'text', placeholder: "Parent's Contact Number", required: true, label: 'Parent Contact' },
    { name: 'course', type: 'text', placeholder: 'Course', label: 'Course' },
    { name: 'advanceFee', type: 'number', placeholder: 'Advance Fee', label: 'Advance Fee' },
    { name: 'nonRefundableDeposit', type: 'number', placeholder: 'Non-Refundable Deposit', label: 'Deposit' },
    { name: 'monthlyRent', type: 'number', placeholder: 'Monthly Rent', label: 'Rent' },
    { name: 'photo', type: 'file', accept: 'image/*', required: false, label: 'Profile Image' },
    { name: 'adharFrontImage', type: 'file', accept: 'image/*', required: false, label: 'Adhar-Front Image' },
    { name: 'adharBackImage', type: 'file', accept: 'image/*', required: false, label: 'Adhar-back Image' },
    { name: 'pgName', type: 'text', placeholder: 'PG Name', label: 'PG' },
    { name: 'roomType', type: 'select', options: ['Single', 'Shared', 'Deluxe'], placeholder: 'Room Type', required: true, label: 'Room' },
    { name: 'roomNo', type: 'text', placeholder: 'Room Number', label: 'Room Number' },
    { name: 'referredBy', type: 'text', placeholder: 'Referred By', required: true, label: 'Referred By' },
    { name: 'typeOfStay', type: 'text', placeholder: 'Type of Stay', label: 'Type of Stay' },
    { name: 'paymentStatus', type: 'text', placeholder: 'Payment Status', label: 'Payment Status' },
    { name: 'joinDate', type: 'date', label: 'Join Date' },
    { name: 'dateOfBirth', type: 'date', required: true, label: 'DOB' },
    { name: 'gender', type: 'text', placeholder: 'Gender', required: true, label: 'Gender' },
    { name: 'year', type: 'text', placeholder: 'Year', required: true, label: 'Year' },
    { name: 'collegeName', type: 'text', placeholder: 'College Name', required: true, label: 'College Name' },
    { name: 'parentOccupation', type: 'text', placeholder: "Parent's Occupation", label: `Parent's Occupation` },
    { name: 'workingPlace', type: 'text', placeholder: 'Working Place', label: 'Working Place' },
    { name: 'phase', type: 'text', placeholder: 'phase', label: 'Phase' },
    { name: 'branch', type: 'text', placeholder: 'branch', label: 'Branch' },
  ];

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

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the student data for upload
    const filesToUpload = ['adharFrontImage', 'adharBackImage', 'photo'];
    const uploadPromises = filesToUpload.map(async (fileField) => {
      if (studentData[fileField]) {
        const downloadURL = await uploadFile(studentData[fileField]);
        return { [fileField]: downloadURL };
      }
      return null;
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    // Merge uploaded file URLs with the student data
    uploadedFiles.forEach((result) => {
      if (result) {
        const key = Object.keys(result)[0];
        studentData[key] = result[key];
      }
    });

    // Now prepare formData to submit
    const formData = new FormData();
    for (const key in studentData) {
      formData.append(key, studentData[key]);
    }

    console.log("studentData", studentData)

    try {
      const response = await axios.post('http://localhost:3000/api/students/add', studentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Success:', response.data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                {/* Label for each field */}
                <label htmlFor={field.name} className="font-medium text-gray-700 mb-2">
                  {field.label}
                </label>

                {/* Input or select field */}
                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    value={studentData[field.name]}
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
                    value={field.type === 'file' ? undefined : studentData[field.name]}
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
            Register Student
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudent;
