// controllers/staffController.js
const { default: mongoose } = require('mongoose');
const Property = require('../Models/Add_property');
const Staff = require('../Models/Add_staff');
const crypto = require('crypto');

// Function to generate a unique student ID
const generateStaffId = () => {
    const randomNumber = crypto.randomInt(1000, 100000); // Generate a random number between 1000 and 9999
    return `HVNSS${randomNumber}`;
};

// Create a new staff member
const createStaff = async (req, res) => {
    const propertyId = req.body.property
    try {
        const StaffId = generateStaffId();
        const property = await Property.findById(propertyId);
        const phaseName = property.phaseName;
        const branchName = property.branchName;
        if (!property) {
            return res.status(404).json({ message: 'property not found' });
        }
        const staff = new Staff({ ...req.body, StaffId, property: propertyId, phase: phaseName, branch: branchName });
        await staff.save();
        await Property.findByIdAndUpdate(propertyId, { $push: { staffs: staff._id } });
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
    const { property } = req.body;  // Get the new property ID from the request body
    console.log(req.body)
    try {
        // Find the current staff member
        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }

        // Check if the property has changed
        if (property && property !== staff.property.toString()) {
            // If property changed, first remove the staff from the old property
            await Property.findByIdAndUpdate(staff.property, {
                $pull: { staffs: staff._id },
            });

            // Find the new property details
            const newProperty = await Property.findById(property);

            if (!newProperty) {
                return res.status(404).json({ message: 'New property not found' });
            }

            // Add the staff to the new property
            await Property.findByIdAndUpdate(property, {
                $push: { staffs: staff._id },
            });

            // Update staff with new property, phase, and branch info
            staff.property = property;
            staff.phase = newProperty.phaseName;
            staff.branch = newProperty.branchName;
        }

        // Update the staff record with new data
        const updatedStaff = await Staff.findByIdAndUpdate(
            req.params.id,
            { ...req.body, phase: staff.phase, branch: staff.branch }, // Ensuring phase and branch are updated
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Staff member updated successfully', staff: updatedStaff });
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ error: error.message });
    }
};


// Delete a staff member by ID
const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id); // Use the MongoDB _id field
        const propertyId = req.query.propertyId;
        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({ message: 'Invalid property ID' });
        }
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found' });
        }
        // Find the property and update it by removing the student's ID from the array
        const property = await Property.findByIdAndUpdate(
            propertyId,
            { $pull: { staffs: req.params.id } }, // Remove the student ID from the students array
            { new: true } // Return the updated document
        );

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({ message: 'staff deleted successfully and removed from property' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const status = async (req, res) => {
    try {
        const { staffId } = req.params;

        const staff = await Staff.findById(staffId);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        const newStatus = staff.Status === 'On Duty' ? 'Off Duty' : 'On Duty';
        staff.Status = newStatus;
        staff.deleted = true;

        await staff.save();

        res.status(200).json({
            message: `Staff status updated to ${newStatus} successfully`,
            staff
        });
    } catch (error) {
        console.error('Error updating Staff status:', error); // Log the error
        res.status(500).json({ message: 'Error updating staff status', error });
    }
};

// Exporting the functions
const staffController = {
    createStaff,
    getStaffMembers,
    getStaffById,
    updateStaff,
    deleteStaff,
    status
};

module.exports = staffController;
