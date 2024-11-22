import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function EditProperty() {
  const admin = useSelector(store => store.auth.admin);
  const { propertyId } = useParams(); // Get propertyId from URL
  const navigate = useNavigate();
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
    propertyOwnerName: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property/${propertyId}`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setPropertyData(response.data);
      } catch (error) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

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
      const response = await axios.put(`${API_BASE_URL}/property/edit/${propertyId}`, propertyData,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      if (response.status === 200) {
  
        toast.success('Property Updated Successfully!', { autoClose: 500 });
        setTimeout(() => {
          navigate(`/property/${propertyId}`); 
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
       toast.error(error.response.data.message, { autoClose: 2000 });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.startingPrice}
                onChange={handleChange}
                required
              />
            </div>

            {/* Optional sharing fields */}
            <div>
              <label htmlFor="oneSharing" className="block text-sm font-medium text-gray-700">
                One Sharing Price
              </label>
              <input
                type="number"
                name="oneSharing"
                id="oneSharing"
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
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.twoSharing}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="threeSharing" className="block text-sm font-medium text-gray-700">
                Three Sharing Price
              </label>
              <input
                type="number"
                name="threeSharing"
                id="threeSharing"
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.threeSharing}
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
                className="p-3 border border-gray-300 rounded-lg w-full"
                value={propertyData.propertyType}
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
              'Update Property Property'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProperty;
