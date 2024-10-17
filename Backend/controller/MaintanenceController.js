// const Maintanance = require('../Models/MaintanenceModel'); // Adjust the path as necessary

// // Add maintenance record
// const addMaintenance = async (req, res) => {
//   try {
//     const { Name, issue, AssignedTo, Timeneeded, Status,propertyId } = req.body;
//     const newMaintenance = new Maintanance({ Name, issue, AssignedTo, Timeneeded, Status, propertyId });
//     await newMaintenance.save();
//     res.status(201).json({ message: 'Maintenance record added successfully', newMaintenance });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding maintenance record', error: error.message });
//   }
// };

// // Get total maintenance records
// const getTotalMaintenance = async (req, res) => {
//   try {
//     const totalMaintenance = await Maintanance.countDocuments();
//     res.status(200).json({ totalMaintenance });
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving total maintenance', error: error.message });
//   }
// };

// // Get all maintenance records
// const getAllMaintenance = async (req, res) => {
//   try {
//     const maintenanceRecords = await Maintanance.find({});
//     res.status(200).json(maintenanceRecords);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving maintenance records', error: error.message });
//   }
// };

// // Get maintenance record by ID
// const getMaintenanceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const maintenanceRecord = await Maintanance.findById(id);

//     if (!maintenanceRecord) {
//       return res.status(404).json({ message: 'Maintenance record not found' });
//     }

//     res.status(200).json(maintenanceRecord);
//   } catch (error) {
//     res.status(500).json({ message: 'Error retrieving maintenance record', error: error.message });
//   }
// };

// // Delete maintenance record by ID
// const deleteMaintenanceById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedRecord = await Maintanance.findByIdAndDelete(id);

//     if (!deletedRecord) {
//       return res.status(404).json({ message: 'Maintenance record not found' });
//     }

//     res.status(200).json({ message: 'Maintenance record deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting maintenance record', error: error.message });
//   }
// };

// const updateMaintenanceStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { Status } = req.body; // Expecting { Status: "resolved" } or { Status: "pending" }
    
//     // Validate status
//     if (Status !== 'resolved' && Status !== 'pending') {
//       return res.status(400).json({ message: 'Status must be either "resolved" or "pending"' });
//     }

//     const updatedRecord = await Maintanance.findByIdAndUpdate(
//       id,
//       { Status },
//       { new: true, runValidators: true } // Return the updated document
//     );

//     if (!updatedRecord) {
//       return res.status(404).json({ message: 'Maintenance record not found' });
//     }

//     res.status(200).json({ message: 'Maintenance status updated successfully', updatedRecord });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating maintenance status', error: error.message });
//   }
// };


// module.exports = {
//   addMaintenance,
//   getTotalMaintenance,
//   getMaintenanceById,
//   deleteMaintenanceById,
//   updateMaintenanceStatus,
//   getAllMaintenance
// };



const Maintanance = require('../Models/MaintanenceModel'); // Adjust the path as necessary

// Add maintenance record
const addMaintenance = async (req, res) => {
  try {
    const { Name, issue, AssignedTo, Timeneeded, Status, propertyId } = req.body;
    const newMaintenance = new Maintanance({ Name, issue, AssignedTo, Timeneeded, Status, propertyId });
    await newMaintenance.save();
    res.status(201).json({ message: 'Maintenance record added successfully', newMaintenance });
  } catch (error) {
    res.status(500).json({ message: 'Error adding maintenance record', error: error.message });
  }
};

// Get total maintenance records
const getTotalMaintenance = async (req, res) => {
  try {
    const totalMaintenance = await Maintanance.countDocuments();
    res.status(200).json({ totalMaintenance });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving total maintenance', error: error.message });
  }
};

// Get all maintenance records
const getAllMaintenance = async (req, res) => {
  try {
    const maintenanceRecords = await Maintanance.find({});
    res.status(200).json(maintenanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving maintenance records', error: error.message });
  }
};

// Get maintenance record by ID
const getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenanceRecord = await Maintanance.findById(id);

    if (!maintenanceRecord) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json(maintenanceRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving maintenance record', error: error.message });
  }
};

// Delete maintenance record by ID
const deleteMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await Maintanance.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting maintenance record', error: error.message });
  }
};

// Update maintenance status
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { Status } = req.body;

    if (Status !== 'resolved' && Status !== 'pending') {
      return res.status(400).json({ message: 'Status must be either "resolved" or "pending"' });
    }

    const updatedRecord = await Maintanance.findByIdAndUpdate(
      id,
      { Status },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json({ message: 'Maintenance status updated successfully', updatedRecord });
  } catch (error) {
    res.status(500).json({ message: 'Error updating maintenance status', error: error.message });
  }
};

module.exports = {
  addMaintenance,
  getTotalMaintenance,
  getMaintenanceById,
  deleteMaintenanceById,
  updateMaintenanceStatus,
  getAllMaintenance
};
