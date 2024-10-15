// controllers/propertyController.js
const Property = require('../Models/Add_property');
const crypto = require('crypto');



const generatePropertyId = () => {
    const randomNumber = crypto.randomInt(1000, 100000); // Generate a random number between 1000 and 9999
    return `HVNS${randomNumber}`;
  };


// Create a new property
const createProperty = async (req, res) => {
    try {

         const propertyId =generatePropertyId();
        // Create a new property with the generated propertyId
        const property = new Property({ ...req.body, propertyId });
        await property.save();
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
        const property = await Property.findByIdAndDelete(req.params.id); // Use the _id field
        
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exporting the functions
const propertyController = {
    createProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
};

module.exports = propertyController;





