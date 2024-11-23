import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckAuth from '../auth/CheckAuth';

const storage = getStorage(app);

const Input = ({ label, type = 'text', name, value, onChange, required = false, accept, placeholder }) => (
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
      placeholder={placeholder}
      min='1'
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
    checkIn: '',
    checkOut: '',
    currentStatus: '',
    dateOfBirth: '',
    gender: '',
    branch: '',
    phase: '',
  });

  const [properties, setProperties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [pgName, setPgName] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [roomNo, setRoomNo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) return;
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!admin) return;
    if (pgName) {
      console.log(pgName)
      const fetchRooms = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/room/${pgName}`, {
            headers: { 'Authorization': `Bearer ${admin.token}` },
          });
          const roomsData = Array.isArray(response.data)
            ? response.data // If response.data is already an array
            : response.data.rooms || [];
          console.log("here", response.data)
          // Filter rooms with vacantSlot > 0
          const availableRooms = roomsData.filter(room => room.vacantSlot > 0);
          console.log(availableRooms)
          setRooms(availableRooms); // Set the rooms to state
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
      fetchRooms();
    }
  }, [pgName, admin]);

  useEffect(() => {
    if (roomType) {
      console.log(roomType)
      const matchingRooms = rooms.filter((room) => room.roomType === roomType);
      console.log(matchingRooms)
      setRoomNo(matchingRooms);
      console.log(matchingRooms)
    } else {
      setRoomNo(rooms);
    }
  }, [roomType, rooms]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (name === 'roomType') {
      console.log('hreer')
      setRoomType(value);
      setFormData((preData) => {
        return { ...preData, roomType: value }
      })
    } else if (name === 'propertyId') {
      // Debug: Log the selected value to see if it's correct
      console.log("Selected PG Name:", value);
      const selectedProperty = properties.find(property => property._id === value);
      console.log("Selected Property:", selectedProperty);
      setPgName(selectedProperty.propertyName)
      setFormData((prevData) => ({
        ...prevData,
        pgName: value,
      }));
    }
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
    setLoading(true)
    e.preventDefault();
    console.log(formData)
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
        formData[key] = result[key];
      }
    });
    const Data = new FormData();
    for (const key in formData) {
      Data.append(key, formData[key]);
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/DailyRent/Add`, formData,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      if (response.status === 201) {
        // console.log('Success:', response.data); //debug statement
        toast.success('Successfully registered!', { autoClose: 500 });
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
        <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' }
          ]}
          required
        />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
        <Input label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        <Input label="Contact No" name="contactNo" value={formData.contactNo} onChange={handleChange} required />
        <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
        <Input label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
        <Input label="Daily Rent" type="number" name="DailyRent" value={formData.DailyRent} onChange={handleChange} />
        <Select
          label="Pg Name"
          name="propertyId"
          value={formData.propertyName}
          onChange={handleChange}
          options={properties.map(property => ({ _id: property._id, propertyName: property.propertyName }))}
          required
        />
        <Select
          label="Room Type"
          name="roomType"
          onChange={handleChange}
          options={rooms.map(room => ({ _id: room.id, propertyName: room.roomType }))}
          required
        />
        <Select
          label="Room No"
          name="roomNo"
          onChange={handleChange}
          options={roomNo.map(room => ({ _id: room.id, propertyName: room.roomNumber }))}
          required
        />
        <Input label="Type of Stay" name="typeOfStay" value={formData.typeOfStay} onChange={handleChange} />
        <Input label="Check In Date" type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
        <Input label="Check Out Date" type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
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
        <Input label="Photo" type="file" name="photo" onChange={handleChange} accept="image/*" />
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
              'Register'
            )}
          </button>
      </form>
    </div>
  );
};

export default CheckAuth(AddDailyRent);
