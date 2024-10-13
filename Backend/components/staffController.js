// controllers/staffController.js
const Staff = require('../Models/Add_staff');
const Counter = require('../Models/counter.model'); // Import the Counter model

// Create a new staff member
const createStaff = async (req, res) => {
    try {
        // Get the next employee ID
        const counter = await Counter.findOneAndUpdate(
            { model: 'Staff' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Generate EmployeeId in the format "HVNSE####"
        const employeeId = `HVNSE${String(counter.seq + 1).padStart(4, '0')}`;

        // Create a new staff member with the generated EmployeeId
        const staff = new Staff({ ...req.body, EmployeeId: employeeId });
        await staff.save();
        res.status(201).json({ message: 'Staff member created successfully', staff });
    } catch (error) {
        res.status(400).json({ error: error.message });
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
