const mongoose = require('mongoose');
const Property = require('../Models/Add_property');
const DailyRent = require('../Models/DailyRentModel'); // Adjust the path as necessary
const crypto = require('crypto');
const Rooms = require('../Models/RoomAllocationModel');

// Helper function to generate OccupantId
const generateOccupantId = () => {
  const randomNumbers = crypto.randomInt(10000, 99999); // Generate a random 5-digit number
  return `HVNDR${randomNumbers}`; // Prefix with 'HVNSDO'
};

// Add a new DailyRent entry
const addDailyRent = async (req, res) => {
  try {
    console.log(req.body)
    const propertyId = req.body.propertyId;
    // Validate propertyId
    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid property ID' });
    }

    // Find the property by ID
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Generate OccupantId
    const OccupantId = generateOccupantId();

    // Extract phase and branch names
    const phaseName = property.phaseName;
    const branchName = property.branchName;
    const room = await Rooms.findOne({ roomNumber: req.body.roomNo, property: propertyId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.vacantSlot <= 0) {
      return res.status(400).json({ message: 'No vacant slots available in the selected room' });
    }
    // Create a new DailyRent instance with request data and additional fields
    const newDailyRent = new DailyRent({
      ...req.body,
      OccupantId,
      pgName: property.propertyName,
      phase: phaseName,
      branch: branchName,
      property: propertyId,
      room: room._id,
    });
    const savedDailyRent = await newDailyRent.save();
    room.dailyRent.push(newDailyRent._id);
    room.occupant += 1;
    room.vacantSlot -= 1;
    await room.save();

    // Update property document by adding the new DailyRent's ID
    await Property.findByIdAndUpdate(propertyId, { $push: { dailyRent: savedDailyRent._id } });
    res.status(201).json(savedDailyRent);
  } catch (err) {
    console.error('Error saving DailyRent:', err); // Log the error
    res.status(400).json({ message: err.message });
  }
};



// Get all DailyRent entries
const getAllDailyRent = async (req, res) => {
  try {
    const dailyRents = await DailyRent.find();
    res.status(200).json(dailyRents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a DailyRent entry by ID
const getDailyRentById = async (req, res) => {
  try {
    const dailyRent = await DailyRent.findById(req.params.id);
    if (!dailyRent) {
      return res.status(404).json({ message: 'DailyRent entry not found' });
    }
    res.status(200).json(dailyRent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a DailyRent entry by ID
const updateDailyRent = async (req, res) => {
  console.log('Request body:', req.body); // Log the request body
  const id = req.params.id
  const updatedData = req.body;
  try {
    console.log("id",id)
    const dailyRentEntry = await DailyRent.findById(id);
    console.log(dailyRentEntry)
    if (!dailyRentEntry) {
      return res.status(404).json({ message: 'dailyrent not found' });
    }
    console.log("Room Number:", updatedData.roomNo);
    console.log("Property ID:", updatedData.property);

    if (updatedData.roomNo && updatedData.property) {
      const { roomNo, property } = updatedData;
      console.log("Room Number and Property:", roomNo, property);
      const newRoom = await Rooms.findOne({ roomNumber: roomNo, property });
      console.log("New Room:", newRoom);

      if (!newRoom) {
        return res.status(404).json({ message: 'Room not found for the given property and room number' });
      }

      if (dailyRentEntry.room && dailyRentEntry.room.toString() !== newRoom._id.toString()) {
        await Rooms.findByIdAndUpdate(dailyRentEntry.room, {
          $pull: { dailyRent: dailyRentEntry._id },
          $inc: { occupant: -1, vacantSlot: 1 },
        });

        await Rooms.findByIdAndUpdate(newRoom._id, {
          $push: { dailyRent: dailyRentEntry._id },
          $inc: { occupant: 1, vacantSlot: -1 },
        });
        updatedData.room = newRoom._id;
      }
    }

    const updatedDailyRent = await DailyRent.findByIdAndUpdate(id, updatedData, { new: true }); // Add { new: true } to return the updated document
    if (!updatedDailyRent) {
      return res.status(404).json({ message: 'DailyRent entry not found' });
    }

    res.status(200).json(updatedDailyRent);
  } catch (err) {
    console.error('Error updating DailyRent:', err.message); // Log the error for further insights
    res.status(400).json({ message: err.message });
  }
};

// Delete a DailyRent entry by ID
const deleteDailyRent = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.headers.role;
    const dailyRentProperty = await DailyRent.findById(id);
    const propertyId = dailyRentProperty.property

    if (role === 'propertyAdmin') {
      const dailyrent = await DailyRent.findByIdAndUpdate(
        id,
        { vacate: true },
        { new: true }
      );
      if (!dailyrent) {
        return res.status(404).json({ message: 'Daily rent not found' });
      }
    
      if (dailyrent.room) {
        const room = await Rooms.findById(dailyrent.room);
        if (room) {
          room.dailyRent = room.dailyRent.filter(dailyRentId => dailyRentId.toString() !== id);
    
          if (room.occupant > 0) {
            room.occupant -= 1;
          }
          if (room.vacantSlot < room.roomCapacity) {
            room.vacantSlot += 1;
          }
    
          await room.save();

          await Property.findByIdAndUpdate(
            propertyId,
            { $pull: { dailyRent: id } },
            { new: true }
          );
        }
      }
    
      return res.status(200).json({ message: 'Daily rent marked as vacated and room updated successfully', dailyrent });
    }    

    const dailyrent = await DailyRent.findById(id);
    if (!dailyrent) {
      return res.status(404).json({ message: 'Daily rent not found' });
    }

    if (dailyrent.room) {
      const room = await Rooms.findById(dailyrent.room); // Assuming Room is the room model

      if (room) {

        room.dailyRent = room.dailyRent.filter(dailyRentId => dailyRentId.toString() !== id);

        if (room.occupant > 0) {
          room.occupant -= 1;
        }
        if (room.vacantSlot < room.roomCapacity) {
          room.vacantSlot += 1;
        }

        await room.save();
      }
    }
    await DailyRent.findByIdAndDelete(id);
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { dailyRent: id } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({
      message: 'Daily rent deleted successfully and removed from property and room',
      updatedRoom: dailyrent.room ? await Rooms.findById(dailyrent.room) : null
    });
  } catch (error) {
    console.error('Error deleting daily rent:', error);
    res.status(500).json({ message: 'Error deleting daily rent', error });
  }
};

module.exports = {
  addDailyRent,
  getAllDailyRent,
  getDailyRentById,
  updateDailyRent,
  deleteDailyRent,
};
