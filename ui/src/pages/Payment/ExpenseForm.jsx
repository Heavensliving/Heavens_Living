import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import CheckAuth from "../auth/CheckAuth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExpenseForm = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    category: "",
    otherReason: "",
    paymentMethod: "",
    transactionId: "",
    amount: "",
    date: "",
    propertyName: "",
    propertyId: "",
    staff: "",
  });

  const [properties, setProperties] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!admin) return;
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setProperties(response.data);
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

    fetchProperties();
    fetchStaffMembers();
  }, [admin]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // console.log(formData) // debug statement
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(
        `${API_BASE_URL}/expense/addExpense`,
        formData,
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );
      // console.log("Expense added:", response.data); // debug statement

      toast.success('Expense Added Successfully!', { autoClose: 500 });
      setTimeout(() => {
        navigate("/expenses");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error('Failed to add commission', { autoClose: 500 });
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
            {renderSelect(
              "Category",
              "category",
              formData.category,
              handleChange,
              ["Salary", "Grocery", "Vehicle", "Cafe", "Others"],
              { required: true }
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
          </div>

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

          {/* Property Name and Property ID */}
          <div className="grid grid-cols-2 gap-4">
            {renderSelect(
              "Property Name",
              "propertyName",
              formData.propertyName,
              (e) => {
                const selectedProperty = properties.find(
                  (property) => property.propertyName === e.target.value
                );
                setFormData((prevData) => ({
                  ...prevData,
                  propertyName: e.target.value,
                  propertyId: selectedProperty?.propertyId || "",
                }));
              },
              properties.map((property) => ({
                value: property.propertyName,
                label: property.propertyName,
              })),
              { required: true }
            )}
            {renderInput(
              "Property ID",
              "propertyId",
              "text",
              formData.propertyId,
              null,
              { readOnly: true, className: "bg-gray-100" }
            )}
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

export default CheckAuth(ExpenseForm);