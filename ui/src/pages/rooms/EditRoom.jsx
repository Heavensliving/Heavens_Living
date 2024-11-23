import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FormField from './FormField'; // Import FormField component
import API_BASE_URL from '../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditRoom() {
    const navigate = useNavigate();
    const { id } = useParams(); // Getting room id from URL
    const admin = useSelector(store => store.auth.admin);
    const [loading, setLoading] = useState(false);
    const [roomDetails, setRoomDetails] = useState({
        propertyName: '',
        roomNumber: '',
        roomType: '',
        roomCapacity: '',
        occupant: '',
        vacantSlot: '',
        currentStatus: 'available',
        property: '', // This is the property ID
    });

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/room/get/${id}`, {
                    headers: { Authorization: `Bearer ${admin.token}` },
                });
                const room = response.data.room;
                // console.log(room); //debug statement
                setRoomDetails({
                    propertyName: room.propertyName, // Display the property name
                    roomNumber: room.roomNumber,
                    roomType: room.roomType,
                    roomCapacity: room.roomCapacity,
                    occupant: room.occupant,
                    vacantSlot: room.vacantSlot,
                    currentStatus: room.currentStatus,
                    property: room.property, // The property ID
                });
            } catch (error) {
                console.error('Error fetching room details:', error);
            }
        };
        fetchRoomDetails();
    }, [id, admin.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "roomType") {
            const sharingPrefix = " sharing";

            if (value === "") {
                setRoomDetails({
                    ...roomDetails,
                    roomType: "",
                    roomCapacity: "",
                });
                return;
            }

            let numericValue = value.replace(/[^0-9]/g, "");

            if (numericValue) {
                const formattedRoomType = `${numericValue}${sharingPrefix}`;
                setRoomDetails({
                    ...roomDetails,
                    roomType: formattedRoomType,
                    roomCapacity: numericValue,
                    vacantSlot: numericValue,
                });
            } else {
                setRoomDetails({
                    ...roomDetails,
                    roomType: "",
                    roomCapacity: "",
                });
            }
        } else {
            setRoomDetails({ ...roomDetails, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.put(`${API_BASE_URL}/room/editRoom/${id}`, roomDetails, {
                headers: { 'Authorization': `Bearer ${admin.token}` },
            });
            if (response.status === 200) {
                toast.success('Room updated successfully!', { autoClose: 500 });
                setTimeout(() => {
                    navigate('/rooms');
                setLoading(false)
                }, 1000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message, { autoClose: 2000 });
            } else {
                console.error('Unexpected Error:', error);
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-16"
            >
                <div className="flex flex-wrap -mx-2">
                    {/* Property field (read-only) */}
                    <FormField
                        label="Property"
                        id="property"
                        name="property"
                        type="text" // Display as text instead of select
                        value={roomDetails.propertyName} // Display the property name
                        required={true}
                        readOnly={true} // Make it read-only
                        onChange={handleChange}
                    />
                    <FormField
                        label="Room No"
                        id="roomNumber"
                        name="roomNumber"
                        type="text"
                        value={roomDetails.roomNumber}
                        onChange={handleChange}
                        required={true}
                    />
                    <FormField
                        label="Room Type"
                        id="roomType"
                        name="roomType"
                        type="text"
                        value={roomDetails.roomType}
                        onChange={handleChange}
                        required={true}
                    />
                    <FormField
                        label="Capacity"
                        id="capacity"
                        name="capacity"
                        type="text"
                        value={roomDetails.roomCapacity}
                        onChange={handleChange}
                        required={true}
                    />
                    <FormField
                        label="Occupant"
                        id="occupant"
                        name="occupant"
                        type="text"
                        value={roomDetails.occupant}
                        onChange={handleChange}
                    />
                    <FormField
                        label="Current Status"
                        id="currentStatus"
                        name="currentStatus"
                        type="select"
                        value={roomDetails.currentStatus}
                        onChange={handleChange}
                        options={[
                            { value: 'available', label: 'Available' },
                            { value: 'occupied', label: 'Occupied' },
                            { value: 'maintenance', label: 'Under Maintenance' },
                        ]}
                    />
                    <div className="w-full px-2 mb-4">
                    <button
            type="submit"
            className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
            ) : (
              'Update Room'
            )}
          </button>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
}

export default EditRoom;
