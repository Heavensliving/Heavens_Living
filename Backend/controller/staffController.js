// controllers/staffController.js
const Staff = require('../Models/Add_staff');
const crypto = require('crypto');

// Function to generate a unique student ID
const generateStaffId = () => {
    const randomNumber = crypto.randomInt(1000, 100000); // Generate a random number between 1000 and 9999
    return `HVNS${randomNumber}`;
  };

// Create a new staff member
const createStaff = async (req, res) => {
    try {

         // Generate a unique staff ID
    const StaffId = generateStaffId();
        // Create a new staff member with the generated EmployeeId
        const staff = new Staff({ ...req.body, StaffId });
        await staff.save();
        res.status(201).json({ message: 'Staff member created successfully', staff });
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all staff members
const getStaffMembers = async (req, res) => {
    try {
        const staffMembers = await Staff.find();
        res.status(200).json(staffMembers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a staff member by ID
const getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id); // Use the MongoDB _id field
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json(staff);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a staff member by ID
const updateStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member updated successfully', staff });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a staff member by ID
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id); // Use the MongoDB _id field
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exporting the functions
const staffController = {
    createStaff,
    getStaffMembers,
    getStaffById,
    updateStaff,
    deleteStaff,
};

module.exports = staffController;
