import { useState } from 'react';

function StaffForm() {
  const [staffData, setStaffData] = useState({
    Name: '',
    EmployeeId: '',
    DOB: '',
    Contactnumber: '',
    Email: '',
    Photo: null,
    Adharfrontside: null,
    Adharbackside: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Photo' || name === 'Adharfrontside' || name === 'Adharbackside') {
      setStaffData({
        ...staffData,
        [name]: e.target.files[0], // Store the uploaded file
      });
    } else {
      setStaffData({
        ...staffData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in staffData) {
      formData.append(key, staffData[key]); // Append form data
    }

    // Here you can handle the API call to submit the form data
    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        body: formData,
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
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Add Staff Member</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="Name"
              placeholder="Staff Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={staffData.Name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="EmployeeId"
              placeholder="Employee ID"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={staffData.EmployeeId}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="DOB"
              placeholder="Date of Birth"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={staffData.DOB}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="Contactnumber"
              placeholder="Contact Number"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={staffData.Contactnumber}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="Email"
              placeholder="Email (optional)"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={staffData.Email}
              onChange={handleChange}
            />
            <input
              type="file"
              name="Photo"
              className="p-3 border border-gray-300 rounded-lg w-full"
              accept="image/*"
              onChange={handleChange}
            />
            <input
              type="file"
              name="Adharfrontside"
              className="p-3 border border-gray-300 rounded-lg w-full"
              accept="image/*"
              onChange={handleChange}
            />
            <input
              type="file"
              name="Adharbackside"
              className="p-3 border border-gray-300 rounded-lg w-full"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg">
            Add Staff
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffForm;
