import { useState } from 'react';

function PropertyForm() {
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    location: '',
    address: '',
    description: '',
    contactNumber: '',
    totalBeds: '',
    preferredBy: '',
    googleMapUrl: '',
    startingPrice: '',
    oneSharing: '',
    twoSharing: '',
    fourSharing: '',
    sixSharing: '',
    amenities: [],
    occupancy: [],
    propertyType: '',
    branch: '',
    phase: '',
    propertyOwnerName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'amenities' || name === 'occupancy') {
      // Handle multiple selections (change this as per your needs)
      const options = e.target.selectedOptions;
      const selectedValues = Array.from(options).map(option => option.value);
      setPropertyData({
        ...propertyData,
        [name]: selectedValues,
      });
    } else {
      setPropertyData({
        ...propertyData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in propertyData) {
      formData.append(key, propertyData[key]);
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
        <h2 className="text-3xl font-bold text-center mb-6">Property Registration Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="propertyName"
              placeholder="Property Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.propertyName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.location}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.address}
              onChange={handleChange}
              required
            />
        
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.contactNumber}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="totalBeds"
              placeholder="Total Beds"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.totalBeds}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="preferredBy"
              placeholder="Preferred By"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.preferredBy}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="startingPrice"
              placeholder="Starting Price"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.startingPrice}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="oneSharing"
              placeholder="One Sharing Price"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.oneSharing}
              onChange={handleChange}
            />
            <input
              type="number"
              name="twoSharing"
              placeholder="Two Sharing Price"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.twoSharing}
              onChange={handleChange}
            />
            <input
              type="number"
              name="fourSharing"
              placeholder="Four Sharing Price"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.fourSharing}
              onChange={handleChange}
            />
            <input
              type="text"
              name="propertyType"
              placeholder="Property Type"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.propertyType}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.branch}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phase"
              placeholder="Phase"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.phase}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="propertyOwnerName"
              placeholder="Property Owner's Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={propertyData.propertyOwnerName}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Register Property
          </button>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;
