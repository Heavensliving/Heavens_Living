import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useNavigate, useParams } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const EditDailyRentPerson = () => {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contactNo: '',
    email: '',
    bloodGroup: '',
    DailyRent: '',
    Photo: null,
    adharFrontImage: null,
    adharBackImage: null,
    roomType: '',
    roomNo: '',
    paymentStatus: '',
    propertyId: '',
    checkIn: '',
    checkOut: '',
    currentStatus: '',
    dateOfBirth: '',
    gender: '',
    branch: '',
    phase: '',
    property: '',
    typeOfStay: ''
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oldFiles, setOldFiles] = useState({
    Adharfrontside: '',
    Adharbackside: '',
    Photo: ''
  });

  useEffect(() => {
    const fetchProperties = async () => {
      if (!admin) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/property`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    const fetchDailyRentData = async () => {
      if (!admin) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/DailyRent/${id}`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        const fetchedData = response.data;
        setOldFiles({
          Adharfrontside: fetchedData.adharFrontImage,
          Adharbackside: fetchedData.adharBackImage,
          Photo: fetchedData.photo,
        });

        if (fetchedData.dateOfBirth && fetchedData.checkIn && fetchedData.checkOut) {
          fetchedData.dateOfBirth = new Date(fetchedData.dateOfBirth).toISOString().split('T')[0];
          fetchedData.checkIn = new Date(fetchedData.checkIn).toISOString().split('T')[0];
          fetchedData.checkOut = new Date(fetchedData.checkOut).toISOString().split('T')[0];
        }
        setFormData({
          name: fetchedData.name || '',
          address: fetchedData.address || '',
          contactNo: fetchedData.contactNo || '',
          email: fetchedData.email || '',
          bloodGroup: fetchedData.bloodGroup || '',
          DailyRent: fetchedData.DailyRent || '',
          Photo: null,
          adharFrontImage: null,
          adharBackImage: null,
          roomType: fetchedData.roomType || '',
          roomNo: fetchedData.roomNo || '',
          paymentStatus: fetchedData.paymentStatus || '',
          propertyId: fetchedData.property || '',
          checkIn: fetchedData.checkIn || '',
          checkOut: fetchedData.checkOut || '',
          currentStatus: fetchedData.currentStatus || '',
          dateOfBirth: fetchedData.dateOfBirth || '',
          gender: fetchedData.gender || '',
          branch: fetchedData.branch || '',
          phase: fetchedData.phase || '',
          property: fetchedData.property || '',
          typeOfStay: fetchedData.typeOfStay || ''
        });
      } catch (error) {
        console.error('Error fetching daily rent data:', error);
      }
    };

    fetchProperties();
    fetchDailyRentData();
  }, [id]);

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
    setLoading(true);
    e.preventDefault();
    const filesToUpload = ['photo', 'adharFrontImage', 'adharBackImage'];
    const uploadPromises = filesToUpload.map(async (fileField) => {
      if (formData[fileField] && typeof formData[fileField] === 'object') {
        await deleteOldFile(oldFiles[fileField]);
        const downloadURL = await uploadFile(formData[fileField]);
        return { [fileField]: downloadURL };
      }
      return null;
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    uploadedFiles.forEach((result) => {
      if (result) {
        const key = Object.keys(result)[0];
        formData[key] = result[key];
      }
    });

    try {
      const response = await axios.put(`${API_BASE_URL}/DailyRent/update/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin.token}`,
        },

      });
      if (response.status === 200) {
        // console.log('Success:', response.data); //debug statement
        toast.success('Successfully Updated!', { autoClose: 500 });
        setTimeout(() => {
          navigate('/dailyRent');
          setLoading(false);
        }, 1000);
      } else {
        console.error('Error:', response.statusText);
        setLoading(false);
        toast.error(error.response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-wrap -mx-2 space-y-4">
        <Input label="Name" name="name" value={formData.name} onChange={handleChange} required />
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
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
        <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        <Input label="Contact No" name="contactNo" value={formData.contactNo} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
        <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
        <Select
          label="Pg Name"
          name="propertyId"
          value={formData.propertyId}
          onChange={handleChange}
          options={properties.map(property => ({ _id: property._id, propertyName: property.propertyName }))}
          required
        />
        <Input label="Room Type" name="roomType" value={formData.roomType} onChange={handleChange} />
        <Input label="Room No" name="roomNo" value={formData.roomNo} onChange={handleChange} />
          <Input label="Check In Date" type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
          <Input label="Check Out Date" type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
        <Input label="Type of Stay" name="typeOfStay" value={formData.typeOfStay} onChange={handleChange} />
        <Input label="Rent" type="number" name="DailyRent" value={formData.DailyRent} onChange={handleChange} />
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
        <Input label="Photo" type="file" name="Photo" onChange={handleChange} accept="image/*" />
        <Input label="Aadhar Front Image" type="file" name="adharFrontImage" onChange={handleChange} accept="image/*" />
        <Input label="Aadhar Back Image" type="file" name="adharBackImage" onChange={handleChange} accept="image/*" />
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
  );
};

export default EditDailyRentPerson;
