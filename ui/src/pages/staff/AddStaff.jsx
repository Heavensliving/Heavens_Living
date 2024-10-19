import React, { useEffect, useState } from 'react';
import axios from 'axios';
import app from '../../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

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
    propertyName: '',
    Status: 'Active'
  });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch property names from the backend
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`);
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const propertyNames = properties.map((property) => ({
    id: property._id,
    name: property.propertyName
  }))

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setStaffData({
        ...staffData,
        [name]: files[0],
      });
    } else if (name === 'propertyName') {
      // Debug: Log the selected value to see if it's correct
      console.log("Selected property Name:", value);

      // Find the selected property using the correct key
      const selectedProperty = properties.find(property => property.propertyName === value);

      // Debug: Log the selected property to verify its structure
      console.log("Selected Property:", selectedProperty);

      setStaffData((prevData) => ({
        ...prevData,
        propertyName: value, // Store the name
        property: selectedProperty ? selectedProperty._id : '', 
        branch: selectedProperty ? selectedProperty.branch : '', 
        phase: selectedProperty ? selectedProperty.phase : '',
      }));
    } else {
      setStaffData({
        ...staffData,
        [name]: value || '',
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
      console.log(staffData)
      const response = await axios.post(`${API_BASE_URL}/staff/add`, staffData, {
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
            Register Staff
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddStaff;
