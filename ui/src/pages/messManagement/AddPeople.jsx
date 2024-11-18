// import React, { useState } from 'react';
// import axios from 'axios'; 
// import { useNavigate } from 'react-router-dom';
// import API_BASE_URL from '../../config';
// import { useSelector } from 'react-redux';


// function AddPeople() {
//   const admin = useSelector(store => store.auth.admin);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     contactNumber: '',
//     email: '',
//     mealType: [],
//     monthlyAmount:'',
//     months: 0, 
//     days: 0, 
//     password: '',
//     confirmPassword: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [apiError, setApiError] = useState('');
//   const [properties, setProperties] = useState([]);

//   useEffect(() => {
//     // Fetch property names from the backend
//     const fetchProperties = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/property`, {
//           headers: { Authorization: `Bearer ${admin.token}` },
//         });
//         setProperties(response.data); // Assuming the API returns an array of properties
//       } catch (error) {
//         console.error('Error fetching properties:', error);
//       }
//     };

//     fetchProperties();
//   }, [admin.token]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleMealTypeChange = (e) => {
//     const { value, checked } = e.target;
//     let updatedMealType = formData.mealType;

//     if (checked) {
//       updatedMealType = [...updatedMealType, value];
//     } else {
//       updatedMealType = updatedMealType.filter((meal) => meal !== value);
//     }

//     setFormData({
//       ...formData,
//       mealType: updatedMealType,
//     });
//   };

//   const validateForm = () => {
//     let valid = true;
//     let errors = {};

//     const totalDays = parseInt(formData.months) * 30 + parseInt(formData.days);

//     // Validate password match
//     if (formData.password !== formData.confirmPassword) {
//       errors.password = "Passwords don't match!";
//       valid = false;
//     }

//     // Validate total time period
//     if (totalDays < 15) {
//       errors.timePeriod = "Time period must be at least 15 days.";
//       valid = false;
//     }

//     setErrors(errors);
//     return valid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     // API Call for submission using Axios
//     try {
//       const response = await axios.post(`${API_BASE_URL}/people/add`, {
//         ...formData,
//         mealType: formData.mealType.join(', '), // Convert array to string if needed
//         timePeriod: {
//           months: formData.months,
//           days: formData.days,
//         },
//         headers: { 'Authorization': `Bearer ${admin.token}` }
//       });

//       // Reset form after successful submission
//       setFormData({
//         name: '',
//         contactNumber: '',
//         email: '',
//         mealType: [],
//         monthlyAmount: '',
//         months: 0,
//         days: 0,
//         password: '',
//         confirmPassword: ''
//       });
//       navigate('/mess'); // Navigate after successful submission
//     } catch (error) {
//       console.error('Error:', error.response ? error.response.data : error.message);
//       setApiError('An error occurred while submitting the form. Please try again.'); // Set API error message
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Name */}
//           <div>
//             <label className="block mb-2 font-bold">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               required
//             />
//           </div>

//           {/* Contact Number */}
//           <div>
//             <label className="block mb-2 font-bold">Contact Number</label>
//             <input
//               type="tel"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block mb-2 font-bold">Email (optional)</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Property Name</label>
//               <select
//                 name="propertyName"
//                 value={formData.propertyName}
//                 onChange={(e) => {
//                   const selectedProperty = properties.find(
//                     (property) => property.propertyName === e.target.value
//                   );
//                   setFormData((prevData) => ({
//                     ...prevData,
//                     propertyName: e.target.value,
//                     propertyId: selectedProperty?.propertyId || '',
//                   }));
//                 }}
//                 className="w-full p-2 border rounded-md"
//                 required
//               >
//                 <option value="" disabled>
//                   Select Property
//                 </option>
//                 {properties.map((property) => (
//                   <option key={property._id} value={property.propertyName}>
//                     {property.propertyName}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Property ID</label>
//               <input
//                 type="text"
//                 name="propertyId"
//                 value={formData.propertyId}
//                 className="w-full p-2 border rounded-md bg-gray-100"
//                 readOnly
//               />
//             </div>
//           </div>

//           {/* Meal Type Selection */}
//           <div>
//             <label className="block mb-2 font-bold">Meal Type</label>
//             <div className="flex space-x-4">
//               {['Breakfast', 'Lunch', 'Dinner', 'Whole Meal'].map((meal) => (
//                 <label key={meal}>
//                   <input
//                     type="checkbox"
//                     value={meal}
//                     checked={formData.mealType.includes(meal)}
//                     onChange={handleMealTypeChange}
//                     className="mr-2"
//                   />
//                   {meal}
//                 </label>
//               ))}
//             </div>
//           </div>
//           <div>
//             <label className="block mb-2 font-bold">Monthly Amount</label>
//             <input
//               type="number"
//               name="monthlyAmount"
//               value={formData.monthlyAmount}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               required
//             />
//           </div>

//           {/* Time Period */}
//           <div>
//             <label className="block mb-2 font-bold">Time Period</label>
//             <div className="flex space-x-4">
//               <div>
//                 <label className="block mb-1">Months</label>
//                 <input
//                   type="number"
//                   name="months"
//                   value={formData.months}
//                   min="0"
//                   onChange={handleChange}
//                   className="p-3 border border-gray-300 rounded-lg w-full"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1">Days</label>
//                 <input
//                   type="number"
//                   name="days"
//                   value={formData.days}
//                   min="0"
//                   max="30"
//                   onChange={handleChange}
//                   className="p-3 border border-gray-300 rounded-lg w-full"
//                   required
//                 />
//               </div>
//             </div>
//             {errors.timePeriod && (
//               <p className="text-red-500 mt-2">{errors.timePeriod}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-2 font-bold">Create Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               required
//             />
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block mb-2 font-bold">Confirm Password</label>
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="p-3 border border-gray-300 rounded-lg w-full"
//               required
//             />
//             {errors.password && (
//               <p className="text-red-500 mt-2">{errors.password}</p>
//             )}
//           </div>

//           {/* API Error Message */}
//           {apiError && (
//             <p className="text-red-500 mt-2">{apiError}</p>
//           )}

//           <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg">
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddPeople;


import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

function AddPeople() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    mealType: [],
    monthlyAmount: '',
    months: 0, 
    days: 0, 
    password: '',
    confirmPassword: '',
    propertyName: '',
    propertyId: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, [admin.token]);

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

    if (formData.password !== formData.confirmPassword) {
      errors.password = "Passwords don't match!";
      valid = false;
    }

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

    try {
      console.log(formData);
      const response = await axios.post(`${API_BASE_URL}/people/add`, {
        ...formData,
        mealType: formData.mealType.join(', '), // Convert array to string if needed
        timePeriod: {
          months: formData.months,
          days: formData.days,
        },
      }, {
        headers: { 'Authorization': `Bearer ${admin.token}` }
      });

      setFormData({
        name: '',
        contactNumber: '',
        email: '',
        mealType: [],
        monthlyAmount: '',
        months: 0,
        days: 0,
        password: '',
        confirmPassword: '',
        propertyName: '',
        propertyId: '',
      });
      navigate('/mess');
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      setApiError('An error occurred while submitting the form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-bold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block mb-2 font-bold">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-bold">Email (optional)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
            />
          </div>

          {/* Property Selection */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Property Name</label>
              <select
                name="propertyName"
                value={formData.propertyName}
                onChange={(e) => {
                  const selectedProperty = properties.find(
                    (property) => property.propertyName === e.target.value
                  );
                  setFormData((prevData) => ({
                    ...prevData,
                    propertyName: e.target.value,
                    propertyId: selectedProperty?.propertyId || '',
                  }));
                }}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="" disabled>
                  Select Property
                </option>
                {properties.map((property) => (
                  <option key={property._id} value={property.propertyName}>
                    {property.propertyName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Property ID</label>
              <input
                type="text"
                name="propertyId"
                value={formData.propertyId}
                className="w-full p-2 border rounded-md bg-gray-100"
                readOnly
              />
            </div>
          </div>

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

          {/* Monthly Amount */}
          <div>
            <label className="block mb-2 font-bold">Monthly Amount</label>
            <input
              type="number"
              name="monthlyAmount"
              value={formData.monthlyAmount}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
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
          <div>
            <label className="block mb-2 font-bold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-bold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button type="submit" className="w-full py-3 px-4 bg-green-500 text-white rounded-lg">
              Submit
            </button>
            {apiError && <p className="text-red-500 text-center mt-2">{apiError}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPeople;
