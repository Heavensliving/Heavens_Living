
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaPlus, FaUsers, FaCheck, FaRegCircle, FaCodeBranch, FaLayerGroup, FaBuilding } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';

function PropertyManagement() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([]);
  const [branches, setBranches] = useState([]);
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProperties();
    fetchBranches();
    fetchPhases();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/property`);
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Failed to fetch properties. Please try again later.');
      setLoading(false);
    }
  };
  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branch`); // Adjust the endpoint if needed
      setBranches(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch branches.');
    }
  };

  const fetchPhases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/phase`); // Adjust the endpoint if needed
      setPhases(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch phases.');
    }
  };

  const filteredProperties = properties.filter(property =>
    property.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading properties...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      {/* Total Properties Card Section */}
      <div className="flex space-x-4">
        <div onClick={()=> navigate('/')} className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
          <FaBuilding className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Total Properties</p>
            <p className="font-bold text-lg">{properties.length}</p>
          </div>
        </div>
        {/* Total branches Card */}
        <div onClick={()=> navigate('/branch-management')} className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
          <FaCodeBranch className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Branches</p>
            <p className="font-bold text-lg">{branches.length}</p>
          </div>
        </div>
        {/* Total phases Card*/}
        <div onClick={()=> navigate('/')} className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
          <FaLayerGroup className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Phases</p>
            <p className="font-bold text-lg">{phases.length}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-2/3 lg:w-3/4 xl:w-1/2 mr-4"
        />

        <div className="flex space-x-2">
          {/* Filter Button */}
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <FaFilter className="mr-2" />
            Filter
          </button>

          {/* Add Property Button */}
          <button
            onClick={() => navigate('/add-property')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white p-4 rounded-lg flex-grow overflow-y-auto">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map(property => (
              <div key={property._id}
                onClick={() => navigate(`/property/${property._id}`)}
                className="bg-white p-4 rounded-lg border border-gray-300 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                {/* Row 1: Name and Location */}
                <div className="flex justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{property.propertyName}</h3>
                    <p className="text-gray-600">{property.location}</p>
                  </div>
                  {/* Starting From Text */}
                  <div className="text-right">
                    <p className="text-gray-500">Starting From</p>
                    <p className="text-gray-500 font-bold">{property.startingPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {/* Total Occupancy Box */}
                  <div className="border border-gray-300 p-2 rounded-md flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">Total Occupancy</p>
                      <p className="font-bold">{property.totalBeds}</p>
                    </div>
                    <FaUsers className="text-green-600 text-xl" />
                  </div>

                  {/* Total Occupied Box */}
                  <div className="border border-gray-300 p-2 rounded-md flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">Total Occupied</p>
                      <p className="font-bold">{property.occupied}</p>
                    </div>
                    <FaCheck className="text-orange-600 text-xl" />
                  </div>

                  {/* Vacant Box */}
                  <div className="border border-gray-300 p-2 rounded-md flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-xs">Vacant</p>
                      <p className="font-bold">{property.vacant}</p>
                    </div>
                    <FaRegCircle className="text-red-600 text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No properties found</p> // No properties found message
        )}
      </div>
    </div>
  );
}

export default PropertyManagement;
