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
    // Generate OccupantId if not provided
    if (!req.body.OccupantId) {
      req.body.OccupantId = generateOccupantId();
    }

    const newDailyRent = new DailyRent(req.body);
    const savedDailyRent = await newDailyRent.save();
    res.status(201).json(savedDailyRent);
  } catch (err) {
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
  try {
    const updatedDailyRent = await DailyRent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDailyRent) {
      return res.status(404).json({ message: 'DailyRent entry not found' });
    }
    res.status(200).json(updatedDailyRent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a DailyRent entry by ID
const deleteDailyRent = async (req, res) => {
  try {
    const deletedDailyRent = await DailyRent.findByIdAndDelete(req.params.id);
    if (!deletedDailyRent) {
      return res.status(404).json({ message: 'DailyRent entry not found' });
    }
    res.status(200).json({ message: 'DailyRent entry deleted successfully' });
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
