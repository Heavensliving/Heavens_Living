// controllers/propertyController.js
const Property = require('../Models/Add_property');
const crypto = require('crypto');
const Phase = require('../Models/AddPhase');



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
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.status(200).json({ message: 'Property updated successfully', property });
    } catch (error) {
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





