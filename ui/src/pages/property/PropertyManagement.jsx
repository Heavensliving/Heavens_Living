import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaPlus, FaUsers, FaCheck, FaRegCircle, FaCodeBranch, FaLayerGroup, FaBuilding } from 'react-icons/fa';
import { MdMeetingRoom } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';

function PropertyManagement() {
  const admin = useSelector(store => store.auth.admin);
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
      const response = await axios.get(`${API_BASE_URL}/property`,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      setErrorMessage('Failed to fetch properties. Please try again later.');
      setLoading(false);
    }
  };
  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/branch`,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      setBranches(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch branches.');
    }
  };

  const fetchPhases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/phase`,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      setPhases(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch phases.');
    }
  };
  const filteredProperties = properties.filter(property =>
    property.propertyName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      {/* Total Properties Card Section */}
      <div className="flex space-x-4">
        <div className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
          <FaBuilding className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Total Properties</p>
            <p className="font-bold text-lg">{properties.length}</p>
          </div>
        </div>
        {/* Total branches Card */}
        <div onClick={() => navigate('/branch-management')} className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4 cursor-pointer">
          <FaCodeBranch className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Branches</p>
            <p className="font-bold text-lg">{branches.length}</p>
          </div>
        </div>
        {/* Total phases Card*/}
        <div className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4">
          <FaLayerGroup className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Phases</p>
            <p className="font-bold text-lg">{phases.length}</p>
          </div>
        </div>
        <div onClick={() => navigate('/rooms')} className="bg-white p-2 rounded-lg mb-4 flex items-center w-1/4 cursor-pointer">
          <MdMeetingRoom className="text-blue-600 text-2xl mr-2" />
          <div>
            <p className="text-gray-500 text-sm">Rooms</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between w-full mb-4 ">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-2/3 lg:w-3/4 xl:w-1/2 mr-4"
        />

        <div className="flex space-x-2">
        </div>
      </div>

      {/* Properties Section */}
      <div className="bg-white p-4 rounded-lg flex-grow overflow-y-auto">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProperties.map(property => (
              <div
                key={property._id}
                onClick={() => navigate(`/property/${property._id}`)}
                className="bg-white p-4 rounded-lg border border-gray-300 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              >
                {/* Row 1: Name and Location */}
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold truncate">{property.propertyName}</h3>
                    <p className="text-gray-600 text-sm truncate">{property.location}</p>
                  </div>
                  {/* Starting From Text */}
                  <div className="text-right min-w-0">
                    <p className="text-gray-500 text-xs">Starting From</p>
                    <p className="text-gray-500 font-bold text-sm">{property.startingPrice}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {/* Total Occupancy Box */}
                  <div className="border border-gray-300 p-2 rounded-md flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs truncate">Total Occupancy</p>
                      <p className="font-bold text-sm truncate">{property.totalBeds}</p>
                    </div>
                    <FaUsers className="text-green-600 text-2xl" />
                  </div>

                  {/* Total Occupied Box */}
                  <div className="border border-gray-300 p-2 rounded-md flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs truncate">Total Occupied</p>
                      <p className="font-bold text-sm truncate">
                        {property.occupanets.filter(occupant => !occupant.vacate).length + 
                         property.dailyRent.filter(occupant => !occupant.vacate).length}
                      </p>
                    </div>
                    <FaCheck className="text-orange-600 text-2xl" />
                  </div>

                  {/* Vacant Box */}
                  <div className="border border-gray-300 p-2 rounded-md flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-gray-500 text-xs truncate">Vacant</p>
                      <p className="font-bold text-sm truncate">
                        {property.totalBeds - (
                          property.occupanets.filter(occupant => !occupant.vacate).length +
                          property.dailyRent.filter(occupant => !occupant.vacate).length
                        )}
                      </p>
                    </div>
                    <FaRegCircle className="text-red-600 text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No properties found</p>
        )}
      </div>
    </div>
  );
}

export default PropertyManagement;
