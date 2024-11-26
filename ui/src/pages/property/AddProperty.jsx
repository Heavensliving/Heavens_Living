import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL =import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddProperty() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState({
    propertyName: '',
    location: '',
    address: '',
    contactNumber: '',
    totalBeds: '',
    preferredBy: '',
    startingPrice: '',
    oneSharing: '',
    twoSharing: '',
    fourSharing: '',
    sixSharing: '',
    propertyType: '',
    branch: '',
    phase: '',
    propertyOwnerName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({
      ...propertyData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)


    try {
      const response = await axios.post(`${API_BASE_URL}/property/add`, propertyData,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      if (response.status === 201) {


        toast.success('Property Added Successfully!', { autoClose: 500 });
        setTimeout(() => {
          navigate('/property');
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="propertyName" className="block text-sm font-medium text-gray-700">
                Property Name
              </label>
              <input
                type="text"
                name="propertyName"
                id="propertyName"
                placeholder="Property Name"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.propertyName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder="Location"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Contact Number
              </label>
              <input
                type="text"
                name="contactNumber"
                id="contactNumber"
                placeholder="Contact Number"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="totalBeds" className="block text-sm font-medium text-gray-700">
                Total Beds
              </label>
              <input
                type="number"
                name="totalBeds"
                id="totalBeds"
                placeholder="Total Beds"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.totalBeds}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="preferredBy" className="block text-sm font-medium text-gray-700">
                Preferred By
              </label>
              <input
                type="text"
                name="preferredBy"
                id="preferredBy"
                placeholder="Preferred By"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.preferredBy}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700">
                Starting Price
              </label>
              <input
                type="number"
                name="startingPrice"
                id="startingPrice"
                placeholder="Starting Price"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.startingPrice}
                onChange={handleChange}
                required
              />
            </div>

            {/* Optional Sharing Fields */}
            <div>
              <label htmlFor="oneSharing" className="block text-sm font-medium text-gray-700">
                One Sharing Price
              </label>
              <input
                type="number"
                name="oneSharing"
                id="oneSharing"
                placeholder="One Sharing Price"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.oneSharing}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="twoSharing" className="block text-sm font-medium text-gray-700">
                Two Sharing Price
              </label>
              <input
                type="number"
                name="twoSharing"
                id="twoSharing"
                placeholder="Two Sharing Price"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.twoSharing}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="fourSharing" className="block text-sm font-medium text-gray-700">
                Four Sharing Price
              </label>
              <input
                type="number"
                name="fourSharing"
                id="fourSharing"
                placeholder="Four Sharing Price"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.fourSharing}
                onChange={handleChange}
              />
            </div>

            {/* Required fields continue */}
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <input
                type="text"
                name="propertyType"
                id="propertyType"
                placeholder="Property Type"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.propertyType}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <input
                type="text"
                name="branch"
                id="branch"
                placeholder="Branch"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.branch}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="phase" className="block text-sm font-medium text-gray-700">
                Phase
              </label>
              <input
                type="text"
                name="phase"
                id="phase"
                placeholder="Phase"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.phase}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="propertyOwnerName" className="block text-sm font-medium text-gray-700">
                Property Owner's Name
              </label>
              <input
                type="text"
                name="propertyOwnerName"
                id="propertyOwnerName"
                placeholder="Property Owner's Name"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.propertyOwnerName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <ToastContainer />
          <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Register Property'
            )}
          </button>
        </form>
      </div>
    </div>

  );
}

export default AddProperty;
