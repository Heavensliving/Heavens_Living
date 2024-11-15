import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useSelector } from 'react-redux';

const storage = getStorage(app);

const Input = ({ label, type = 'text', name, value, onChange, required = false, accept }) => (
  <div className="w-full md:w-1/2 px-2 mb-4">
    <label className="block font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded"
      required={required}
      accept={accept}
    />
  </div>
);

const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div className="w-full md:w-1/2 px-2 mb-4">
    <label className="block font-medium">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded"
      required={required}
    >
      <option value="">{`Select ${label}`}</option>
      {options.map((option, idx) => (
        <option key={idx} value={option.value || option._id}>
          {option.label || option.propertyName}
        </option>
      ))}
    </select>
  </div>
);

const AddDailyRent = () => {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNo: '',
    email: '',
    bloodGroup: '',
    DailyRent: '',
    photo: null,
    adharFrontImage: null,
    adharBackImage: null,
    roomType: '',
    roomNo: '',
    typeOfStay: '',
    paymentStatus: '',
    pgName: '',
    joinDate: '',
    currentStatus: '',
    dateOfBirth: '',
    gender: '',
    branch: '',
    phase: '',
    property: ''
  });

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, 'dailyRent/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filesToUpload = ['photo', 'adharFrontImage', 'adharBackImage'];
    const uploadPromises = filesToUpload.map(async (fileField) => {
      if (formData[fileField]) {
        const downloadURL = await uploadFile(formData[fileField]);
        return { [fileField]: downloadURL };
      }
      return null;
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    console.log(uploadedFiles)

    uploadedFiles.forEach((result) => {
      if (result) {
        const key = Object.keys(result)[0];
        formData[key] = result[key]; // Update formData with the URL of the uploaded file
      }
    });

    // Create FormData for submission
    const Data = new FormData();
    for (const key in formData) {
      Data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/DailyRent/Add`, formData,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      navigate('/dailyRent');
    } catch (error) {
      console.error('Error adding daily rent person:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-wrap -mx-2 space-y-4">
        <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
        <Input label="Contact No" name="contactNo" value={formData.contactNo} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
        <Input label="Daily Rent" type="number" name="DailyRent" value={formData.DailyRent} onChange={handleChange} />

        <Select
          label="Pg Name"
          name="propertyId"
          value={formData.propertyId}
          onChange={handleChange}
          options={properties.map(property => ({ _id: property._id, propertyName: property.propertyName }))}
          required
        />

        <Input label="Photo" type="file" name="photo" onChange={handleChange} accept="image/*" />
        <Input label="Aadhar Front Image" type="file" name="adharFrontImage" onChange={handleChange} accept="image/*" />
        <Input label="Aadhar Back Image" type="file" name="adharBackImage" onChange={handleChange} accept="image/*" />

        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' }
          ]}
          required
        />

        <Select
          label="Payment Status"
          name="paymentStatus"
          value={formData.paymentStatus}
          onChange={handleChange}
          options={[
            { value: 'Paid', label: 'Paid' },
            { value: 'Pending', label: 'Pending' }
          ]}
          required
        />

        <Input label="Join Date" type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} />
        <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

        <Input label="Room Type" name="roomType" value={formData.roomType} onChange={handleChange} />
        <Input label="Room No" name="roomNo" value={formData.roomNo} onChange={handleChange} />
        <Input label="Type of Stay" name="typeOfStay" value={formData.typeOfStay} onChange={handleChange} />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4">Submit</button>
      </form>
    </div>
  );
};

export default AddDailyRent;
