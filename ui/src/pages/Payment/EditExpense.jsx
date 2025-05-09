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
import { v4 as uuidv4 } from 'uuid';
import Resizer from "react-image-file-resizer";

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
    transactionId: "",
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
  const [pettyCash, setPettyCash] = useState([]);

  useEffect(() => {
    if (!admin) return;
    const fetchPettyCash = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/pettycash/get`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setPettyCash(response.data);
      } catch (error) {
        console.error("Error fetching Petty Cash:", error);
      }
    };

    const fetchexpenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/${id}`, {
          headers: { Authorization: `Bearer ${admin.token}` },
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
    fetchPettyCash();
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

  // ✅ Function to Resize & Compress Image
  const resizeImage = (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1000, // Max width
        1000, // Max height
        "JPEG", // Convert to JPEG (or PNG, WEBP)
        80, // Quality (0-100)
        0, // Rotation
        (uri) => resolve(uri), // Resized image as Blob
        "blob" // Output format
      );
    });
  };

  // ✅ Function to Upload Image to Firebase
  const uploadFile = async (file) => {
    if (!file || file.size === 0) {
      console.log("Invalid file or file is empty");
      return Promise.reject("Invalid file");
    }

    try {
      // 🔹 Resize & compress image before upload
      const compressedFile = await resizeImage(file);

      // 🔹 Generate unique filename
      const fileExtension = file.name.split(".").pop();
      const uniqueFileName = `expense-bill/${Date.now()}_${uuidv4()}.${fileExtension}`;

      // 🔹 Upload to Firebase Storage
      const storageRef = ref(storage, uniqueFileName);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      return Promise.reject("Image compression failed");
    }
  };

  // ✅ Function to Delete Old Image from Firebase
  const deleteOldFile = async (fileURL) => {
    if (!fileURL?.billImg) return Promise.resolve(); // Skip if no file to delete

    const fileRef = ref(storage, fileURL.billImg);
    try {
      await deleteObject(fileRef);
      console.log("Old image deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // ✅ Handle Form Submission (Update Expense)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔹 Check if file has changed
      if (formData.billImg && formData.billImg !== oldFile.billImg) {
        // 🔹 Delete old file
        await deleteOldFile(oldFile);

        // 🔹 Upload new file
        const downloadURL = await uploadFile(formData.billImg);
        formData.billImg = downloadURL; // Replace file object with URL
      } else {
        // 🔹 If file unchanged, keep old URL
        formData.billImg = oldFile.billImg;
      }

      // 🔹 Send update request to backend
      const response = await axios.put(
        `${API_BASE_URL}/expense/edit/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );

      toast.success("Expense Updated Successfully!", { autoClose: 500 });
      setTimeout(() => {
        navigate("/expenses");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating expense:", error);

      // 🔹 Show backend error message
      const errorMessage = error.response?.data?.error || "Failed to update expense";
      toast.error(errorMessage, { autoClose: 500 });
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
            {/* Title and Type */}
            {renderInput("Title", "title", "text", formData.title, handleChange, { required: true })}
            {renderSelect(
              "Type",
              "type",
              formData.type,
              handleChange,
              ["PG", "Mess", "Others"],
              { required: true }
            )}

            {/* Category */}
            {formData.type === "Others" ? (
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter category"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
            {/* Step 1: Payment Method */}
            {renderSelect(
              "Payment Method",
              "paymentMethod",
              formData.paymentMethod,
              handleChange,
              ["UPI", "Bank Transfer", "Cash", "Petty Cash"],
              {
                required: true,
                className: "w-full p-2 border rounded-md",
              }
            )}

            {/* Step 2: Petty Cash Logic */}
            {formData.paymentMethod === "Petty Cash" && (
              <>
                {/* Handled By (Now Editable) */}
                <div>
                  <label className="block text-gray-700 mb-2">Handled By</label>
                  <select
                    id="handledBy"
                    name="handledBy"
                    value={formData.handledBy}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="" disabled>Select Handled By</option>
                    {pettyCash.map((cash) => (
                      <option key={cash._id} value={cash.staff}>
                        {cash.staff}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Available Amount (Still Read-Only) */}
                {formData.handledBy && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">Available Amount</label>
                      <input
                        type="text"
                        value={pettyCash.find((cash) => cash.staff === formData.handledBy)?.amount || 0}
                        disabled
                        className="w-full p-2 border rounded-md bg-gray-100 text-gray-700"
                      />
                    </div>

                    {/* Spent Via (Now Editable) */}
                    {renderSelect(
                      "Spent via",
                      "pettyCashType",
                      formData.pettyCashType || "",
                      handleChange,
                      ["Cash", "UPI"],
                      {
                        required: true,
                        className: "w-full p-2 border rounded-md",
                      }
                    )}

                    {/* Amount (Now Editable) */}
                    {renderInput(
                      "Amount",
                      "amount",
                      "number",
                      formData.amount,
                      handleChange,
                      {
                        required: true,
                        className: "w-full p-2 border rounded-md text-gray-700",
                      }
                    )}

                    {/* Show Transaction ID only if UPI selected */}
                    {formData.pettyCashType === "UPI" &&
                      renderInput(
                        "Transaction ID",
                        "transactionId",
                        "text",
                        formData.transactionId,
                        handleChange,
                        { required: true }
                      )}
                  </>
                )}
              </>
            )}

            {/* Step 3: Other Payment Methods (UPI / Bank Transfer)  */}
            {formData.paymentMethod !== "Cash" && formData.paymentMethod !== "Petty Cash" && (
              <>
                {renderInput(
                  "Amount",
                  "amount",
                  "number",
                  formData.amount,
                  handleChange,
                  { required: true, className: "w-full p-2 border rounded-md" }
                )}

                {renderInput(
                  "Transaction ID",
                  "transactionId",
                  "text",
                  formData.transactionId,
                  handleChange,
                  { required: true, className: "w-full p-2 border rounded-md" }
                )}
              </>
            )}

            {/* Step 4: If Cash, Show Amount */}
            {formData.paymentMethod === "Cash" &&
              renderInput(
                "Amount",
                "amount",
                "number",
                formData.amount,
                handleChange,
                { required: true, className: "w-full p-2 border rounded-md" }
              )}

            {renderInput("Date", "date", "date", formData.date, handleChange, { required: true })}

            {/* Bill Image */}
            <div>
              <label className="block text-gray-700 mb-2">Bill</label>
              <input
                type="file"
                name="billImg"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              {formData.billImg && typeof formData.billImg === "string" && (
                <div className="mt-4">
                  <img
                    src={formData.billImg}
                    alt="Bill Preview"
                    className="w-32 h-32 object-cover border rounded-md text-center mx-auto"
                  />
                  <p className="text-sm text-gray-500 mt-2 text-center">Current Bill Image</p>
                </div>
              )}
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
              'Edit Expense'
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckAuth(EditExpense);