import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import app from '../../firebase';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from "../auth/CheckAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const storage = getStorage(app);

const EditExpense = () => {
  const admin = useSelector((store) => store.auth.admin);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    otherReason: "",
    paymentMethod: "",
    amount: "",
    date: "",
    propertyName: "",
    propertyId: "",
    staff: "",
    billImg: null,
  });

  // const [properties, setProperties] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [oldFile, setOldFile] = useState({
    billImg: '',
});
  // const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!admin) return;
    const fetchexpenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/${id}`, {
          headers: { Authorization: `Bearer ${admin.token}`},
        });
        const expense = response.data.result
        setOldFile({
          billImg: expense.billImg,
      });
        setFormData({
          ...expense,
          date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : '',
        });
        // console.log(response.data.result)
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    const fetchStaffMembers = async () => {
      if (!admin) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/staff`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setStaffMembers(response.data);
      } catch (err) {
        console.error("Error fetching staff members:", err);
      }
    };

    const fetchCategories = async () => {
      if (!admin) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/categories`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching staff members:", err);
      }
    };
    fetchexpenses();
    fetchStaffMembers();
    fetchCategories();
  }, [admin]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'propertyName') {
      const selectedProperty = admin.properties.find(
        (property) => property.name === value
      );
      setFormData((prevData) => ({
        ...prevData,
        propertyName: value,
        propertyId: selectedProperty?.id || '', // Set the propertyId based on selected property
      }));
    } else if (name === 'billImg' && files && files[0]) {
      // If the field is a file input and we have a file, update the form data with the file
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],  // Save the file in formData
      }));
      // console.log('Selected file:', files[0]);  // Optionally log the file for debugging
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const uploadFile = (file) => {
    // console.log(file); // Check file details like name, size, etc.
    if (!file || file.size === 0) {
      console.log("Invalid file or file is empty");
      return Promise.reject("Invalid file");
    }
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, 'expense-bill/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // console.log('Bytes Transferred:', snapshot.bytesTransferred);
          // console.log('Total Bytes:', snapshot.totalBytes);
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
    // console.log(fileURL.billImg)
        if (!fileURL) return Promise.resolve();  // If no file to delete, skip
        const fileRef = ref(storage, fileURL.billImg);
        try {
          // console.log(fileRef)
            await deleteObject(fileRef);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      deleteOldFile(oldFile);
      if (formData.billImg) {
        const downloadURL = await uploadFile(formData.billImg);
        formData.billImg = downloadURL; // Replace the file object with the URL
      }
      // Prepare and send the data
      const response = await axios.put(
        `${API_BASE_URL}/expense/edit/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );

      toast.success('Expense Updated Successfully!', { autoClose: 500 });
      setTimeout(() => {
        navigate("/expenses");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error('Failed to update expense', { autoClose: 500 });
      setLoading(false);
    }
  };

  const renderInput = (label, name, type, value, onChange, extraProps = {}) => (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md"
        {...extraProps}
        min='0'
        onWheel={(e) => e.target.blur()}
      />
    </div>
  );

  const renderSelect = (label, name, value, onChange, options, extraProps = {}) => (
    <div>
      <label className="block text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md"
        {...extraProps}
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option, idx) =>
          typeof option === "object" ? (
            <option key={idx} value={option.value}>
              {option.label}
            </option>
          ) : (
            <option key={idx} value={option}>
              {option}
            </option>
          )
        )}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title and Type */}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Title", "title", "text", formData.title, handleChange, { required: true })}
            {renderSelect(
              "Type",
              "type",
              formData.type,
              handleChange,
              ["PG", "Mess", "Others"],
              { required: true }
            )}
          </div>

          {/* Category and Payment Method */}
          <div className="grid grid-cols-2 gap-4">
            {formData.type === "Others" ? (
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter category"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 mb-2 flex items-center">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleChange(e)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {categories
                    .filter((category) => category.type === formData.type)
                    .map((category, index) => (
                      <option key={index} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Conditionally Render Staff Member Dropdown */}
            {formData.category === "Salary" && (
              <div>
                {renderSelect(
                  "Staff Member",
                  "staff",
                  formData.staff,
                  handleChange,
                  staffMembers.map((staff) => ({
                    value: staff._id,
                    label: staff.Name,
                  })),
                  { required: true }
                )}
              </div>
            )}
            {renderInput("Other Reason", "otherReason", "text", formData.otherReason, handleChange)}
            {renderInput("Amount", "amount", "number", formData.amount, handleChange, {
              required: true,
            })}
            {renderSelect(
              "Payment Method",
              "paymentMethod",
              formData.paymentMethod,
              handleChange,
              ["UPI", "Bank Transfer", "Cash"],
              { required: true }
            )}

            {/* Conditionally render Transaction ID */}
            {formData.paymentMethod !== "Cash" &&
              renderInput(
                "Transaction ID",
                "transactionId",
                "text",
                formData.transactionId,
                handleChange,
                { required: true }
              )
            }
            {renderInput("Date", "date", "date", formData.date, handleChange, { required: true })}
            <div>
              <label htmlFor="propertyName" className="block text-gray-700 mb-2">Property</label>
              <select
                id="propertyName"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="" disabled>Select Property</option>
                {admin.properties.map((property) => (
                  <option key={property.id} value={property.name}>
                    {property.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Bill</label>
              <input
                type="file"
                name="billImg"
                onChange={(e) => handleChange(e)}
                className="w-full p-2 border rounded-md"
              />
            </div>

          </div>

          <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Add Expense'
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckAuth(EditExpense);