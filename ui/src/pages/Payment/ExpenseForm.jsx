import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from "../auth/CheckAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus } from "react-icons/fa";
import CategoryForm from "./CategoryForm";
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique names
import Resizer from "react-image-file-resizer";

const storage = getStorage(app);

const ExpenseForm = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    otherReason: "",
    paymentMethod: "",
    amount: "",
    salaryMonth: "",
    leaveTaken: "",
    transactionId: "",
    handledBy: '',
    pettyCashType: "",
    date: "",
    propertyName: "",
    propertyId: "",
    staff: "",
    billImg: null,
  });

  // const [properties, setProperties] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [pettyCash, setPettyCash] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!admin) return;
    const fetchPettyCash = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/pettycash/get`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setPettyCash(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching Petty Cash:", error);
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
        // console.log(response.data)
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching category", err);
      }
    };

    // fetchProperties();
    fetchStaffMembers();
    fetchCategories();
    fetchPettyCash();
  }, [admin]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Reset dependent fields
      if (name === "type") {
        updatedData.category = "";
        updatedData.staff = "";
        updatedData.otherReason = "";
      }

      if (name === "category") {
        updatedData.staff = ""; // Clear staff if category changes
      }

      if (name === "paymentMethod") {
        updatedData.transactionId = "";
        updatedData.handledBy = "";
      }

      if (name === "propertyName") {
        const selectedProperty = admin.properties.find(
          (property) => property.name === value
        );
        updatedData.propertyId = selectedProperty?.id || "";
      }

      if ((name === "billImgCamera" || name === "billImgFile") && files && files[0]) {
        updatedData["billImg"] = files[0];
        setSelectedImage(URL.createObjectURL(files[0]));
      }

      return updatedData;
    });
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || file.size === 0) {
        return reject("Invalid file");
      }

      // ✅ Compress image before upload (Reduces file size)
      Resizer.imageFileResizer(
        file,
        800, // Max width
        800, // Max height
        "JPEG", // Format
        80, // Quality (0 to 100)
        0, // Rotation
        (compressedFile) => {
          // ✅ Upload compressed file
          const fileExtension = file.name.split('.').pop();
          const uniqueFileName = `expense-bill/${Date.now()}_${uuidv4()}.${fileExtension}`;
          const storageRef = ref(storage, uniqueFileName);
          const uploadTask = uploadBytesResumable(storageRef, compressedFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => reject(error),
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
            }
          );
        },
        "file" // Output format
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Ensure `billImg` is a string (URL) or undefined
      if (formData.billImg instanceof File) {
        const downloadURL = await uploadFile(formData.billImg);
        formData.billImg = downloadURL; // Convert file object to URL
      } else {
        formData.billImg = undefined; // Ensure it's not an empty object
      }

      // ✅ Send data to the backend
      const response = await axios.post(
        `${API_BASE_URL}/expense/addExpense`,
        formData,
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );

      toast.success('Expense Added Successfully!', { autoClose: 500 });
      setTimeout(() => {
        navigate("/expenses");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding expense:", error);
      const errorMessage = error.response?.data?.error || "Something went wrong!";
      toast.error(errorMessage, { autoClose: 5000 });
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <span
                    className="ml-3 text-side-bar cursor-pointer border rounded-md p-1 text-sm hover:text-[#373082] flex items-center"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaPlus />
                  </span>
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
              <>
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

                {/* Month & Year Selection in One Field */}
                <div>
                  <label htmlFor="salaryMonthYear" className="block text-sm font-medium text-gray-700">
                    Select Salary Month & Year
                  </label>
                  <input
                    type="month"
                    id="salaryMonth"
                    name="salaryMonth"
                    value={formData.salaryMonth || ""}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md"
                    required
                  />
                </div>

                {/* Leave Taken Input Field */}
                <div>
                  <label htmlFor="leaveTaken" className="block text-sm font-medium text-gray-700">
                    Leave Taken
                  </label>
                  <input
                    type="number"
                    id="leaveTaken"
                    name="leaveTaken"
                    value={formData.leaveTaken || ""}
                    onChange={handleChange}
                    onWheel={(e) => e.target.blur()}
                    className="mt-1 p-2 w-full border rounded-md"
                    placeholder="Enter number of leaves taken"
                  />
                </div>
              </>
            )}
            {renderInput("Other Reason", "otherReason", "text", formData.otherReason, handleChange)}
            {/* Step 1: Payment Method */}
            {renderSelect(
              "Payment Method",
              "paymentMethod",
              formData.paymentMethod,
              handleChange,
              ["UPI", "Bank Transfer", "Cash", "Petty Cash"],
              { required: true }
            )}

            {/* Step 2: Petty Cash Flow */}
            {formData.paymentMethod === "Petty Cash" && (
              <>
                {/* Handled By */}
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

                {/* Available Amount + Spent Via */}
                {formData.handledBy && (
                  <>
                    <div className="mt-2">
                      <label className="block text-gray-700 mb-2">Available Amount</label>
                      <input
                        type="text"
                        value={
                          pettyCash.find((cash) => cash.staff === formData.handledBy)?.amount || 0
                        }
                        disabled
                        className="w-full p-2 border rounded-md bg-gray-100"
                      />
                    </div>

                    {renderSelect(
                      "Spent via",
                      "pettyCashType",
                      formData.pettyCashType || "",
                      handleChange,
                      ["Cash", "UPI"],
                      { required: true }
                    )}

                    {/* Show Amount only after pettyCashType is selected */}
                    {formData.pettyCashType && renderInput(
                      "Amount",
                      "amount",
                      "number",
                      formData.amount,
                      handleChange,
                      { required: true }
                    )}

                    {/* Show Transaction ID only if pettyCashType is UPI */}
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

            {/* Step 3: Show Amount + Transaction ID for other methods */}
            {formData.paymentMethod !== "Cash" &&
              formData.paymentMethod !== "Petty Cash" && (
                <>
                  {renderInput("Amount", "amount", "number", formData.amount, handleChange, {
                    required: true,
                  })}

                  {renderInput(
                    "Transaction ID",
                    "transactionId",
                    "text",
                    formData.transactionId,
                    handleChange,
                    { required: true }
                  )}
                </>
              )}

            {/* Step 4: If Cash, show Amount only */}
            {formData.paymentMethod === "Cash" &&
              renderInput("Amount", "amount", "number", formData.amount, handleChange, {
                required: true,
              })}

            {/* Date + Property */}
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
              <label className="block text-gray-700 mb-2 font-semibold">Upload Bill</label>

              <div className="flex flex-col sm:flex-row gap-3">
                <label className="w-full sm:w-1/2 cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-200 transition">
                  📸 Take a Photo
                  <input
                    type="file"
                    name="billImgCamera"
                    accept="image/*"
                    capture="environment"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>

                <label className="w-full sm:w-1/2 cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-200 transition">
                  🖼️ Choose from Gallery
                  <input
                    type="file"
                    name="billImgFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Image Preview */}
              {selectedImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected Image Preview:</p>
                  <img
                    src={selectedImage}
                    alt="Selected Preview"
                    className="max-h-64 border rounded shadow-md"
                  />
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
              'Add Expense'
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default CheckAuth(ExpenseForm);