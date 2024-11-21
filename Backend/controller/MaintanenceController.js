const Property = require('../Models/Add_property');
const Student = require('../Models/Add_student');
const Maintanance = require('../Models/MaintanenceModel'); // Adjust the path as necessary
const crypto = require('crypto');

const generateTicketId = () => {
  // Generate a random 5-digit number between 10000 and 99999
  const randomNum = crypto.randomInt(100, 100000); 
  return `HVNSM${randomNum}`;
};

// Add maintenance record with unique ticketId
const addMaintenance = async (req, res) => {
  try {
    const { Name, issue, description, propertyId, studentId ,roomNo} = req.body;

    // Validate the received data if needed
    if (!Name || !issue || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Generate a unique ticketId
    const ticketId = generateTicketId();

    const newMaintenance = new Maintanance({
      Name,
      issue,
      description,
      propertyId,
      studentId,
      ticketId,  // Assign the generated ticketId
      Status: 'pending', // Default status to 'pending'
      roomNo,
    });

    await newMaintenance.save();
    await Property.findByIdAndUpdate(propertyId, { $push: { maintenance: newMaintenance._id } });
    await Student.findByIdAndUpdate(studentId, { $push: { maintenance: newMaintenance._id } });
    res.status(200).json(newMaintenance);
    return newMaintenance;
  } catch (error) {
    console.error('Error adding maintenance issue:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Assign staff to maintenance record
const assignStaffToMaintenance = async (req, res) => {
  try {
    const { id } = req.params; // Maintenance record ID
    const { staffName, Timeneeded } = req.body; // Get both staffName and Timeneeded from the request body

    // Validate the received data
    if (!id || !Timeneeded) {
      return res.status(400).json({ message: 'Staff ID and time needed are required.' });
    }

    // Find the maintenance record by ID and update the AssignedTo and Timeneeded fields
    const updatedMaintenance = await Maintanance.findByIdAndUpdate(
      id,
      {
        AssignedTo: staffName,
        Timeneeded: Timeneeded,
        AssignedAt: new Date(), // Store the current timestamp when assigning staff
      },
      { new: true }
    );

    // Check if the maintenance record exists
    if (!updatedMaintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json({
      message: 'Staff assigned and time updated successfully!',
      updatedMaintenance,
    });
  } catch (error) {
    console.error('Error assigning staff:', error); // Log the error for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
// Update maintenance record status with optional remark
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params; // Maintenance record ID
    const { status, Remarks } = req.body; // New status and optional Remarks

    // Validate the received data
    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const updateData = { Status: status };

    // If a remark is provided, add it to the updateData
    if (Remarks) {
      updateData.Remarks = Remarks;
    }

    // If the status is "resolved," set the ResolutionDate to the current date
    if (status === 'resolved') {
      updateData.ResolutionDate = new Date();
    }

    // Find the maintenance record by ID and update the Status, Remarks, and ResolutionDate if applicable
    const updatedMaintenance = await Maintanance.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Check if the maintenance record exists
    if (!updatedMaintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json({
      message: 'Maintenance status updated successfully!',
      updatedMaintenance,
    });
  } catch (error) {
    console.error('Error updating maintenance status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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

// Get maintenance records by status
const getMaintenanceByStatus = async (req, res) => {
  try {
    const { status } = req.query; // Expecting status as a query parameter

    // Validate the status
    if (status !== 'pending' && status !== 'resolved' && status !== 'assigned') {
      return res.status(400).json({ message: 'Status must be "pending", "assigned", or "resolved"' });
    }

    const maintenanceRecords = await Maintanance.find({ Status: status });

    res.status(200).json(maintenanceRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving maintenance records', error: error.message });
  }
};

// Update AssignedTo field in maintenance record
const updateAssignedTo = async (req, res) => {
  try {
    const { id } = req.params; // Maintenance record ID
    const { AssignedTo } = req.body; // AssignedTo object containing staffId and staffName

    // Validate the received data
    if (!AssignedTo || !AssignedTo.staffId || !AssignedTo.staffName) {
      return res.status(400).json({ message: 'StaffId and StaffName are required.' });
    }

    // Find the maintenance record by ID and update the AssignedTo field
    const updatedMaintenance = await Maintanance.findByIdAndUpdate(
      id,
      { AssignedTo }, // Update with the provided staffId and staffName
      { new: true } // Return the updated document
    );

    // Check if the maintenance record exists
    if (!updatedMaintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.status(200).json({
      message: 'AssignedTo updated successfully!',
      updatedMaintenance,
    });
  } catch (error) {
    console.error('Error updating AssignedTo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const getLatestResolvedIssues = async (req, res) => {
  try {
    const resolvedRecords = await Maintanance.find({ Status: 'resolved' })
      .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
      .limit(5); // Limit to 5 records

    res.status(200).json(resolvedRecords);
  } catch (error) {
    console.error('Error retrieving latest resolved issues:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  addMaintenance,
  assignStaffToMaintenance,
  updateMaintenanceStatus, // Export the new function
  getTotalMaintenance,
  getMaintenanceById,
  deleteMaintenanceById,
  getAllMaintenance,
  getMaintenanceByStatus,
  updateAssignedTo,
  getLatestResolvedIssues,
};
