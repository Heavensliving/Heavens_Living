const Phase = require('../Models/AddPhase'); 
const crypto = require('crypto');


const generatePhaseId = () => {
  const randomDigits = crypto.randomInt(10000, 99999).toString();
  return `HVNSPH${randomDigits}`;
};

// Add new Phase
const addPhase = async (req, res) => {
  try {
    const { Name, Location } = req.body;
    const newPhase = new Phase({
      Name,
      Location,
      PhaseId: generatePhaseId(), // Generate PhaseId
    });
    await newPhase.save();
    res.status(201).json(newPhase);
  } catch (error) {
    res.status(500).json({ message: 'Error adding phase', error });
  }
};

// Get all Phases
const getAllPhases = async (req, res) => {
  try {
    const phases = await Phase.find();
    res.status(200).json(phases);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving phases', error });
  }
};

// Get Phase by ID
const getPhaseById = async (req, res) => {
  try {
    const phase = await Phase.findById(req.params.id);
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
    res.status(200).json(phase);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving phase', error });
  }
};

// Update Phase
const updatePhase = async (req, res) => {
  try {
    const { Name, Location } = req.body;
    const updatedPhase = await Phase.findById(req.params.id);

    if (!updatedPhase) {
      return res.status(404).json({ message: 'Phase not found' });
    }

    updatedPhase.Name = Name || updatedPhase.Name;
    updatedPhase.Location = Location || updatedPhase.Location;
    // PhaseId should not change on update
    await updatedPhase.save();
    res.status(200).json(updatedPhase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating phase', error });
  }
};

// Delete Phase
const deletePhase = async (req, res) => {
  try {
    const phase = await Phase.findByIdAndDelete(req.params.id);
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
    res.status(200).json({ message: 'Phase deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting phase', error });
  }
};

module.exports = {
  addPhase,
  getAllPhases,
  getPhaseById,
  updatePhase,
  deletePhase,
};
