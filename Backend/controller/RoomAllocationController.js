const Property = require("../Models/Add_property");
const Rooms = require("../Models/RoomAllocationModel");


const addRoom = async (req, res) => {
  try {
    const { propertyName, roomNo, roomType, capacity, vacantSlot, currentStatus, property } = req.body;
    const existingRoom = await Rooms.findOne({ property, roomNumber: roomNo });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: `Room number ${roomNo} already exists for the selected property.`,
      });
    }
    const newRoom = new Rooms({
      propertyName,
      roomNumber: roomNo,
      roomType,
      roomCapacity: capacity,
      vacantSlot,
      status: currentStatus,
      property,
    });
    await newRoom.save();
    await Property.findByIdAndUpdate(property, { $push: { rooms: newRoom._id } });
    res.status(201).json({
      success: true,
      message: "Room added successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Check if there is an occupant and calculate vacantSlot if necessary
    if (updatedData.occupant && updatedData.roomCapacity) {
      updatedData.vacantSlot = updatedData.roomCapacity - updatedData.occupant;
    }

    // Update the room in the database
    const updatedRoom = await Rooms.findByIdAndUpdate(id, updatedData, { new: true });

    // If the room wasn't found
    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Return success response with the updated room data
    res.status(200).json({ success: true, message: 'Room updated successfully', room: updatedRoom });
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ success: false, error: error.message });
  }
};


const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoom = await Rooms.findByIdAndDelete(id);
    if (!deletedRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find();
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findById(id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getRoomsByProperty = async (req, res) => {
  const { pgName } = req.params;
  // console.log(pgName)

  try {
    // Fetch the rooms that belong to the selected property
    const rooms = await Rooms.find({ propertyName: pgName, vacantSlot: { $gt: 0 } }); // Only rooms with vacant slots
    // console.log(rooms)

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'No available rooms found.' });
    }

    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOccupants = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findOne({ _id: id }).populate('occupanets', 'name contactNo roomNo room');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ occupants: room.occupanets || [] });
  } catch (error) {
    console.error('Error fetching occupants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  getRoomsByProperty,
  getOccupants,
};