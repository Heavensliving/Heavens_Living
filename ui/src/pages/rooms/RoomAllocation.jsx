import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

function RoomAllocation() {
  const navigate = useNavigate();
  const admin = useSelector(store => store.auth.admin);
  const [properties, setProperties] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null); // To store the selected room data
  const [occupants, setOccupants] = useState([]); // To store occupant details
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility
  const [loading, setLoading] = useState(true);
  const [propertyFilter, setPropertyFilter] = useState(''); // To filter by propertyName
  const [occupancyFilter, setOccupancyFilter] = useState(''); // To filter by occupancy status
  const [sharingFilter, setsharingFilter] = useState(''); // To filter by occupancy status
  const [searchQuery, setSearchQuery] = useState(''); // To search by room number

  useEffect(() => {
    if (!admin) return;
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/room`, {
          headers: {
            Authorization: `Bearer ${admin.token}`,
          },
        });

        // Group rooms by property
        const roomsByProperty = response.data.rooms.reduce((acc, room) => {
          if (!acc[room.propertyName]) {
            acc[room.propertyName] = [];
          }
          acc[room.propertyName].push(room);
          return acc;
        }, {});

        // Sort rooms within each property
        const formattedProperties = Object.keys(roomsByProperty).map((propertyName) => ({
          propertyName,
          totalRooms: roomsByProperty[propertyName].length,
          rooms: roomsByProperty[propertyName].sort((a, b) => {
            const [numA, suffixA] = a.roomNumber.split(' ');
            const [numB, suffixB] = b.roomNumber.split(' ');

            // Compare numeric parts as numbers (descending)
            const numComparison = parseInt(numB) - parseInt(numA);
            if (numComparison !== 0) return numComparison;

            // Compare suffix parts lexicographically (ascending)
            return suffixA.localeCompare(suffixB);
          }),
        }));

        setProperties(formattedProperties);
        setLoading(false)
        // console.log(formattedProperties);

      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const filteredProperties = properties
    .filter(property =>
      !propertyFilter || property.propertyName === propertyFilter
    )
    .map(property => ({
      ...property,
      rooms: property.rooms.filter(room => {
        const isMatchingOccupancy =
          !occupancyFilter ||
          (occupancyFilter === 'Occupied' && room.vacantSlot === 0) ||
          (occupancyFilter === 'Vacant' && room.vacantSlot > 0) ||
          (occupancyFilter === 'unavailable' && room.status === 'unavailable') ||
          (occupancyFilter === 'underMaintenance' && room.status === 'underMaintenance');
        const isMatchingSearch =
          !searchQuery ||
          room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const isMatchingSharing =
          !sharingFilter || room.roomType === sharingFilter;
        return isMatchingOccupancy && isMatchingSearch && isMatchingSharing;
      })
    }))
    .filter(property => property.rooms.length > 0);

  const handleCardClick = async (roomId, roomNumber) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/room/occupants/${roomId}`, {
        headers: {
          Authorization: `Bearer ${admin.token}`,
        },
      });
      const combinedData = {
        dailyRent: response.data.dailyRent,
        occupants: response.data.occupants,
      };
      // console.log(combinedData)
      setOccupants(combinedData);
      setRoomId(roomId)
      setSelectedRoom(roomNumber);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching occupants:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setOccupants([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Room Allocation Overview</h2>
        <button onClick={() => navigate('/add-room')} className="bg-side-bar text-white px-6 py-3 rounded-lg hover:bg-[#373082] transition">
          Add Rooms
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        {/* Property Filter */}
        <select
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">All Properties</option>
          {properties.map((property, index) => (
            <option key={index} value={property.propertyName}>
              {property.propertyName}
            </option>
          ))}
        </select>

        {/* Occupancy Filter */}
        <select
          value={occupancyFilter}
          onChange={(e) => setOccupancyFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">All Rooms</option>
          <option value="Occupied">Occupied</option>
          <option value="Vacant">Vacant</option>
          <option value="unavailable">Unavailable</option>
          <option value="underMaintenance">Under Maintenance</option>
        </select>

        {/* Occupancy Filter */}
        <select
          value={sharingFilter}
          onChange={(e) => setsharingFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="">All Sharing</option>
          <option value="1 sharing">1 sharing</option>
          <option value="2 sharing">2 sharing</option>
          <option value="3 sharing">3 sharing</option>
          <option value="4 sharing">4 sharing</option>
          <option value="5 sharing">5 sharing</option>

        </select>

        {/* Search by Room Number */}
        <input
          type="text"
          placeholder="Search by Room Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Display Properties and Rooms */}
      {filteredProperties.map((property, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex justify-between items-center">
            <span>{property.propertyName}</span>
            <span className="text-xl font-medium text-gray-600">Total Rooms: {property.rooms.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {property.rooms.map((room) => {
              const vacant = room.roomCapacity - room.occupant;
              return (
                <div
                  key={room.roomNumber}
                  className="relative bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => handleCardClick(room._id, room.roomNumber)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{room.roomNumber}</h3>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${vacant > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {vacant > 0 ? 'Vacant' : 'Occupied'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Room Type: {room.roomType}</p>
                    <p className="text-gray-600 mb-2">Occupant: {room.occupant}</p>
                    <p className="text-gray-600 mb-2">Vacant: {room.vacantSlot}</p>
                    <p className="text-gray-600 flex items-center mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14M12 5l7 7-7 7"
                        />
                      </svg>
                      {room.occupant}/{room.roomCapacity} occupied
                    </p>
                  </div>

                  {/* Status Badge */}
                  {room.status === 'underMaintenance' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-yellow-100 text-yellow-600 text-center py-2 text-sm font-bold">
                      Under Maintenance
                    </div>
                  )}
                  {room.status === 'unavailable' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-600 text-center py-2 text-sm font-bold">
                      Unavailable
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed ml-60 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w">
            <h2 className="text-2xl font-bold mb-4">Occupants in Room {selectedRoom}</h2>

            {/* Daily Rent Section */}
            {occupants.dailyRent && occupants.dailyRent.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Daily Rent Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 p-2 bg-gray-100 rounded-lg">
                  {occupants.dailyRent.map((rent, index) => (
                    <div key={index} className="p-4">
                      <p className="text-lg font-medium">{rent.name}</p>
                      <p className="text-gray-600">{rent.contactNo}</p>
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${rent.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {rent.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mb-4">No daily rent details found.</p>
            )}

            {/* Occupants Section */}
            {occupants.occupants && occupants.occupants.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">Occupants Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 p-2 bg-gray-100 rounded-lg">
                  {occupants.occupants.map((occupant, index) => (
                    <div key={index} className="p-4">
                      <p className="text-lg font-medium">{occupant.name}</p>
                      <p className="text-gray-600">{occupant.contactNo}</p>
                      <span
                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${occupant.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {occupant.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No occupants found.</p>
            )}

            {/* Modal Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Close
              </button>
              <button
                onClick={() => navigate(`/edit-room/${roomId}`)}
                className="bg-side-bar hover:bg-[#373082] text-white px-4 py-2 rounded-lg transition"
              >
                Edit Room
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CheckAuth(RoomAllocation);
