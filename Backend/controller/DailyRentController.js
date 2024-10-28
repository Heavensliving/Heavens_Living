const mongoose = require('mongoose');
const Property = require('../Models/Add_property');
const DailyRent = require('../Models/DailyRentModel'); // Adjust the path as necessary
const crypto = require('crypto');

// Helper function to generate OccupantId
const generateOccupantId = () => {
  const randomNumbers = crypto.randomInt(10000, 99999); // Generate a random 5-digit number
  return `HVNSDO${randomNumbers}`; // Prefix with 'HVNSDO'
};

// Add a new DailyRent entry
const addDailyRent = async (req, res) => {
  try {
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

    // Create a new DailyRent instance with request data and additional fields
    const newDailyRent = new DailyRent({
      ...req.body,
      OccupantId,
      pgName: property.propertyName,
      phase: phaseName,
      branch: branchName,
      property: propertyId,
    });

    // Save new DailyRent document to the database
    const savedDailyRent = await newDailyRent.save();

    // Update property document by adding the new DailyRent's ID
    await Property.findByIdAndUpdate(propertyId, { $push: { occupanets: savedDailyRent._id } });

    // Respond with the saved document
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
  try {
    const updatedDailyRent = await DailyRent.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Add { new: true } to return the updated document
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
    const dailyRent = await DailyRent.findById(id);
    const propertyId = dailyRent.property
    const deletedDailyRent = await DailyRent.findByIdAndDelete(id);
    if (!deletedDailyRent) {
      return res.status(404).json({ message: 'DailyRent entry not found' });
    }
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { occupanets: deletedDailyRent._id } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully and removed from property' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addDailyRent,
  getAllDailyRent,
  getDailyRentById,
  updateDailyRent,
  deleteDailyRent,
};
