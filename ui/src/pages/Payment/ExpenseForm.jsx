// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import API_BASE_URL from '../../config';

// const ExpenseForm = () => {
//   const admin = useSelector(store => store.auth.admin);
//   const [formData, setFormData] = useState({
//     title: '',
//     type: '',
//     category: '',
//     otherReason: '',
//     paymentMethod: '',
//     transactionId: '',
//     amount: '',
//     date: '',
//     propertyName: '',
//     propertyId: '',
//   });

//   const navigate = useNavigate(); // For navigation after form submission

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_BASE_URL}/expense/addExpense`, formData,
//         {headers: { 'Authorization': `Bearer ${admin.token}` }}
//       );
//       console.log('Expense added:', response.data);
//       // Redirect to the expenses list or another page
//       navigate('/expenses'); // Change to your desired route
//     } catch (error) {
//       console.error('Error adding expense:', error);
//       if (error.response && error.response.data) {
//         alert(`Failed to add expense: ${error.response.data.error}`);
//       } else {
//         alert('Failed to add expense. Please check the input data and try again.');
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {['title', 'type', 'category', 'paymentMethod', 'amount', 'date'].map((field, index) => (
//             <div key={index} className="mb-4">
//               <label className="block text-gray-700 mb-2 capitalize">{field}</label>
//               <input
//                 type={field === 'amount' ? 'number' : field === 'date' ? 'date' : 'text'}
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//           ))}

//           {/* Add two fields in one line */}
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/2">
//               <label className="block text-gray-700 mb-2">Other Reason</label>
//               <input
//                 type="text"
//                 name="otherReason"
//                 value={formData.otherReason}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="block text-gray-700 mb-2">Transaction ID</label>
//               <input
//                 type="text"
//                 name="transactionId"
//                 value={formData.transactionId}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md"
//               />
//             </div>
//           </div>

//           {/* Add another two fields in one line for Property Name and Property ID */}
//           <div className="flex space-x-4 mb-4">
//             <div className="w-1/2">
//               <label className="block text-gray-700 mb-2">Property Name</label>
//               <input
//                 type="text"
//                 name="propertyName"
//                 value={formData.propertyName}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="block text-gray-700 mb-2">Property ID</label>
//               <input
//                 type="text"
//                 name="propertyId"
//                 value={formData.propertyId}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
//           >
//             Add Expense
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ExpenseForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API_BASE_URL from '../../config';

const ExpenseForm = () => {
  const admin = useSelector((store) => store.auth.admin);

  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    otherReason: '',
    paymentMethod: '',
    transactionId: '',
    amount: '',
    date: '',
    propertyName: '',
    propertyId: '',
  });

  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch property names from the backend
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setProperties(response.data); // Assuming the API returns an array of properties
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
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
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/expense/addExpense`,
        formData,
        {
          headers: { Authorization: `Bearer ${admin.token}` },
        }
      );
      console.log('Expense added:', response.data);
      navigate('/expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
      if (error.response && error.response.data) {
        alert(`Failed to add expense: ${error.response.data.error}`);
      } else {
        alert('Failed to add expense. Please check the input data and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen  items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title and Type */}
          <div className="grid grid-cols-2  -mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Category and Payment Method */}
          <div className="grid grid-cols-2 gap-4 mb-4">
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
                  Select a category
                </option>
                <option value="Salary">Salary</option>
                <option value="Grocery">Grocery</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Cafe">Cafe</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Payment Method</label>
              <input
                type="text"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Amount and Date */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Other Reason and Transaction ID */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Other Reason</label>
              <input
                type="text"
                name="otherReason"
                value={formData.otherReason}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Property Name and Property ID */}
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
                  <option key={property.id} value={property.propertyName}>
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
