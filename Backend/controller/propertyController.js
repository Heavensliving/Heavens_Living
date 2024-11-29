// controllers/propertyController.js
const Property = require('../Models/Add_property');
const crypto = require('crypto');
const Phase = require('../Models/AddPhase');
const Rooms = require('../Models/RoomAllocationModel');
const Student = require('../Models/Add_student');
const Staff = require('../Models/Add_staff');
const peopleModel = require('../Models/AddPeople');
const Commission = require('../Models/commisionModel');
const DailyRent = require('../Models/DailyRentModel');
const Expense = require('../Models/expensePay');



const generatePropertyId = () => {
    const randomNumber = crypto.randomInt(1000, 100000); // Generate a random number between 1000 and 9999
    return `HVNS${randomNumber}`;
  };


// Create a new property
const createProperty = async (req, res) => {
    const phaseId = req.body.phaseId
    try {
         // Fetch the phase by phaseId to get the phase and branch name
    const phase = await Phase.findById(phaseId);
    const phaseName = phase.Name;
    const branchName = phase.BranchName;
    if (!phase) {
      return res.status(404).json({ message: 'Phase not found' });
    }
         const propertyId =generatePropertyId();
        const property = new Property({ ...req.body, propertyId, phaseName, branchName, phase: phaseId  });
        await property.save();
        await Phase.findByIdAndUpdate(phaseId, { $push: { Properties: property._id } });
        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a property by ID (using MongoDB _id)
const getPropertyById = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id); // Use the _id field
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a property by ID (using MongoDB _id)
const updateProperty = async (req, res) => {
    const session = await Property.startSession(); // Start a transaction
    session.startTransaction();

    try {
        const { id } = req.params;
        const updatedData = req.body;
        console.log(updatedData)

        // Find the original property
        const property = await Property.findById(id).session(session);

        if (!property) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Property not found' });
        }

        // Check if the property name is being updated
        const isNameUpdated = updatedData.propertyName && updatedData.propertyName !== property.propertyName;
        console.log(isNameUpdated)

        // Update the property document
        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true, session }
        );

        if (isNameUpdated) {
            // Update related Student documents
            await Student.updateMany(
                { pgName: property.propertyName }, // Match existing property name
                { pgName: updatedData.propertyName }, // Update to new property name
                { session }
            );

            // Update related Room documents
            await Rooms.updateMany(
                { propertyName: property.propertyName }, // Match existing property name
                { propertyName: updatedData.propertyName }, // Update to new property name
                { session }
            );

            await Staff.updateMany(
                { propertyName: property.propertyName }, // Match existing property name
                { propertyName: updatedData.propertyName }, // Update to new property name
                { session }
            );
        
            await peopleModel.updateMany(
                { propertyName: property.propertyName }, // Match existing property name
                { propertyName: updatedData.propertyName }, // Update to new property name
                { session }
            );

            await Commission.updateMany(
                { propertyName: property.propertyName }, // Match existing property name
                { propertyName: updatedData.propertyName }, // Update to new property name
                { session }
            );

            await DailyRent.updateMany(
                { pgName: property.propertyName }, // Match existing property name
                { pgName: updatedData.propertyName }, // Update to new property name
                { session }
            );

            await Expense.updateMany(
                { propertyName: property.propertyName }, // Match existing property name
                { propertyName: updatedData.propertyName }, // Update to new property name
                { session }
            );
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Property updated successfully',
            property: updatedProperty,
        });
    } catch (error) {
        // Rollback transaction in case of an error
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ error: error.message });
    }
};


// Delete a property by ID (using MongoDB _id)
const deleteProperty = async (req, res) => {
    try {
        // Find the property to be deleted by its ID
        const property = await Property.findById(req.params.id);
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Remove the property reference from the Phase it belongs to
        const phaseId = property.phase; // Assuming there's a Phase reference in the Property schema
        if (phaseId) {
            await Phase.findByIdAndUpdate(phaseId, { $pull: { Properties: property._id } });
        }

        // Now, delete the property itself
        await Property.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// property for a specific phase
const getPropertyForPhase = async (req, res) => {
    const phaseId = req.params.id;
    try {
      const phase = await Phase.findById(phaseId).populate('Properties'); // Assuming `property` is a reference
      res.json(phase);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching properties' });
    }
  };

// Exporting the functions
const propertyController = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getPropertyForPhase,
};

module.exports = propertyController;





