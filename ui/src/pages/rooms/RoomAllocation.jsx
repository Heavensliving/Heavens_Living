import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

function RoomAllocation() {
  const navigate = useNavigate();
  const admin = useSelector(store => store.auth.admin);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
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

        // Convert the object into an array format
        const formattedProperties = Object.keys(roomsByProperty).map((propertyName) => ({
          propertyName,
          rooms: roomsByProperty[propertyName],
        }));

        setProperties(formattedProperties);

      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleCardClick = (roomNumber) => {
    // Navigate to a room detail page or perform any other action
    navigate(`/room/${roomNumber}`);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Room Allocation Overview</h2>
        <button onClick={() => navigate('/add-room')} className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition">
          Add Rooms
        </button>
      </div>

      {/* Display Properties and Rooms */}
      {properties.map((property, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{property.propertyName}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {property.rooms.map((room) => {
              const vacant = room.roomCapacity - room.occupant;
              return (
                <div
                  key={room.roomNumber}
                  className="bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => handleCardClick(room.roomNumber)} 
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">{room.roomNumber}</h3>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          vacant > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {vacant > 0 ? 'Vacant' : 'Occupied'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">Room Type: {room.roomType}</p>
                    <p className="text-gray-600 mb-2">Occupant: {room.occupant}</p>
                    <p className="text-gray-600 mb-2">Vacant: {room.vacantSlot}</p>
                    <p className="text-gray-600 flex items-center">
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
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomAllocation;
