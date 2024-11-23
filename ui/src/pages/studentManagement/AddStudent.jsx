import { useEffect, useState } from 'react';
import axios from 'axios';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckAuth from '../auth/CheckAuth';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
// eslint-disable-next-line no-unused-vars
import app from '../../firebase';

const storage = getStorage();

function AddStudent() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate()
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
    refundableDeposit: "",
    nonRefundableDeposit: '',
    monthlyRent: '',
    adharFrontImage: '',
    adharBackImage: '',
    photo: '',
    pgName: '',
    roomType: '',
    roomNo: '',
    referredBy: '',
    typeOfStay: '',
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
  const [rooms, setRooms] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [roomNo, setRoomNo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!admin) return;
    // Fetch property names from the backend
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );  // Update with actual API endpoint
        setProperties(response.data);  // Assuming the API returns an array of properties
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    if (!admin) return;
    // Fetch rooms when a property is selected
    if (studentData.pgName) {
      console.log(studentData.pgName)
      const fetchRooms = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/room/${studentData.pgName}`, {
            headers: { 'Authorization': `Bearer ${admin.token}` },
          });

          // console.log(response.data) //debug statement
          // Filter rooms with vacantSlot > 0
          const availableRooms = response.data.filter(room => room.vacantSlot > 0);
          setRooms(availableRooms); // Set the rooms to state
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };

      fetchRooms();
    }
  }, [studentData.pgName, admin]);

  useEffect(() => {
    if (roomType) {
      // console.log(roomType) //debug statement
      const matchingRooms = rooms.filter((room) => room.roomType === roomType);
      setRoomNo(matchingRooms);
      // console.log(matchingRooms) //debug statement
    } else {
      setRoomNo(rooms);
    }
  }, [roomType, rooms]);

  const fields = [
    { name: 'name', type: 'text', placeholder: 'Name', required: true, label: 'Name' },
    { name: 'gender', type: 'select', options: ['Male', 'Female', 'Others'], placeholder: 'Gender', required: true, label: 'Gender' }, // Updated gender field
    { name: 'email', type: 'email', placeholder: 'Email', required: true, label: 'Email' },
    { name: 'password', type: 'password', placeholder: 'Password', required: true, label: 'Password' },
    { name: 'address', type: 'text', placeholder: 'Address', required: false, label: 'Address' },
    { name: 'contactNo', type: 'text', placeholder: 'Contact Number', required: true, label: 'Contact Number' },
    { name: 'dateOfBirth', type: 'date', required: false, label: 'DOB' },
    { name: 'bloodGroup', type: 'text', placeholder: 'Blood Group', required: false, label: 'Blood Group' },
    { name: 'parentName', type: 'text', placeholder: "Parent's Name", required: false, label: 'Parent Name' },
    { name: 'parentNumber', type: 'text', placeholder: "Parent's Contact Number", required: false, label: 'Parent Contact' },
    { name: 'parentOccupation', type: 'text', placeholder: "Parent's Occupation", label: `Parent's Occupation`, required: false, },
    { name: 'workingPlace', type: 'text', placeholder: 'Working Place', label: 'Working Place', required: false, },
    { name: 'collegeName', type: 'text', placeholder: 'College Name', label: 'College Name', required: false, },
    { name: 'course', type: 'text', placeholder: 'Course', label: 'Course of study', required: false, },
    { name: 'year', type: 'text', placeholder: 'Year', label: 'Year of study', required: false, },
    {
      name: 'pgName',
      type: 'select',
      options: properties.map((property) => ({
        id: property.id,
        name: property.propertyName
      })),
      placeholder: 'Property Name',
      label: 'Property Name',
      required: true,
    },
    {
      name: 'roomType',
      type: 'select',
      options: rooms.map((room) => ({
        id: room.id,
        name: room.roomType
      })),
      placeholder: 'Room Type',
      label: 'Room Type',
      required: true,
    },
    {
      name: 'roomNo',
      type: 'select',
      options: roomNo.map((room) => ({
        id: room.id,
        name: room.roomNumber
      })),
      placeholder: 'Select Room',
      label: 'Select Room',
      required: true,
    },
    { name: 'refundableDeposit', type: 'number', placeholder: 'Refundable Deposit', label: 'Refundable Deposit', required: true, },
    { name: 'nonRefundableDeposit', type: 'number', placeholder: 'Non-Refundable Deposit', label: 'Non-Refundable Deposit', required: true, },
    { name: 'monthlyRent', type: 'number', placeholder: 'Monthly Rent', label: 'Rent', required: true, },
    { name: 'referredBy', type: 'text', placeholder: 'Referred By', required: false, label: 'Referred By' },
    { name: 'typeOfStay', type: 'text', placeholder: 'Type of Stay', label: 'Type of Stay', required: true, },
    { name: 'paymentStatus', type: 'select', options: ['Paid', 'Pending'], placeholder: 'Payment Status', label: 'Payment Status' },
    { name: 'joinDate', type: 'date', label: 'Join Date', required: true, },
    { name: 'photo', type: 'file', accept: 'image/*', required: false, label: 'Profile Image' },
    { name: 'adharFrontImage', type: 'file', accept: 'image/*', required: false, label: 'Adhar-Front Image' },
    { name: 'adharBackImage', type: 'file', accept: 'image/*', required: false, label: 'Adhar-back Image' },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setStudentData({
        ...studentData,
        [name]: files[0],
      });
    } else if (name === 'pgName') {
      // Debug: Log the selected value to see if it's correct
      //console.log("Selected PG Name:", value);

      // Find the selected property using the correct key
      const selectedProperty = properties.find(property => property.propertyName === value);

      // Debug: Log the selected property to verify its structure
      //console.log("Selected Property:", selectedProperty);

      setStudentData((prevData) => ({
        ...prevData,
        pgName: value, // Store the name
        property: selectedProperty ? selectedProperty._id : '',
        branch: selectedProperty ? selectedProperty.branch : '',
        phase: selectedProperty ? selectedProperty.phase : '',
      }));
    } else if (name === 'roomType') {
      setRoomType(value);
      setStudentData((preData) => {
        return { ...preData, roomType: value }
      })
    }
    else {
      setStudentData({
        ...studentData,
        [name]: value || '',
      });
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, 'students/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done'); //debug statement
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused'); //debug statement
              break;
            case 'running':
              console.log('Upload is running'); //debug statement
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

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword); // Toggle the visibility state
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

    // console.log("studentData", studentData) //debug statement

    try {
      const response = await axios.post(`${API_BASE_URL}/students/add`, studentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${admin.token}`
        },
      });

      if (response.status === 201) {
        // console.log('Success:', response.data); //debug statement
        toast.success('Successfully registered!', { autoClose: 500 });
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
      console.error('Error:', error);
      setLoading(false);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div key={index} className="flex flex-col">
                <label htmlFor={field.name} className="font-medium text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.name === 'password' ? ( // Check if the field is password
                  <div className="relative">
                    <input
                      required={field.required}
                      type={showPassword ? 'text' : 'password'} // Toggle input type
                      name={field.name}
                      placeholder={field.placeholder}
                      onChange={handleChange}
                      className="p-3 border border-gray-300 rounded-lg w-full"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-500"
                    >
                      {showPassword ? <FaEyeSlash size={20} className='mt-1'/> : <FaEye size={20} className='mt-1'/>} {/* Eye icon toggle */}
                    </button>
                  </div>
                ) : field.type === 'select' ? (
                  <select
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    name={field.name}
                    value={studentData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value='' disabled>{field.placeholder}</option>
                    {field.options.map((option, index) => (
                      <option key={index} value={typeof option === 'object' ? option.name : option}>
                        {typeof option === 'object' ? option.name : option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required={field.required}
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    onChange={handleChange}
                    accept={field.accept}
                    className="p-3 border border-gray-300 rounded-lg w-full"
                    min={'0'}
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
              'Register'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckAuth(AddStudent);