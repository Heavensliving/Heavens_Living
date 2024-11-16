import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config";

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

  useEffect(() => {
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
  }, [admin.token]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/expense/addExpense`,
        formData,
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );
      console.log("Expense added:", response.data);
      navigate("/expenses");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert(
        error.response?.data?.error ||
          "Failed to add expense. Please check the input data and try again."
      );
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
            {renderInput("Type", "type", "text", formData.type, handleChange, { required: true })}
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
            {renderInput(
              "Payment Method",
              "paymentMethod",
              "text",
              formData.paymentMethod,
              handleChange,
              { required: true }
            )}
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

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Amount", "amount", "number", formData.amount, handleChange, {
              required: true,
            })}
            {renderInput("Date", "date", "date", formData.date, handleChange, { required: true })}
          </div>

          {/* Other Reason and Transaction ID */}
          <div className="grid grid-cols-2 gap-4">
            {renderInput("Other Reason", "otherReason", "text", formData.otherReason, handleChange)}
            {renderInput(
              "Transaction ID",
              "transactionId",
              "text",
              formData.transactionId,
              handleChange
            )}
          </div>

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
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
