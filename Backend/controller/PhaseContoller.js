const Branch = require('../Models/AddBranch');
const Phase = require('../Models/AddPhase'); 
const crypto = require('crypto');

const addPhase = async (req, res) => {
  const { Name, Location, Branch: branchId } = req.body;

  try {
    
    const randomNumber = crypto.randomInt(10000, 99999); 
    const PhaseId = `HVNSPH${randomNumber}`;

    // Fetch the branch by branchId to get the branch name
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const newPhase = new Phase({
      Name,
      Location,
      PhaseId,
      BranchName: branch.Name,
      Branch:branchId,
    });
    await newPhase.save();
    await Branch.findByIdAndUpdate(branchId, { $push: { Phases: newPhase._id } });
    res.status(201).json({ message: 'Phase created successfully', Phase: newPhase });
  } catch (error) {
    res.status(500).json({ message: 'Error adding branch', error });
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
    const branchId = req.query.branchId;
    const phase = await Phase.findByIdAndDelete(req.params.id);
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
     // Find the branch and update it by removing the phase ID from the array
     const branch = await Branch.findByIdAndUpdate(
      branchId,
      { $pull: { Phases: phase._id } }, 
      { new: true } // Return the updated document
    );

    if (!branch) {
      return res.status(404).json({ message: 'branch not found' });
    }

    res.status(200).json({ message: 'phase deleted successfully and removed from branch' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting phase', error });
  }
};

// phases for a specific branch
const getPhasesForBranch = async (req, res) => {
  const branchId = req.params.id;
  try {
    const branch = await Branch.findById(branchId).populate('Phases'); // Assuming `phases` is a reference
    res.json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching phases' });
  }
};

module.exports = {
  addPhase,
  getAllPhases,
  getPhaseById,
  updatePhase,
  deletePhase,
  getPhasesForBranch
};
