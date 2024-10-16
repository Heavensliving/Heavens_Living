import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useParams, useNavigate } from 'react-router-dom';

function EditPeople() {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    mealType: [],
    months: 0,
    days: 0,
    password: '',
    confirmPassword: '',
    propertyId: '',
    joinDate: '' // Add joinDate to state to hold the original value
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMealTypeChange = (e) => {
    const { value, checked } = e.target;
    let updatedMealType = formData.mealType;

    if (checked) {
      updatedMealType = [...updatedMealType, value];
    } else {
      updatedMealType = updatedMealType.filter((meal) => meal !== value);
    }

    setFormData({
      ...formData,
      mealType: updatedMealType,
    });
  };

  const validateForm = () => {
    let valid = true;
    let errors = {};

    const totalDays = parseInt(formData.months) * 30 + parseInt(formData.days);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      errors.password = "Passwords don't match!";
      valid = false;
    }

    // Validate total time period
    if (totalDays < 15) {
      errors.timePeriod = "Time period must be at least 15 days.";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const fetchPersonData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/people/get-people/${id}`);
      const personData = response.data.data; // Access the nested data object

      console.log('Fetched personData:', personData); // Verify personData

      if (personData) {
        const updatedFormData = {
          name: personData.name || '',
          contactNumber: personData.contactNumber || '',
          email: personData.email || '',
          mealType: personData.mealType.split(', '), // Assuming mealType is a string
          months: personData.timePeriod?.months || 0,
          days: personData.timePeriod?.days || 0,
          password: '', // Leave this blank as per your requirement
          confirmPassword: '',
          propertyId: personData.propertyId || '',
          joinDate: personData.joinDate // Save joinDate to the form data
        };

        console.log('Updated form data before setting:', updatedFormData); // Log before setting

        setFormData(updatedFormData); // Set the form data
      }
    } catch (error) {
      console.error('Error fetching person data:', error);
      setApiError('Failed to fetch person data. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // API Call for submission using Axios
    try {
      const response = await axios.put(`http://localhost:3000/api/people/edit-person/${id}`, {
        ...formData,
        mealType: formData.mealType.join(', '), // Convert array to string if needed
        timePeriod: {
          months: formData.months,
          days: formData.days,
        },
        joinDate: formData.joinDate // Include joinDate in the request payload
      });

      console.log('Success:', response.data);
      // Reset form after successful submission
      setFormData({
        name: '',
        contactNumber: '',
        email: '',
        mealType: [],
        months: 0,
        days: 0,
        password: '',
        confirmPassword: '',
        propertyId: '',
        joinDate: '' // Reset joinDate as well
      });
      navigate('/mess'); // Navigate after successful submission
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setApiError('An error occurred while submitting the form. Please try again.'); // Set API error message
    }
  };

  useEffect(() => {
    fetchPersonData(); // Fetch person data when component mounts
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <label className="block mb-2 font-bold">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
            required
          />

          {/* Contact Number */}
          <label className="block mb-2 font-bold">Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
            required
          />

          {/* Email */}
          <label className="block mb-2 font-bold">Email (optional)</label>
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
          />

          {/* Meal Type Selection */}
          <div>
            <label className="block mb-2 font-bold">Meal Type</label>
            <div className="flex space-x-4">
              {['Breakfast', 'Lunch', 'Dinner', 'Whole Meal'].map((meal) => (
                <label key={meal}>
                  <input
                    type="checkbox"
                    value={meal}
                    checked={formData.mealType.includes(meal)}
                    onChange={handleMealTypeChange}
                    className="mr-2"
                  />
                  {meal}
                </label>
              ))}
            </div>
          </div>

          {/* Time Period */}
          <div>
            <label className="block mb-2 font-bold">Time Period</label>
            <div className="flex space-x-4">
              <div>
                <label className="block mb-1">Months</label>
                <input
                  type="number"
                  name="months"
                  value={formData.months}
                  min="0"
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Days</label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  min="0"
                  max="30"
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-lg w-full"
                  required
                />
              </div>
            </div>
            {errors.timePeriod && (
              <p className="text-red-500 mt-2">{errors.timePeriod}</p>
            )}
          </div>

          {/* Password */}
          <label className="block mb-2 font-bold">Create Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
          />

          {/* Confirm Password */}
          <label className="block mb-2 font-bold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
          />
          {errors.password && (
            <p className="text-red-500 mt-2">{errors.password}</p>
          )}

          {/* API Error Message */}
          {apiError && (
            <p className="text-red-500 mt-2">{apiError}</p>
          )}

          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPeople;