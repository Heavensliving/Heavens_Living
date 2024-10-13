import { useState } from 'react';

function AddPeopleForm() {
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    mealType: [],
    months: 0, // For the time period in months
    days: 0,   // For the time period in days
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // API Call for submission
    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Add People for Mess Management</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
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
              <label>
                <input
                  type="checkbox"
                  value="breakfast"
                  checked={formData.mealType.includes('breakfast')}
                  onChange={handleMealTypeChange}
                  className="mr-2"
                />
                Breakfast
              </label>
              <label>
                <input
                  type="checkbox"
                  value="lunch"
                  checked={formData.mealType.includes('lunch')}
                  onChange={handleMealTypeChange}
                  className="mr-2"
                />
                Lunch
              </label>
              <label>
                <input
                  type="checkbox"
                  value="dinner"
                  checked={formData.mealType.includes('dinner')}
                  onChange={handleMealTypeChange}
                  className="mr-2"
                />
                Dinner
              </label>
              <label>
                <input
                  type="checkbox"
                  value="whole meal"
                  checked={formData.mealType.includes('whole meal')}
                  onChange={handleMealTypeChange}
                  className="mr-2"
                />
                Whole Meal
              </label>
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
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
            required
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full"
            required
          />
          {errors.password && (
            <p className="text-red-500 mt-2">{errors.password}</p>
          )}

          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPeopleForm;
