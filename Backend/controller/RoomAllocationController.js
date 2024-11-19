const Rooms = require('../Models/RoomAllocationModel'); // Adjust the path as needed

const addRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, Occupant, vacantslot, status } = req.body;

    const newRoom = new Rooms({
      roomNumber,
      roomType,
      Occupant,
      vacantslot,
      status,
    });

    await newRoom.save();
    res.status(201).json({ success: true, message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedRoom = await Rooms.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.status(200).json({ success: true, message: 'Room updated successfully', room: updatedRoom });
  } catch (error) {
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

module.exports = {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
};
