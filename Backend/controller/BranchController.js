const crypto = require('crypto');
const Branch = require('../Models/AddBranch');


const addBranch = async (req, res) => {
  const { Name, Location } = req.body;

  try {
    
    const randomNumber = crypto.randomInt(10000, 99999); 
    const BranchId = `HVNSB${randomNumber}`;

    const newBranch = new Branch({
      Name,
      Location,
      BranchId,
    });

    await newBranch.save();
    res.status(201).json({ message: 'Branch created successfully', newBranch });
  } catch (error) {
    res.status(500).json({ message: 'Error adding branch', error });
  }
};

const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { Name, Location } = req.body;  

  try {
  
    const existingBranch = await Branch.findById(id);
    
    if (!existingBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { Name, Location }, 
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Branch updated successfully', branch: updatedBranch });
  } catch (error) {
    res.status(500).json({ message: 'Error updating branch', error });
  }
};


const deleteBranch = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBranch = await Branch.findByIdAndDelete(id);

    if (!deletedBranch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json({ message: 'Branch deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting branch', error });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find();
    res.status(200).json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branches', error });
  }
};


const getBranchById = async (req, res) => {
  const { id } = req.params;

  try {
    const branch = await Branch.findById(id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching branch', error });
  }
};



module.exports = {
  addBranch,
  updateBranch,
  deleteBranch,
  getAllBranches,
  getBranchById,
};
